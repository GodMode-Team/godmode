(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const mp="modulepreload",vp=function(e,t){return new URL(e,t).href},ar={},E=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let p=function(r){return Promise.all(r.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),d=c?.nonce||c?.getAttribute("nonce");i=p(n.map(r=>{if(r=vp(r,s),r in ar)return;ar[r]=!0;const u=r.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(s)for(let b=o.length-1;b>=0;b--){const $=o[b];if($.href===r&&(!u||$.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${h}`))return;const y=document.createElement("link");if(y.rel=u?"stylesheet":mp,u||(y.as="script"),y.crossOrigin="",y.href=r,d&&y.setAttribute("nonce",d),document.head.appendChild(y),u)return new Promise((b,$)=>{y.addEventListener("load",b),y.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${r}`)))})}))}function a(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&a(c.reason);return t().catch(a)})};const Ss=globalThis,Oa=Ss.ShadowRoot&&(Ss.ShadyCSS===void 0||Ss.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fa=Symbol(),or=new WeakMap;let uc=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Fa)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(Oa&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=or.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&or.set(n,t))}return t}toString(){return this.cssText}};const yp=e=>new uc(typeof e=="string"?e:e+"",void 0,Fa),bp=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new uc(n,e,Fa)},wp=(e,t)=>{if(Oa)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=Ss.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},rr=Oa?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return yp(n)})(e):e;const{is:kp,defineProperty:$p,getOwnPropertyDescriptor:Sp,getOwnPropertyNames:xp,getOwnPropertySymbols:Ap,getPrototypeOf:Tp}=Object,Gs=globalThis,lr=Gs.trustedTypes,_p=lr?lr.emptyScript:"",Cp=Gs.reactiveElementPolyfillSupport,Bn=(e,t)=>e,Ps={toAttribute(e,t){switch(t){case Boolean:e=e?_p:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Na=(e,t)=>!kp(e,t),cr={attribute:!0,type:String,converter:Ps,reflect:!1,useDefault:!1,hasChanged:Na};Symbol.metadata??=Symbol("metadata"),Gs.litPropertyMetadata??=new WeakMap;let tn=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=cr){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&$p(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:a}=Sp(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:i,set(o){const c=i?.call(this);a?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??cr}static _$Ei(){if(this.hasOwnProperty(Bn("elementProperties")))return;const t=Tp(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Bn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Bn("properties"))){const n=this.properties,s=[...xp(n),...Ap(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(rr(i))}else t!==void 0&&n.push(rr(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wp(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:Ps).toAttribute(n,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ps;this._$Em=i;const c=o.fromAttribute(n,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,n,s,i=!1,a){if(t!==void 0){const o=this.constructor;if(i===!1&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Na)(a,n)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};tn.elementStyles=[],tn.shadowRootOptions={mode:"open"},tn[Bn("elementProperties")]=new Map,tn[Bn("finalized")]=new Map,Cp?.({ReactiveElement:tn}),(Gs.reactiveElementVersions??=[]).push("2.1.2");const Ba=globalThis,dr=e=>e,Ls=Ba.trustedTypes,ur=Ls?Ls.createPolicy("lit-html",{createHTML:e=>e}):void 0,pc="$lit$",rt=`lit$${Math.random().toFixed(9).slice(2)}$`,hc="?"+rt,Ep=`<${hc}>`,It=document,qn=()=>It.createComment(""),jn=e=>e===null||typeof e!="object"&&typeof e!="function",Ua=Array.isArray,Rp=e=>Ua(e)||typeof e?.[Symbol.iterator]=="function",_i=`[ 	
\f\r]`,kn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pr=/-->/g,hr=/>/g,kt=RegExp(`>|${_i}(?:([^\\s"'>=/]+)(${_i}*=${_i}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fr=/'/g,gr=/"/g,fc=/^(?:script|style|textarea|title)$/i,Pp=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),l=Pp(1),pt=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),mr=new WeakMap,Rt=It.createTreeWalker(It,129);function gc(e,t){if(!Ua(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ur!==void 0?ur.createHTML(t):t}const Lp=(e,t)=>{const n=e.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",o=kn;for(let c=0;c<n;c++){const d=e[c];let p,r,u=-1,h=0;for(;h<d.length&&(o.lastIndex=h,r=o.exec(d),r!==null);)h=o.lastIndex,o===kn?r[1]==="!--"?o=pr:r[1]!==void 0?o=hr:r[2]!==void 0?(fc.test(r[2])&&(i=RegExp("</"+r[2],"g")),o=kt):r[3]!==void 0&&(o=kt):o===kt?r[0]===">"?(o=i??kn,u=-1):r[1]===void 0?u=-2:(u=o.lastIndex-r[2].length,p=r[1],o=r[3]===void 0?kt:r[3]==='"'?gr:fr):o===gr||o===fr?o=kt:o===pr||o===hr?o=kn:(o=kt,i=void 0);const y=o===kt&&e[c+1].startsWith("/>")?" ":"";a+=o===kn?d+Ep:u>=0?(s.push(p),d.slice(0,u)+pc+d.slice(u)+rt+y):d+rt+(u===-2?c:y)}return[gc(e,a+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Hn{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let a=0,o=0;const c=t.length-1,d=this.parts,[p,r]=Lp(t,n);if(this.el=Hn.createElement(p,s),Rt.currentNode=this.el.content,n===2||n===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Rt.nextNode())!==null&&d.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(pc)){const h=r[o++],y=i.getAttribute(u).split(rt),b=/([.?@])?(.*)/.exec(h);d.push({type:1,index:a,name:b[2],strings:y,ctor:b[1]==="."?Dp:b[1]==="?"?Mp:b[1]==="@"?Op:Ys}),i.removeAttribute(u)}else u.startsWith(rt)&&(d.push({type:6,index:a}),i.removeAttribute(u));if(fc.test(i.tagName)){const u=i.textContent.split(rt),h=u.length-1;if(h>0){i.textContent=Ls?Ls.emptyScript:"";for(let y=0;y<h;y++)i.append(u[y],qn()),Rt.nextNode(),d.push({type:2,index:++a});i.append(u[h],qn())}}}else if(i.nodeType===8)if(i.data===hc)d.push({type:2,index:a});else{let u=-1;for(;(u=i.data.indexOf(rt,u+1))!==-1;)d.push({type:7,index:a}),u+=rt.length-1}a++}}static createElement(t,n){const s=It.createElement("template");return s.innerHTML=t,s}}function ln(e,t,n=e,s){if(t===pt)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const a=jn(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=ln(e,i._$AS(e,t.values),i,s)),t}class Ip{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??It).importNode(n,!0);Rt.currentNode=i;let a=Rt.nextNode(),o=0,c=0,d=s[0];for(;d!==void 0;){if(o===d.index){let p;d.type===2?p=new Qs(a,a.nextSibling,this,t):d.type===1?p=new d.ctor(a,d.name,d.strings,this,t):d.type===6&&(p=new Fp(a,this,t)),this._$AV.push(p),d=s[++c]}o!==d?.index&&(a=Rt.nextNode(),o++)}return Rt.currentNode=It,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Qs=class mc{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=ln(this,t,n),jn(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==pt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rp(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&jn(this._$AH)?this._$AA.nextSibling.data=t:this.T(It.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Hn.createElement(gc(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const a=new Ip(i,this),o=a.u(this.options);a.p(n),this.T(o),this._$AH=a}}_$AC(t){let n=mr.get(t.strings);return n===void 0&&mr.set(t.strings,n=new Hn(t)),n}k(t){Ua(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const a of t)i===n.length?n.push(s=new mc(this.O(qn()),this.O(qn()),this,this.options)):s=n[i],s._$AI(a),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=dr(t).nextSibling;dr(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ys=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(t,n=this,s,i){const a=this.strings;let o=!1;if(a===void 0)t=ln(this,t,n,0),o=!jn(t)||t!==this._$AH&&t!==pt,o&&(this._$AH=t);else{const c=t;let d,p;for(t=a[0],d=0;d<a.length-1;d++)p=ln(this,c[s+d],n,d),p===pt&&(p=this._$AH[d]),o||=!jn(p)||p!==this._$AH[d],p===f?t=f:t!==f&&(t+=(p??"")+a[d+1]),this._$AH[d]=p}o&&!i&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Dp=class extends Ys{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},Mp=class extends Ys{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},Op=class extends Ys{constructor(t,n,s,i,a){super(t,n,s,i,a),this.type=5}_$AI(t,n=this){if((t=ln(this,t,n,0)??f)===pt)return;const s=this._$AH,i=t===f&&s!==f||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==f&&(s===f||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Fp=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ln(this,t)}};const Np={I:Qs},Bp=Ba.litHtmlPolyfillSupport;Bp?.(Hn,Qs),(Ba.litHtmlVersions??=[]).push("3.3.2");const Up=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const a=n?.renderBefore??null;s._$litPart$=i=new Qs(t.insertBefore(qn(),a),a,void 0,n??{})}return i._$AI(e),i};const za=globalThis;let on=class extends tn{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Up(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pt}};on._$litElement$=!0,on.finalized=!0,za.litElementHydrateSupport?.({LitElement:on});const zp=za.litElementPolyfillSupport;zp?.({LitElement:on});(za.litElementVersions??=[]).push("4.2.2");const vc=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Kp={attribute:!0,type:String,converter:Ps,reflect:!1,hasChanged:Na},Wp=(e=Kp,t,n)=>{const{kind:s,metadata:i}=n;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(c){const d=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,d,e,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,e,c),c}}}if(s==="setter"){const{name:o}=n;return function(c){const d=this[o];t.call(this,c),this.requestUpdate(o,d,e,!0,c)}}throw Error("Unsupported decorator location: "+s)};function ts(e){return(t,n)=>typeof n=="object"?Wp(e,t,n):((s,i,a)=>{const o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(e,t,n)}function v(e){return ts({...e,state:!0,attribute:!1})}async function Ie(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function qp(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function jp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Hp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Dt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function cn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function yc(e,t,n){if(t.length===0)return;let s=e;for(let a=0;a<t.length-1;a+=1){const o=t[a],c=t[a+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof c=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const d=s;d[o]==null&&(d[o]=typeof c=="number"?[]:{}),s=d[o]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function bc(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const a=t[i];if(typeof a=="number"){if(!Array.isArray(n))return;n=n[a]}else{if(typeof n!="object"||n==null)return;n=n[a]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Je(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Gp(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function wc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});Vp(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function Vp(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Gp(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?cn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=cn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Dt(t.config??{}),e.configFormOriginal=Dt(t.config??{}),e.configRawOriginal=n)}async function Is(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?cn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Je(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function Qp(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?cn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Je(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Yp(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function sn(e,t,n){const s=Dt(e.configForm??e.configSnapshot?.config??{});yc(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=cn(s))}function vr(e,t){const n=Dt(e.configForm??e.configSnapshot?.config??{});bc(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=cn(n))}async function Jp(e,t,n){sn(e,["agents","defaults","model","primary"],t),sn(e,["agents","defaults","model","fallbacks"],n),await Is(e)}function Xp(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Zp(e){const{state:t,callbacks:n,accountId:s}=e,i=Xp(t),a=(c,d,p={})=>{const{type:r="text",placeholder:u,maxLength:h,help:y}=p,b=t.values[c]??"",$=t.fieldErrors[c],k=`nostr-profile-${c}`;return r==="textarea"?l`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${k}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${k}"
            .value=${b}
            placeholder=${u??""}
            maxlength=${h??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const A=S.target;n.onFieldChange(c,A.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${y?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${y}</div>`:f}
          ${$?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:f}
        </div>
      `:l`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${k}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${k}"
          type=${r}
          .value=${b}
          placeholder=${u??""}
          maxlength=${h??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const A=S.target;n.onFieldChange(c,A.value)}}
          ?disabled=${t.saving}
        />
        ${y?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${y}</div>`:f}
        ${$?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:f}
      </div>
    `},o=()=>{const c=t.values.picture;return c?l`
      <div style="margin-bottom: 12px;">
        <img
          src=${c}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${d=>{const p=d.target;p.style.display="none"}}
          @load=${d=>{const p=d.target;p.style.display="block"}}
        />
      </div>
    `:f};return l`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?l`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:f}

      ${t.success?l`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:f}

      ${o()}

      ${a("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${a("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${a("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${a("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?l`
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

      ${i?l`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:f}
    </div>
  `}function eh(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function th(e,t){await qp(e,t),await Ie(e,!0)}async function nh(e){await jp(e),await Ie(e,!0)}async function sh(e){await Hp(e),await Ie(e,!0)}async function ih(e){await Is(e),await Je(e),await Ie(e,!0)}async function ah(e){await Je(e),await Ie(e,!0)}function oh(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function kc(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function $c(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function rh(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=eh(n??void 0)}function lh(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function ch(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function dh(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function uh(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=kc(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch($c(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:oh(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Ie(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function ph(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=kc(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch($c(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const d=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:d,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,c=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:c},i.saved&&await Ie(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Sc(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const hh=80;function ve(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=n();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function xc(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function fh(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<hh?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function gh(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Js(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function mh(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function vh(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const yh=[{label:"",tabs:["chat","today","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","skills","agents","trust","guardrails","options"]}],bh=[{label:"System",tabs:["channels","sessions","cron","debug"]}],Ac={onboarding:"/onboarding",options:"/options",workspaces:"/workspaces",today:"/today",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain",dashboards:"/dashboards"},ht=new Map(Object.entries(Ac).map(([e,t])=>[t,e]));ht.set("/my-day","today");ht.set("/work","workspaces");ht.set("/setup","onboarding");ht.set("/overview","dashboards");ht.set("/mission-control","dashboards");function Xs(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Vn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Ka(e,t=""){const n=Xs(t),s=Ac[e]??`/${e}`;return n?`${n}${s}`:s}function Tc(e,t=""){const n=Xs(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=Vn(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":ht.get(i)??null}function wh(e){let t=Vn(e);if(t.endsWith("/index.html")&&(t=Vn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(ht.has(i)){const a=n.slice(0,s);return!a.length||a.some(c=>ht.has(`/${c.toLowerCase()}`))?"":`/${a.join("/")}`}}return`/${n.join("/")}`}function Gn(e){switch(e){case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":return"Today";case"workspaces":return"Work";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"options":return"Experiments";case"trust":return"Trust";case"guardrails":return"Safety";case"second-brain":return"Second Brain";case"dashboards":return"Dashboards";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function kh(e){switch(e){case"onboarding":return"🧭";case"chat":return"💬";case"today":return"☀️";case"workspaces":return"📂";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function $h(e){switch(e){case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":return"Calendar, brief, tasks, and schedule for the day.";case"workspaces":return"Projects, clients, and personal operating context.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"options":return"Beta features you can toggle on or off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const Q="main";function Sh(e){const t=[`viewing ${Gn(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const xh=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,ms=/<\s*\/?\s*final\b[^>]*>/gi,yr=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function Ah(e,t){return e.trimStart()}function Th(e,t){if(!e||!xh.test(e))return e;let n=e;ms.test(n)?(ms.lastIndex=0,n=n.replace(ms,"")):ms.lastIndex=0,yr.lastIndex=0;let s="",i=0,a=!1;for(const o of n.matchAll(yr)){const c=o.index??0,d=o[1]==="/";a?d&&(a=!1):(s+=n.slice(i,c),d||(a=!0)),i=c+o[0].length}return s+=n.slice(i),Ah(s)}function Qn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function B(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const i=Math.round(s/60);return i<48?`${i}h ago`:`${Math.round(i/24)}d ago`}function _h(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function _c(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function oa(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function Yn(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Cc(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Ds(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function re(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${i}`}function Ci(e){return Th(e)}const br=50,Ch=80,Eh=12e4;function ae(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function ie(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function wr(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${ae(ie(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${ae(ie(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${ae(ie(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${ae(ie(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${ae(ie(n.query),45)}"`:"";case"web_fetch":try{const p=new URL(ie(n.url));return p.hostname+(p.pathname!=="/"?p.pathname.slice(0,30):"")}catch{return ae(ie(n.url||""),50)}case"memory_search":return n.query?`"${ae(ie(n.query),45)}"`:"";case"browser":const s=ie(n.action),i=n.ref?` #${ie(n.ref)}`:"",a=n.targetUrl?` ${ae(ie(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${ie(n.action)}${n.target?` → ${ae(ie(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${ae(ie(n.task),40)}"`:"";case"cron":return n.action?ie(n.action):"";case"files_read":return n.fileId?`file:${ae(ie(n.fileId),20)}`:"";case"image":return n.image?ae(ie(n.image),40):"";default:const o=Object.keys(n).filter(p=>!["timeout","timeoutMs"].includes(p));if(o.length===0)return"";const c=o[0],d=n[c];return typeof d=="string"?`${c}: ${ae(d,35)}`:""}}function kr(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:ae(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),c=o.results?.length??o.count??0;return`${c} result${c!==1?"s":""}`}catch{return ae(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":ae(t,40):a>100?`${a.toLocaleString()} chars`:ae(t,50)}function $r(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Rh(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function Sr(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Rh(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Cc(n,Eh);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Ph(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Lh(e){if(e.toolStreamOrder.length<=br)return;const t=e.toolStreamOrder.length-br,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Ih(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function ra(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Ih(e)}function Dh(e,t=!1){if(t){ra(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>ra(e),Ch))}function Wa(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),ra(e)}const Mh=5e3;function Oh(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Mh))}function Fh(e,t){if(!t)return;if(t.stream==="compaction"){Oh(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",c=o==="start"?s.args:void 0,d=o==="update"?Sr(s.partialResult):o==="result"?Sr(s.result):void 0,p=Date.now();let r=e.toolStreamById.get(i);r?(r.name=a,c!==void 0&&(r.args=c,r.displayArgs=wr(a,c)),d!==void 0&&(r.output=d,r.resultSummary=kr(a,d),r.success=$r(d)),r.updatedAt=p):(r={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:c,output:d,startedAt:typeof t.ts=="number"?t.ts:p,updatedAt:p,message:{},displayArgs:c?wr(a,c):void 0},e.toolStreamById.set(i,r),e.toolStreamOrder.push(i)),o==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:r.displayArgs||void 0,startedAt:r.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,r.completedAt=p,r.resultSummary=kr(a,r.output),r.success=$r(r.output)),r.message=Ph(r),Lh(e),Dh(e,o==="result")}const qa={CHILD:2},ja=e=>(...t)=>({_$litDirective$:e,values:t});let Ha=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class la extends Ha{constructor(t){if(super(t),this.it=f,t.type!==qa.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===f||t==null)return this._t=void 0,this.it=t;if(t===pt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}la.directiveName="unsafeHTML",la.resultType=1;const Le=ja(la);const{entries:Ec,setPrototypeOf:xr,isFrozen:Nh,getPrototypeOf:Bh,getOwnPropertyDescriptor:Uh}=Object;let{freeze:fe,seal:Ae,create:ca}=Object,{apply:da,construct:ua}=typeof Reflect<"u"&&Reflect;fe||(fe=function(t){return t});Ae||(Ae=function(t){return t});da||(da=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),a=2;a<s;a++)i[a-2]=arguments[a];return t.apply(n,i)});ua||(ua=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const vs=ge(Array.prototype.forEach),zh=ge(Array.prototype.lastIndexOf),Ar=ge(Array.prototype.pop),$n=ge(Array.prototype.push),Kh=ge(Array.prototype.splice),xs=ge(String.prototype.toLowerCase),Ei=ge(String.prototype.toString),Ri=ge(String.prototype.match),Sn=ge(String.prototype.replace),Wh=ge(String.prototype.indexOf),qh=ge(String.prototype.trim),_e=ge(Object.prototype.hasOwnProperty),ue=ge(RegExp.prototype.test),xn=jh(TypeError);function ge(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return da(e,t,s)}}function jh(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return ua(e,n)}}function F(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:xs;xr&&xr(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const a=n(i);a!==i&&(Nh(t)||(t[s]=a),i=a)}e[i]=!0}return e}function Hh(e){for(let t=0;t<e.length;t++)_e(e,t)||(e[t]=null);return e}function Fe(e){const t=ca(null);for(const[n,s]of Ec(e))_e(e,n)&&(Array.isArray(s)?t[n]=Hh(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=Fe(s):t[n]=s);return t}function An(e,t){for(;e!==null;){const s=Uh(e,t);if(s){if(s.get)return ge(s.get);if(typeof s.value=="function")return ge(s.value)}e=Bh(e)}function n(){return null}return n}const Tr=fe(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Pi=fe(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Li=fe(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Vh=fe(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ii=fe(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Gh=fe(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),_r=fe(["#text"]),Cr=fe(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Di=fe(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Er=fe(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ys=fe(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Qh=Ae(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Yh=Ae(/<%[\w\W]*|[\w\W]*%>/gm),Jh=Ae(/\$\{[\w\W]*/gm),Xh=Ae(/^data-[\-\w.\u00B7-\uFFFF]+$/),Zh=Ae(/^aria-[\-\w]+$/),Rc=Ae(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ef=Ae(/^(?:\w+script|data):/i),tf=Ae(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Pc=Ae(/^html$/i),nf=Ae(/^[a-z][.\w]*(-[.\w]+)+$/i);var Rr=Object.freeze({__proto__:null,ARIA_ATTR:Zh,ATTR_WHITESPACE:tf,CUSTOM_ELEMENT:nf,DATA_ATTR:Xh,DOCTYPE_NAME:Pc,ERB_EXPR:Yh,IS_ALLOWED_URI:Rc,IS_SCRIPT_OR_DATA:ef,MUSTACHE_EXPR:Qh,TMPLIT_EXPR:Jh});const Tn={element:1,text:3,progressingInstruction:7,comment:8,document:9},sf=function(){return typeof window>"u"?null:window},af=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Pr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Lc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:sf();const t=M=>Lc(M);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Tn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:o,Node:c,Element:d,NodeFilter:p,NamedNodeMap:r=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:u,DOMParser:h,trustedTypes:y}=e,b=d.prototype,$=An(b,"cloneNode"),k=An(b,"remove"),S=An(b,"nextSibling"),A=An(b,"childNodes"),P=An(b,"parentNode");if(typeof o=="function"){const M=n.createElement("template");M.content&&M.content.ownerDocument&&(n=M.content.ownerDocument)}let R,x="";const{implementation:_,createNodeIterator:T,createDocumentFragment:N,getElementsByTagName:D}=n,{importNode:z}=s;let W=Pr();t.isSupported=typeof Ec=="function"&&typeof P=="function"&&_&&_.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:j,ERB_EXPR:de,TMPLIT_EXPR:Te,DATA_ATTR:Ke,ARIA_ATTR:Y,IS_SCRIPT_OR_DATA:te,ATTR_WHITESPACE:O,CUSTOM_ELEMENT:ke}=Rr;let{IS_ALLOWED_URI:vt}=Rr,J=null;const jt=F({},[...Tr,...Pi,...Li,...Ii,..._r]);let q=null;const gn=F({},[...Cr,...Di,...Er,...ys]);let V=Object.seal(ca(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),st=null,Ht=null;const We=Object.seal(ca(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Vt=!0,mn=!0,vn=!1,yn=!0,yt=!1,cs=!0,bt=!1,vi=!1,yi=!1,Gt=!1,ds=!1,us=!1,Ko=!0,Wo=!1;const lp="user-content-";let bi=!0,bn=!1,Qt={},De=null;const wi=F({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let qo=null;const jo=F({},["audio","video","img","source","image","track"]);let ki=null;const Ho=F({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ps="http://www.w3.org/1998/Math/MathML",hs="http://www.w3.org/2000/svg",qe="http://www.w3.org/1999/xhtml";let Yt=qe,$i=!1,Si=null;const cp=F({},[ps,hs,qe],Ei);let fs=F({},["mi","mo","mn","ms","mtext"]),gs=F({},["annotation-xml"]);const dp=F({},["title","style","font","a","script"]);let wn=null;const up=["application/xhtml+xml","text/html"],pp="text/html";let ee=null,Jt=null;const hp=n.createElement("form"),Vo=function(w){return w instanceof RegExp||w instanceof Function},xi=function(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Jt&&Jt===w)){if((!w||typeof w!="object")&&(w={}),w=Fe(w),wn=up.indexOf(w.PARSER_MEDIA_TYPE)===-1?pp:w.PARSER_MEDIA_TYPE,ee=wn==="application/xhtml+xml"?Ei:xs,J=_e(w,"ALLOWED_TAGS")?F({},w.ALLOWED_TAGS,ee):jt,q=_e(w,"ALLOWED_ATTR")?F({},w.ALLOWED_ATTR,ee):gn,Si=_e(w,"ALLOWED_NAMESPACES")?F({},w.ALLOWED_NAMESPACES,Ei):cp,ki=_e(w,"ADD_URI_SAFE_ATTR")?F(Fe(Ho),w.ADD_URI_SAFE_ATTR,ee):Ho,qo=_e(w,"ADD_DATA_URI_TAGS")?F(Fe(jo),w.ADD_DATA_URI_TAGS,ee):jo,De=_e(w,"FORBID_CONTENTS")?F({},w.FORBID_CONTENTS,ee):wi,st=_e(w,"FORBID_TAGS")?F({},w.FORBID_TAGS,ee):Fe({}),Ht=_e(w,"FORBID_ATTR")?F({},w.FORBID_ATTR,ee):Fe({}),Qt=_e(w,"USE_PROFILES")?w.USE_PROFILES:!1,Vt=w.ALLOW_ARIA_ATTR!==!1,mn=w.ALLOW_DATA_ATTR!==!1,vn=w.ALLOW_UNKNOWN_PROTOCOLS||!1,yn=w.ALLOW_SELF_CLOSE_IN_ATTR!==!1,yt=w.SAFE_FOR_TEMPLATES||!1,cs=w.SAFE_FOR_XML!==!1,bt=w.WHOLE_DOCUMENT||!1,Gt=w.RETURN_DOM||!1,ds=w.RETURN_DOM_FRAGMENT||!1,us=w.RETURN_TRUSTED_TYPE||!1,yi=w.FORCE_BODY||!1,Ko=w.SANITIZE_DOM!==!1,Wo=w.SANITIZE_NAMED_PROPS||!1,bi=w.KEEP_CONTENT!==!1,bn=w.IN_PLACE||!1,vt=w.ALLOWED_URI_REGEXP||Rc,Yt=w.NAMESPACE||qe,fs=w.MATHML_TEXT_INTEGRATION_POINTS||fs,gs=w.HTML_INTEGRATION_POINTS||gs,V=w.CUSTOM_ELEMENT_HANDLING||{},w.CUSTOM_ELEMENT_HANDLING&&Vo(w.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(V.tagNameCheck=w.CUSTOM_ELEMENT_HANDLING.tagNameCheck),w.CUSTOM_ELEMENT_HANDLING&&Vo(w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(V.attributeNameCheck=w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),w.CUSTOM_ELEMENT_HANDLING&&typeof w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(V.allowCustomizedBuiltInElements=w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),yt&&(mn=!1),ds&&(Gt=!0),Qt&&(J=F({},_r),q=[],Qt.html===!0&&(F(J,Tr),F(q,Cr)),Qt.svg===!0&&(F(J,Pi),F(q,Di),F(q,ys)),Qt.svgFilters===!0&&(F(J,Li),F(q,Di),F(q,ys)),Qt.mathMl===!0&&(F(J,Ii),F(q,Er),F(q,ys))),w.ADD_TAGS&&(typeof w.ADD_TAGS=="function"?We.tagCheck=w.ADD_TAGS:(J===jt&&(J=Fe(J)),F(J,w.ADD_TAGS,ee))),w.ADD_ATTR&&(typeof w.ADD_ATTR=="function"?We.attributeCheck=w.ADD_ATTR:(q===gn&&(q=Fe(q)),F(q,w.ADD_ATTR,ee))),w.ADD_URI_SAFE_ATTR&&F(ki,w.ADD_URI_SAFE_ATTR,ee),w.FORBID_CONTENTS&&(De===wi&&(De=Fe(De)),F(De,w.FORBID_CONTENTS,ee)),w.ADD_FORBID_CONTENTS&&(De===wi&&(De=Fe(De)),F(De,w.ADD_FORBID_CONTENTS,ee)),bi&&(J["#text"]=!0),bt&&F(J,["html","head","body"]),J.table&&(F(J,["tbody"]),delete st.tbody),w.TRUSTED_TYPES_POLICY){if(typeof w.TRUSTED_TYPES_POLICY.createHTML!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof w.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');R=w.TRUSTED_TYPES_POLICY,x=R.createHTML("")}else R===void 0&&(R=af(y,i)),R!==null&&typeof x=="string"&&(x=R.createHTML(""));fe&&fe(w),Jt=w}},Go=F({},[...Pi,...Li,...Vh]),Qo=F({},[...Ii,...Gh]),fp=function(w){let C=P(w);(!C||!C.tagName)&&(C={namespaceURI:Yt,tagName:"template"});const I=xs(w.tagName),G=xs(C.tagName);return Si[w.namespaceURI]?w.namespaceURI===hs?C.namespaceURI===qe?I==="svg":C.namespaceURI===ps?I==="svg"&&(G==="annotation-xml"||fs[G]):!!Go[I]:w.namespaceURI===ps?C.namespaceURI===qe?I==="math":C.namespaceURI===hs?I==="math"&&gs[G]:!!Qo[I]:w.namespaceURI===qe?C.namespaceURI===hs&&!gs[G]||C.namespaceURI===ps&&!fs[G]?!1:!Qo[I]&&(dp[I]||!Go[I]):!!(wn==="application/xhtml+xml"&&Si[w.namespaceURI]):!1},Me=function(w){$n(t.removed,{element:w});try{P(w).removeChild(w)}catch{k(w)}},wt=function(w,C){try{$n(t.removed,{attribute:C.getAttributeNode(w),from:C})}catch{$n(t.removed,{attribute:null,from:C})}if(C.removeAttribute(w),w==="is")if(Gt||ds)try{Me(C)}catch{}else try{C.setAttribute(w,"")}catch{}},Yo=function(w){let C=null,I=null;if(yi)w="<remove></remove>"+w;else{const X=Ri(w,/^[\r\n\t ]+/);I=X&&X[0]}wn==="application/xhtml+xml"&&Yt===qe&&(w='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+w+"</body></html>");const G=R?R.createHTML(w):w;if(Yt===qe)try{C=new h().parseFromString(G,wn)}catch{}if(!C||!C.documentElement){C=_.createDocument(Yt,"template",null);try{C.documentElement.innerHTML=$i?x:G}catch{}}const le=C.body||C.documentElement;return w&&I&&le.insertBefore(n.createTextNode(I),le.childNodes[0]||null),Yt===qe?D.call(C,bt?"html":"body")[0]:bt?C.documentElement:le},Jo=function(w){return T.call(w.ownerDocument||w,w,p.SHOW_ELEMENT|p.SHOW_COMMENT|p.SHOW_TEXT|p.SHOW_PROCESSING_INSTRUCTION|p.SHOW_CDATA_SECTION,null)},Ai=function(w){return w instanceof u&&(typeof w.nodeName!="string"||typeof w.textContent!="string"||typeof w.removeChild!="function"||!(w.attributes instanceof r)||typeof w.removeAttribute!="function"||typeof w.setAttribute!="function"||typeof w.namespaceURI!="string"||typeof w.insertBefore!="function"||typeof w.hasChildNodes!="function")},Xo=function(w){return typeof c=="function"&&w instanceof c};function je(M,w,C){vs(M,I=>{I.call(t,w,C,Jt)})}const Zo=function(w){let C=null;if(je(W.beforeSanitizeElements,w,null),Ai(w))return Me(w),!0;const I=ee(w.nodeName);if(je(W.uponSanitizeElement,w,{tagName:I,allowedTags:J}),cs&&w.hasChildNodes()&&!Xo(w.firstElementChild)&&ue(/<[/\w!]/g,w.innerHTML)&&ue(/<[/\w!]/g,w.textContent)||w.nodeType===Tn.progressingInstruction||cs&&w.nodeType===Tn.comment&&ue(/<[/\w]/g,w.data))return Me(w),!0;if(!(We.tagCheck instanceof Function&&We.tagCheck(I))&&(!J[I]||st[I])){if(!st[I]&&tr(I)&&(V.tagNameCheck instanceof RegExp&&ue(V.tagNameCheck,I)||V.tagNameCheck instanceof Function&&V.tagNameCheck(I)))return!1;if(bi&&!De[I]){const G=P(w)||w.parentNode,le=A(w)||w.childNodes;if(le&&G){const X=le.length;for(let me=X-1;me>=0;--me){const He=$(le[me],!0);He.__removalCount=(w.__removalCount||0)+1,G.insertBefore(He,S(w))}}}return Me(w),!0}return w instanceof d&&!fp(w)||(I==="noscript"||I==="noembed"||I==="noframes")&&ue(/<\/no(script|embed|frames)/i,w.innerHTML)?(Me(w),!0):(yt&&w.nodeType===Tn.text&&(C=w.textContent,vs([j,de,Te],G=>{C=Sn(C,G," ")}),w.textContent!==C&&($n(t.removed,{element:w.cloneNode()}),w.textContent=C)),je(W.afterSanitizeElements,w,null),!1)},er=function(w,C,I){if(Ko&&(C==="id"||C==="name")&&(I in n||I in hp))return!1;if(!(mn&&!Ht[C]&&ue(Ke,C))){if(!(Vt&&ue(Y,C))){if(!(We.attributeCheck instanceof Function&&We.attributeCheck(C,w))){if(!q[C]||Ht[C]){if(!(tr(w)&&(V.tagNameCheck instanceof RegExp&&ue(V.tagNameCheck,w)||V.tagNameCheck instanceof Function&&V.tagNameCheck(w))&&(V.attributeNameCheck instanceof RegExp&&ue(V.attributeNameCheck,C)||V.attributeNameCheck instanceof Function&&V.attributeNameCheck(C,w))||C==="is"&&V.allowCustomizedBuiltInElements&&(V.tagNameCheck instanceof RegExp&&ue(V.tagNameCheck,I)||V.tagNameCheck instanceof Function&&V.tagNameCheck(I))))return!1}else if(!ki[C]){if(!ue(vt,Sn(I,O,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&w!=="script"&&Wh(I,"data:")===0&&qo[w])){if(!(vn&&!ue(te,Sn(I,O,"")))){if(I)return!1}}}}}}}return!0},tr=function(w){return w!=="annotation-xml"&&Ri(w,ke)},nr=function(w){je(W.beforeSanitizeAttributes,w,null);const{attributes:C}=w;if(!C||Ai(w))return;const I={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:q,forceKeepAttr:void 0};let G=C.length;for(;G--;){const le=C[G],{name:X,namespaceURI:me,value:He}=le,Xt=ee(X),Ti=He;let se=X==="value"?Ti:qh(Ti);if(I.attrName=Xt,I.attrValue=se,I.keepAttr=!0,I.forceKeepAttr=void 0,je(W.uponSanitizeAttribute,w,I),se=I.attrValue,Wo&&(Xt==="id"||Xt==="name")&&(wt(X,w),se=lp+se),cs&&ue(/((--!?|])>)|<\/(style|title|textarea)/i,se)){wt(X,w);continue}if(Xt==="attributename"&&Ri(se,"href")){wt(X,w);continue}if(I.forceKeepAttr)continue;if(!I.keepAttr){wt(X,w);continue}if(!yn&&ue(/\/>/i,se)){wt(X,w);continue}yt&&vs([j,de,Te],ir=>{se=Sn(se,ir," ")});const sr=ee(w.nodeName);if(!er(sr,Xt,se)){wt(X,w);continue}if(R&&typeof y=="object"&&typeof y.getAttributeType=="function"&&!me)switch(y.getAttributeType(sr,Xt)){case"TrustedHTML":{se=R.createHTML(se);break}case"TrustedScriptURL":{se=R.createScriptURL(se);break}}if(se!==Ti)try{me?w.setAttributeNS(me,X,se):w.setAttribute(X,se),Ai(w)?Me(w):Ar(t.removed)}catch{wt(X,w)}}je(W.afterSanitizeAttributes,w,null)},gp=function M(w){let C=null;const I=Jo(w);for(je(W.beforeSanitizeShadowDOM,w,null);C=I.nextNode();)je(W.uponSanitizeShadowNode,C,null),Zo(C),nr(C),C.content instanceof a&&M(C.content);je(W.afterSanitizeShadowDOM,w,null)};return t.sanitize=function(M){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,I=null,G=null,le=null;if($i=!M,$i&&(M="<!-->"),typeof M!="string"&&!Xo(M))if(typeof M.toString=="function"){if(M=M.toString(),typeof M!="string")throw xn("dirty is not a string, aborting")}else throw xn("toString is not a function");if(!t.isSupported)return M;if(vi||xi(w),t.removed=[],typeof M=="string"&&(bn=!1),bn){if(M.nodeName){const He=ee(M.nodeName);if(!J[He]||st[He])throw xn("root node is forbidden and cannot be sanitized in-place")}}else if(M instanceof c)C=Yo("<!---->"),I=C.ownerDocument.importNode(M,!0),I.nodeType===Tn.element&&I.nodeName==="BODY"||I.nodeName==="HTML"?C=I:C.appendChild(I);else{if(!Gt&&!yt&&!bt&&M.indexOf("<")===-1)return R&&us?R.createHTML(M):M;if(C=Yo(M),!C)return Gt?null:us?x:""}C&&yi&&Me(C.firstChild);const X=Jo(bn?M:C);for(;G=X.nextNode();)Zo(G),nr(G),G.content instanceof a&&gp(G.content);if(bn)return M;if(Gt){if(ds)for(le=N.call(C.ownerDocument);C.firstChild;)le.appendChild(C.firstChild);else le=C;return(q.shadowroot||q.shadowrootmode)&&(le=z.call(s,le,!0)),le}let me=bt?C.outerHTML:C.innerHTML;return bt&&J["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&ue(Pc,C.ownerDocument.doctype.name)&&(me="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+me),yt&&vs([j,de,Te],He=>{me=Sn(me,He," ")}),R&&us?R.createHTML(me):me},t.setConfig=function(){let M=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};xi(M),vi=!0},t.clearConfig=function(){Jt=null,vi=!1},t.isValidAttribute=function(M,w,C){Jt||xi({});const I=ee(M),G=ee(w);return er(I,G,C)},t.addHook=function(M,w){typeof w=="function"&&$n(W[M],w)},t.removeHook=function(M,w){if(w!==void 0){const C=zh(W[M],w);return C===-1?void 0:Kh(W[M],C,1)[0]}return Ar(W[M])},t.removeHooks=function(M){W[M]=[]},t.removeAllHooks=function(){W=Pr()},t}var Mt=Lc();function Va(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Kt=Va();function Ic(e){Kt=e}var Et={exec:()=>null};function U(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(he.caret,"$1"),n=n.replace(i,o),s},getRegex:()=>new RegExp(n,t)};return s}var of=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),he={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},rf=/^(?:[ \t]*(?:\n|$))+/,lf=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,cf=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ns=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,df=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Ga=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Dc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Mc=U(Dc).replace(/bull/g,Ga).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),uf=U(Dc).replace(/bull/g,Ga).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Qa=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,pf=/^[^\n]+/,Ya=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,hf=U(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ya).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ff=U(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Ga).getRegex(),Zs="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ja=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,gf=U("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ja).replace("tag",Zs).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Oc=U(Qa).replace("hr",ns).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex(),mf=U(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Oc).getRegex(),Xa={blockquote:mf,code:lf,def:hf,fences:cf,heading:df,hr:ns,html:gf,lheading:Mc,list:ff,newline:rf,paragraph:Oc,table:Et,text:pf},Lr=U("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ns).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex(),vf={...Xa,lheading:uf,table:Lr,paragraph:U(Qa).replace("hr",ns).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Lr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex()},yf={...Xa,html:U(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Ja).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Et,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:U(Qa).replace("hr",ns).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Mc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},bf=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,wf=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Fc=/^( {2,}|\\)\n(?!\s*$)/,kf=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ei=/[\p{P}\p{S}]/u,Za=/[\s\p{P}\p{S}]/u,Nc=/[^\s\p{P}\p{S}]/u,$f=U(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Za).getRegex(),Bc=/(?!~)[\p{P}\p{S}]/u,Sf=/(?!~)[\s\p{P}\p{S}]/u,xf=/(?:[^\s\p{P}\p{S}]|~)/u,Uc=/(?![*_])[\p{P}\p{S}]/u,Af=/(?![*_])[\s\p{P}\p{S}]/u,Tf=/(?:[^\s\p{P}\p{S}]|[*_])/u,_f=U(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",of?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),zc=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Cf=U(zc,"u").replace(/punct/g,ei).getRegex(),Ef=U(zc,"u").replace(/punct/g,Bc).getRegex(),Kc="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Rf=U(Kc,"gu").replace(/notPunctSpace/g,Nc).replace(/punctSpace/g,Za).replace(/punct/g,ei).getRegex(),Pf=U(Kc,"gu").replace(/notPunctSpace/g,xf).replace(/punctSpace/g,Sf).replace(/punct/g,Bc).getRegex(),Lf=U("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Nc).replace(/punctSpace/g,Za).replace(/punct/g,ei).getRegex(),If=U(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Uc).getRegex(),Df="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Mf=U(Df,"gu").replace(/notPunctSpace/g,Tf).replace(/punctSpace/g,Af).replace(/punct/g,Uc).getRegex(),Of=U(/\\(punct)/,"gu").replace(/punct/g,ei).getRegex(),Ff=U(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Nf=U(Ja).replace("(?:-->|$)","-->").getRegex(),Bf=U("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Nf).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ms=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Uf=U(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ms).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Wc=U(/^!?\[(label)\]\[(ref)\]/).replace("label",Ms).replace("ref",Ya).getRegex(),qc=U(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ya).getRegex(),zf=U("reflink|nolink(?!\\()","g").replace("reflink",Wc).replace("nolink",qc).getRegex(),Ir=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,eo={_backpedal:Et,anyPunctuation:Of,autolink:Ff,blockSkip:_f,br:Fc,code:wf,del:Et,delLDelim:Et,delRDelim:Et,emStrongLDelim:Cf,emStrongRDelimAst:Rf,emStrongRDelimUnd:Lf,escape:bf,link:Uf,nolink:qc,punctuation:$f,reflink:Wc,reflinkSearch:zf,tag:Bf,text:kf,url:Et},Kf={...eo,link:U(/^!?\[(label)\]\((.*?)\)/).replace("label",Ms).getRegex(),reflink:U(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ms).getRegex()},pa={...eo,emStrongRDelimAst:Pf,emStrongLDelim:Ef,delLDelim:If,delRDelim:Mf,url:U(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Ir).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:U(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Ir).getRegex()},Wf={...pa,br:U(Fc).replace("{2,}","*").getRegex(),text:U(pa.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},bs={normal:Xa,gfm:vf,pedantic:yf},_n={normal:eo,gfm:pa,breaks:Wf,pedantic:Kf},qf={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Dr=e=>qf[e];function Ne(e,t){if(t){if(he.escapeTest.test(e))return e.replace(he.escapeReplace,Dr)}else if(he.escapeTestNoEncode.test(e))return e.replace(he.escapeReplaceNoEncode,Dr);return e}function Mr(e){try{e=encodeURI(e).replace(he.percentDecode,"%")}catch{return null}return e}function Or(e,t){let n=e.replace(he.findPipe,(a,o,c)=>{let d=!1,p=o;for(;--p>=0&&c[p]==="\\";)d=!d;return d?"|":" |"}),s=n.split(he.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(he.slashPipe,"|");return s}function Cn(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function jf(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Hf(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let a=4-n%4;s+=" ".repeat(a),n+=a}else s+=i,n++;return s}function Fr(e,t,n,s,i){let a=t.href,o=t.title||null,c=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let d={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:o,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,d}function Vf(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[c]=o;return c.length>=i.length?a.slice(i.length):a}).join(`
`)}var Os=class{options;rules;lexer;constructor(e){this.options=e||Kt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Cn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Vf(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=Cn(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Cn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Cn(t[0],`
`).split(`
`),s="",i="",a=[];for(;n.length>0;){let o=!1,c=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))c.push(n[d]),o=!0;else if(!o)c.push(n[d]);else break;n=n.slice(d);let p=c.join(`
`),r=p.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${p}`:p,i=i?`${i}
${r}`:r;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(r,a,!0),this.lexer.state.top=u,n.length===0)break;let h=a.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let y=h,b=y.raw+`
`+n.join(`
`),$=this.blockquote(b);a[a.length-1]=$,s=s.substring(0,s.length-y.raw.length)+$.raw,i=i.substring(0,i.length-y.text.length)+$.text;break}else if(h?.type==="list"){let y=h,b=y.raw+`
`+n.join(`
`),$=this.list(b);a[a.length-1]=$,s=s.substring(0,s.length-h.raw.length)+$.raw,i=i.substring(0,i.length-y.raw.length)+$.raw,n=b.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let d=!1,p="",r="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;p=t[0],e=e.substring(p.length);let u=Hf(t[2].split(`
`,1)[0],t[1].length),h=e.split(`
`,1)[0],y=!u.trim(),b=0;if(this.options.pedantic?(b=2,r=u.trimStart()):y?b=t[1].length+1:(b=u.search(this.rules.other.nonSpaceChar),b=b>4?1:b,r=u.slice(b),b+=t[1].length),y&&this.rules.other.blankLine.test(h)&&(p+=h+`
`,e=e.substring(h.length+1),d=!0),!d){let $=this.rules.other.nextBulletRegex(b),k=this.rules.other.hrRegex(b),S=this.rules.other.fencesBeginRegex(b),A=this.rules.other.headingBeginRegex(b),P=this.rules.other.htmlBeginRegex(b),R=this.rules.other.blockquoteBeginRegex(b);for(;e;){let x=e.split(`
`,1)[0],_;if(h=x,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),_=h):_=h.replace(this.rules.other.tabCharGlobal,"    "),S.test(h)||A.test(h)||P.test(h)||R.test(h)||$.test(h)||k.test(h))break;if(_.search(this.rules.other.nonSpaceChar)>=b||!h.trim())r+=`
`+_.slice(b);else{if(y||u.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(u)||A.test(u)||k.test(u))break;r+=`
`+h}y=!h.trim(),p+=x+`
`,e=e.substring(x.length+1),u=_.slice(b)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(p)&&(o=!0)),i.items.push({type:"list_item",raw:p,task:!!this.options.gfm&&this.rules.other.listIsTask.test(r),loose:!1,text:r,tokens:[]}),i.raw+=p}let c=i.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d of i.items){if(this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]),d.task){if(d.text=d.text.replace(this.rules.other.listReplaceTask,""),d.tokens[0]?.type==="text"||d.tokens[0]?.type==="paragraph"){d.tokens[0].raw=d.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),d.tokens[0].text=d.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let r=this.lexer.inlineQueue.length-1;r>=0;r--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[r].src)){this.lexer.inlineQueue[r].src=this.lexer.inlineQueue[r].src.replace(this.rules.other.listReplaceTask,"");break}}let p=this.rules.other.listTaskCheckbox.exec(d.raw);if(p){let r={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};d.checked=r.checked,i.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=r.raw+d.tokens[0].raw,d.tokens[0].text=r.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(r)):d.tokens.unshift({type:"paragraph",raw:r.raw,text:r.raw,tokens:[r]}):d.tokens.unshift(r)}}if(!i.loose){let p=d.tokens.filter(u=>u.type==="space"),r=p.length>0&&p.some(u=>this.rules.other.anyLine.test(u.raw));i.loose=r}}if(i.loose)for(let d of i.items){d.loose=!0;for(let p of d.tokens)p.type==="text"&&(p.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Or(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(Or(o,a.header.length).map((c,d)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:a.align[d]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Cn(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=jf(t[2],"()");if(a===-2)return;if(a>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],i=a[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Fr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Fr(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,c=i,d=0,p=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,t=t.slice(-1*e.length+i);(s=p.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(o=[...a].length,s[3]||s[4]){c+=o;continue}else if((s[5]||s[6])&&i%3&&!((i+o)%3)){d+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c+d);let r=[...s[0]][0].length,u=e.slice(0,i+s.index+r+o);if(Math.min(i,o)%2){let y=u.slice(1,-1);return{type:"em",raw:u,text:y,tokens:this.lexer.inlineTokens(y)}}let h=u.slice(2,-2);return{type:"strong",raw:u,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,c=i,d=this.rules.inline.delRDelim;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(s=d.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(o=[...a].length,o!==i))continue;if(s[3]||s[4]){c+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c);let p=[...s[0]][0].length,r=e.slice(0,i+s.index+p+o),u=r.slice(i,-i);return{type:"del",raw:r,text:u,tokens:this.lexer.inlineTokens(u)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Ee=class ha{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Kt,this.options.tokenizer=this.options.tokenizer||new Os,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:he,block:bs.normal,inline:_n.normal};this.options.pedantic?(n.block=bs.pedantic,n.inline=_n.pedantic):this.options.gfm&&(n.block=bs.gfm,this.options.breaks?n.inline=_n.breaks:n.inline=_n.gfm),this.tokenizer.rules=n}static get rules(){return{block:bs,inline:_n}}static lex(t,n){return new ha(n).lex(t)}static lexInline(t,n){return new ha(n).inlineTokens(t)}lex(t){t=t.replace(he.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(he.tabCharGlobal,"    ").replace(he.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let o=n.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let a=t;if(this.options.extensions?.startBlock){let o=1/0,c=t.slice(1),d;this.options.extensions.startBlock.forEach(p=>{d=p.call({lexer:this},c),typeof d=="number"&&d>=0&&(o=Math.min(o,d))}),o<1/0&&o>=0&&(a=t.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i),s=a.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,i=null;if(this.tokens.links){let d=Object.keys(this.tokens.links);if(d.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)d.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=i[2]?i[2].length:0,s=s.slice(0,i.index+a)+"["+"a".repeat(i[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,c="";for(;t;){o||(c=""),o=!1;let d;if(this.options.extensions?.inline?.some(r=>(d=r.call({lexer:this},t,n))?(t=t.substring(d.raw.length),n.push(d),!0):!1))continue;if(d=this.tokenizer.escape(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.tag(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.link(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(d.raw.length);let r=n.at(-1);d.type==="text"&&r?.type==="text"?(r.raw+=d.raw,r.text+=d.text):n.push(d);continue}if(d=this.tokenizer.emStrong(t,s,c)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.codespan(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.br(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.del(t,s,c)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.autolink(t)){t=t.substring(d.raw.length),n.push(d);continue}if(!this.state.inLink&&(d=this.tokenizer.url(t))){t=t.substring(d.raw.length),n.push(d);continue}let p=t;if(this.options.extensions?.startInline){let r=1/0,u=t.slice(1),h;this.options.extensions.startInline.forEach(y=>{h=y.call({lexer:this},u),typeof h=="number"&&h>=0&&(r=Math.min(r,h))}),r<1/0&&r>=0&&(p=t.substring(0,r+1))}if(d=this.tokenizer.inlineText(p)){t=t.substring(d.raw.length),d.raw.slice(-1)!=="_"&&(c=d.raw.slice(-1)),o=!0;let r=n.at(-1);r?.type==="text"?(r.raw+=d.raw,r.text+=d.text):n.push(d);continue}if(t){let r="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(r);break}else throw new Error(r)}}return n}},Fs=class{options;parser;constructor(e){this.options=e||Kt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(he.notSpaceStart)?.[0],i=e.replace(he.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ne(s)+'">'+(n?i:Ne(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Ne(i,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ne(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=Mr(e);if(i===null)return s;e=i;let a='<a href="'+e+'"';return t&&(a+=' title="'+Ne(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=Mr(e);if(i===null)return Ne(n);e=i;let a=`<img src="${e}" alt="${Ne(n)}"`;return t&&(a+=` title="${Ne(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ne(e.text)}},to=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Re=class fa{options;renderer;textRenderer;constructor(t){this.options=t||Kt,this.options.renderer=this.options.renderer||new Fs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new to}static parse(t,n){return new fa(n).parse(t)}static parseInline(t,n){return new fa(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let o=i,c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=c||"";continue}}let a=i;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=c||"";continue}}let o=a;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let c='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},In=class{options;block;constructor(t){this.options=t||Kt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ee.lex:Ee.lexInline}provideParser(){return this.block?Re.parse:Re.parseInline}},Gf=class{defaults=Va();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Re;Renderer=Fs;TextRenderer=to;Lexer=Ee;Tokenizer=Os;Hooks=In;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let c=i.renderer.apply(this,o);return c===!1&&(c=a.apply(this,o)),c}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new Fs(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,c=n.renderer[o],d=i[o];i[o]=(...p)=>{let r=c.apply(i,p);return r===!1&&(r=d.apply(i,p)),r||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Os(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,c=n.tokenizer[o],d=i[o];i[o]=(...p)=>{let r=c.apply(i,p);return r===!1&&(r=d.apply(i,p)),r}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new In;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,c=n.hooks[o],d=i[o];In.passThroughHooks.has(a)?i[o]=p=>{if(this.defaults.async&&In.passThroughHooksRespectAsync.has(a))return(async()=>{let u=await c.call(i,p);return d.call(i,u)})();let r=c.call(i,p);return d.call(i,r)}:i[o]=(...p)=>{if(this.defaults.async)return(async()=>{let u=await c.apply(i,p);return u===!1&&(u=await d.apply(i,p)),u})();let r=c.apply(i,p);return r===!1&&(r=d.apply(i,p)),r}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(o){let c=[];return c.push(a.call(this,o)),i&&(c=c.concat(i.call(this,o))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Ee.lex(e,t??this.defaults)}parser(e,t){return Re.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,c=await(i.hooks?await i.hooks.provideLexer():e?Ee.lex:Ee.lexInline)(o,i),d=i.hooks?await i.hooks.processAllTokens(c):c;i.walkTokens&&await Promise.all(this.walkTokens(d,i.walkTokens));let p=await(i.hooks?await i.hooks.provideParser():e?Re.parse:Re.parseInline)(d,i);return i.hooks?await i.hooks.postprocess(p):p})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer():e?Ee.lex:Ee.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let c=(i.hooks?i.hooks.provideParser():e?Re.parse:Re.parseInline)(o,i);return i.hooks&&(c=i.hooks.postprocess(c)),c}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Ne(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Ot=new Gf;function K(e,t){return Ot.parse(e,t)}K.options=K.setOptions=function(e){return Ot.setOptions(e),K.defaults=Ot.defaults,Ic(K.defaults),K};K.getDefaults=Va;K.defaults=Kt;K.use=function(...e){return Ot.use(...e),K.defaults=Ot.defaults,Ic(K.defaults),K};K.walkTokens=function(e,t){return Ot.walkTokens(e,t)};K.parseInline=Ot.parseInline;K.Parser=Re;K.parser=Re.parse;K.Renderer=Fs;K.TextRenderer=to;K.Lexer=Ee;K.lexer=Ee.lex;K.Tokenizer=Os;K.Hooks=In;K.parse=K;K.options;K.setOptions;K.use;K.walkTokens;K.parseInline;Re.parse;Ee.lex;K.setOptions({gfm:!0,breaks:!0,mangle:!1});const Qf=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,Yf=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g"),Jf=new RegExp("(?<![(\\[`/~\\w])(?:[\\w][\\w.-]*[-_][\\w.-]*\\.(?:html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx))(?=\\s|[),;:!?|]|$)","gi");function jc(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(Yf,s=>{const i=s.endsWith("/");if(!i&&!Qf.test(s))return s;const a=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,o=s.replace(/\/+$/,"").split("/");return`[${i?(o.pop()??s)+"/":o.pop()??s}](${a})`}),t[n]=t[n].replace(Jf,s=>`[${s}](godmode-file://${encodeURIComponent(s)})`));return t.join("")}const Jn=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],Xn=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],ga=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|godmode-file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let Nr=!1;const Xf=14e4,Zf=14e4,eg=200,Mi=5e4,Pt=new Map;function tg(e){const t=Pt.get(e);return t===void 0?null:(Pt.delete(e),Pt.set(e,t),t)}function Br(e,t){if(Pt.set(e,t),Pt.size<=eg)return;const n=Pt.keys().next().value;n&&Pt.delete(n)}function ti(){Nr||(Nr=!0,Mt.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),Mt.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function we(e){const t=e.trim();if(!t)return"";if(ti(),t.length<=Mi){const c=tg(t);if(c!==null)return c}const n=Cc(t,Xf),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Zf){const d=`<pre class="code-block">${cg(`${n.text}${s}`)}</pre>`,p=Mt.sanitize(d,{ALLOWED_TAGS:Jn,ALLOWED_ATTR:Xn,ALLOWED_URI_REGEXP:ga});return t.length<=Mi&&Br(t,p),p}const i=jc(`${n.text}${s}`),a=K.parse(i),o=Mt.sanitize(a,{ALLOWED_TAGS:Jn,ALLOWED_ATTR:Xn,ALLOWED_URI_REGEXP:ga});return t.length<=Mi&&Br(t,o),o}function ng(e){const t=e.trim();if(!t)return"";ti();const n=K.parse(t);return Mt.sanitize(n,{ALLOWED_TAGS:Jn,ALLOWED_ATTR:Xn,ALLOWED_URI_REGEXP:ga}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}function Hc(e){const t=e.trim();return t?(ti(),Mt.sanitize(t,{ALLOWED_TAGS:Jn,ALLOWED_ATTR:Xn,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}const sg=[...Jn,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],ig=[...Xn,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function ag(e){const t=e.trim();if(!t)return"";ti();const{styles:n,html:s}=og(t),i=Mt.sanitize(s,{ALLOWED_TAGS:sg,ALLOWED_ATTR:ig,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),a=".dashboard-render";return n.map(c=>`<style>${lg(c,a)}</style>`).join(`
`)+i}function og(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,c)=>(t.push(c),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),a=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:a}}function rg(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function lg(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let i=0;for(;i<n.length;){if(/\s/.test(n[i])){s.push(n[i]),i++;continue}if(n[i]==="/"&&n[i+1]==="*"){const r=n.indexOf("*/",i+2),u=r===-1?n.length:r+2;s.push(n.slice(i,u)),i=u;continue}if(n[i]==="}"){s.push("}"),i++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(i,i+30))){const r=rg(n,i);s.push(n.slice(i,r)),i=r;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(i,i+20))){const r=n.indexOf("{",i);if(r===-1){s.push(n.slice(i));break}s.push(n.slice(i,r+1)),i=r+1;continue}const a=n.indexOf("{",i);if(a===-1){s.push(n.slice(i));break}const o=n.slice(i,a).trim(),c=n.indexOf("}",a);if(c===-1){s.push(n.slice(i));break}const d=n.slice(a+1,c),p=o.split(",").map(r=>{const u=r.trim();if(!u)return r;if(u==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(u))return t;const h=u.replace(/^(html|body|:root)\s+/i,"");return`${t} ${h}`}).join(", ");s.push(`${p} {${d}}`),i=c+1}return s.join("")}function cg(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const dg=500;let xt="",At="";function Vc(e){const t=e.trim();if(!t)return"";if(t.length<dg)return we(t);const n=pg(t);if(n<0)return we(t);const s=t.slice(0,n),i=t.slice(n);if(s===xt)return At+we(i);if(s.startsWith(xt)&&xt.length>0){const a=s.slice(xt.length);return At=At+we(a),xt=s,At+we(i)}return At=we(s),xt=s,At+we(i)}function ug(){xt="",At=""}function pg(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),o=a===-1?e.length:a,c=e.slice(i,o),d=c.trimStart(),p=d.match(/^(`{3,}|~{3,})/);if(p){const r=p[1];t?r.charAt(0)===n.charAt(0)&&r.length>=n.length&&d.slice(r.length).trim()===""&&(t=!1,n=""):(t=!0,n=r)}if(!t&&c.trim()===""){let r=o+1;for(;r<e.length&&e[r]===`
`;)r++;r<e.length&&(s.length===0||s[s.length-1]!==r)&&s.push(r)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}const H={messageSquare:l`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:l`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:l`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:l`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,compass:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  `,monitor:l`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:l`
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
  `,scrollText:l`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,folderOpen:l`
    <svg viewBox="0 0 24 24">
      <path
        d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  `,file:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  `,chevronRight:l`
    <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
  `,chevronDown:l`
    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  `,panelLeft:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  `,panelLeftClose:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,menu:l`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:l`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:l`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,copy:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:l`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:l`
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
  `,book:l`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:l`
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
  `,arrowUp:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  `,calendar:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  `,heart:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  `,pieChart:l`
    <svg viewBox="0 0 24 24">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  `,star:l`
    <svg viewBox="0 0 24 24">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,rotateCcw:l`
    <svg viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  `,headphones:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      />
    </svg>
  `,helpCircle:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,messageCircle:l`
    <svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  `,wrench:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:l`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:l`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:l`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,minimize:l`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,users:l`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,briefcase:l`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  `,shield:l`
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  `,lock:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  `,lockOpen:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 4.63 3.13" />
    </svg>
  `,flask:l`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `},hg=1500,fg=2e3,Gc="Copy as markdown",gg="Copied",mg="Copy failed";async function vg(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function ws(e,t){e.title=t,e.setAttribute("aria-label",t)}function yg(e){const t=e.label??Gc;return l`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await vg(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",ws(s,mg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,ws(s,t))},fg);return}s.dataset.copied="1",ws(s,gg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,ws(s,t))},hg)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${H.copy}</span>
        <span class="chat-copy-btn__icon-check">${H.check}</span>
      </span>
    </button>
  `}function bg(e){return yg({text:()=>e,label:Gc})}const Ur="NO_REPLY",wg=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,kg=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,$g=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Oi(e){let t=e.replace(wg,"").replace(kg,"").trim();const n=t.toLowerCase();for(const s of $g){const i=n.indexOf(s);if(i!==-1){const a=i+s.length,o=t.slice(a),c=o.search(/\n\n(?=[A-Z])/);c!==-1?t=o.slice(c).trim():t="";break}}return t}const Sg=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,xg=/^\s*(\d{3})\s+\{/;function no(e){const t=e.trim(),n=t.match(xg);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!Sg.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const Ag=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,Tg=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,_g=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function Cg(e){return e.replace(Tg,"").replace(Ag,"").replace(_g,"").trim()}const Eg=/^\[([^\]]+)\]\s*/,Rg=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Fi=new WeakMap,Ni=new WeakMap;function Pg(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Rg.some(t=>e.startsWith(`${t} `))}function As(e){const t=e.match(Eg);if(!t)return e;const n=t[1]??"";return Pg(n)?e.slice(t[0].length):e}function Bi(e){const t=e.trim();return t===Ur||t.startsWith(`${Ur}
`)}function dn(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=Oi(s);if(!i)return null;const a=no(i);if(a)return a;const o=n==="assistant"?Cg(i):i;if(n==="assistant"&&!o)return null;const c=n==="assistant"?Ci(o):As(i);return Bi(c)?null:c}if(Array.isArray(s)){const i=s.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?Oi(o.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),o=n==="assistant"?Ci(a):As(a);return Bi(o)?null:o}}if(typeof t.text=="string"){const i=Oi(t.text);if(!i)return null;const a=n==="assistant"?Ci(i):As(i);return Bi(a)?null:a}return null}function so(e){if(!e||typeof e!="object")return dn(e);const t=e;if(Fi.has(t))return Fi.get(t)??null;const n=dn(e);return Fi.set(t,n),n}function ma(e){const n=e.content,s=[];if(Array.isArray(n))for(const c of n){const d=c;if(d.type==="thinking"&&typeof d.thinking=="string"){const p=d.thinking.trim();p&&s.push(p)}}if(s.length>0)return s.join(`
`);const i=io(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(c=>(c[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function Qc(e){if(!e||typeof e!="object")return ma(e);const t=e;if(Ni.has(t))return Ni.get(t)??null;const n=ma(e);return Ni.set(t,n),n}function io(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function Yc(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const Lg=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:io,extractText:dn,extractTextCached:so,extractThinking:ma,extractThinkingCached:Qc,formatApiError:no,formatReasoningMarkdown:Yc,stripEnvelope:As},Symbol.toStringTag,{value:"Module"}));function ao(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(u=>{const h=u,y=(typeof h.type=="string"?h.type:"").toLowerCase();return y==="toolresult"||y==="tool_result"}),c=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||c)&&(n="toolResult");let d=[];typeof t.content=="string"?d=[{type:"text",text:t.content}]:Array.isArray(t.content)?d=t.content.map(u=>({type:u.type||"text",text:u.text,name:u.name,args:u.args||u.arguments})):typeof t.text=="string"&&(d=[{type:"text",text:t.text}]);const p=typeof t.timestamp=="number"?t.timestamp:Date.now(),r=typeof t.id=="string"?t.id:void 0;return{role:n,content:d,timestamp:p,id:r}}function ni(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function Jc(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const zr={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function Xc(e){const t=e.split(".").pop()?.toLowerCase()||"";return zr[t]??zr.default}function Zc(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const Ig={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Dg={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Mg={fallback:Ig,tools:Dg},ed=Mg,Kr=ed.fallback??{icon:"puzzle"},Og=ed.tools??{};function Fg(e){return(e??"tool").trim()}function Ng(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Bg(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function td(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>td(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function Ug(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function zg(e,t){for(const n of t){const s=Ug(e,n),i=td(s);if(i)return i}}function Kg(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Wg(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function qg(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function jg(e){const t=Fg(e.name),n=t.toLowerCase(),s=Og[n],i=s?.icon??Kr.icon??"puzzle",a=s?.title??Ng(t),o=s?.label??t,c=e.args&&typeof e.args=="object"?e.args.action:void 0,d=typeof c=="string"?c.trim():void 0,p=qg(s,d),r=Bg(p?.label??d);let u;n==="read"&&(u=Kg(e.args)),!u&&(n==="write"||n==="edit"||n==="attach")&&(u=Wg(e.args));const h=p?.detailKeys??s?.detailKeys??Kr.detailKeys??[];return!u&&h.length>0&&(u=zg(e.args,h)),!u&&e.meta&&(u=e.meta),u&&(u=Vg(u)),{name:t,icon:i,title:a,label:o,verb:r,detail:u}}function Hg(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Vg(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Gg=80,Qg=2,Wr=100,Yg=3;function qr(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function Jg(e){const t=e.split(`
`),n=t.slice(0,Qg),s=n.join(`
`);return s.length>Wr?s.slice(0,Wr)+"…":n.length<t.length?s+"…":s}function Xg(e){const t=e,n=nm(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:sm(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=im(i);if(Hr(o))continue;const c=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:c,text:o})}if(Jc(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=so(e)??void 0;Hr(a)||s.push({kind:"result",name:i,text:a})}return s}const Zg=new Set(["write","read","edit","attach"]);function em(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function tm(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function jr(e,t,n,s,i){const a=jg({name:e.name,args:e.args}),o=Hg(a),c=!!e.text?.trim(),d=am(e.text);if(d?.type==="proof"&&d.slug)return l`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${H.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${d.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?l`<button class="chat-artifact-card__btn" @click=${A=>{A.stopPropagation(),s(d.slug)}}>Open</button>`:f}
          ${d.filePath&&i?l`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${A=>{A.stopPropagation(),i(d.filePath)}}>Drive</button>`:f}
        </div>
      </div>
    `;const p=Zg.has(e.name.toLowerCase())?em(e.args)??tm(e.text):null;if(p&&e.kind==="result"){const A=p.split("/").pop()||p,P=A.split(".").pop()?.toLowerCase()||"",R=Xc(A),x=Zc(P,A);return l`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${R}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${p}>${A}</span>
          <span class="chat-artifact-card__type">${x}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?l`<button class="chat-artifact-card__btn" @click=${_=>{_.stopPropagation(),n(p)}}>Open</button>`:t&&c?l`<button class="chat-artifact-card__btn" @click=${_=>{_.stopPropagation(),t(qr(e.text))}}>View</button>`:f}
          ${i?l`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${_=>{_.stopPropagation(),i(p)}}>Drive</button>`:f}
        </div>
      </div>
    `}const r=!!t||!!(n&&p),u=r?A=>{if(A.stopPropagation(),n&&p){n(p);return}if(t&&c){t(qr(e.text));return}if(t){const P=`## ${a.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(P)}}:void 0,h=e.text?e.text.split(`
`).length:0,y=c&&(e.text?.length??0)<=Gg,b=c&&!y&&h>Yg,$=c&&!b,k=!c,S=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return l`
    <div
      class="chat-tool-card ${S} ${r?"chat-tool-card--clickable":""}"
      @click=${u}
      role=${r?"button":f}
      tabindex=${r?"0":f}
      @keydown=${r?A=>{A.key!=="Enter"&&A.key!==" "||(A.preventDefault(),A.stopPropagation(),u?.(A))}:f}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${H[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${r?l`<span class="chat-tool-card__action">${c?"View":""} ${H.check}</span>`:f}
        ${k&&!r?l`<span class="chat-tool-card__status">${H.check}</span>`:f}
      </div>
      ${o?l`<div class="chat-tool-card__detail">${o}</div>`:f}
      ${k?l`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:f}
      ${b?l`<details class="chat-tool-card__expandable" @click=${A=>A.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${Jg(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:f}
      ${$?l`<div class="chat-tool-card__inline mono">${e.text}</div>`:f}
    </div>
  `}function nm(e){return Array.isArray(e)?e.filter(Boolean):[]}function sm(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function im(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function am(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function Hr(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function om(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const Vr={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function nd(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=Vr[t]??Vr.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function rm(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function lm(e){return l`
    <div class="chat-file-uploads">
      ${e.map(t=>l`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${Xc(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${Zc(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function cm(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const Gr=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function dm(e){const t=[];let n;for(;(n=Gr.exec(e))!==null;){const s=n[1]?.trim()||"file",i=n[2]?.trim()||"application/octet-stream";t.push({fileName:s,fileId:"",size:"",mimeType:i})}return Gr.lastIndex=0,t.length>0?t:null}const um=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function pm(e){return e.replace(um,"").trim()}function hm(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const o=a.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function fm(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function va(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"){const c=o.source;if(c?.type==="base64"&&typeof c.data=="string"){const d=c.data,p=c.media_type||"image/png",r=d.startsWith("data:")?d:`data:${p};base64,${d}`;s.push({url:r})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const d=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:d})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const c=o.image_url;typeof c?.url=="string"&&s.push({url:c.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const c=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,d=o.text.match(c);if(d)for(const p of d)s.push({url:p})}if(Array.isArray(o.content))for(const c of o.content){if(typeof c!="object"||c===null)continue;const d=c;if(d.type==="image"){const p=d.source;if(p?.type==="base64"&&typeof p.data=="string"){const r=p.media_type||"image/png",u=p.data.startsWith("data:")?p.data:`data:${r};base64,${p.data}`;s.push({url:u})}else if(typeof d.data=="string"&&typeof d.mimeType=="string"){const r=d.data.startsWith("data:")?d.data:`data:${d.mimeType};base64,${d.data}`;s.push({url:r})}else d.omitted===!0&&s.push({omitted:!0,bytes:typeof d.bytes=="number"?d.bytes:void 0,mimeType:typeof d.mimeType=="string"?d.mimeType:void 0,alt:typeof d.fileName=="string"?d.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"&&typeof o.content=="string"){const c=o.mimeType||"image/png",d=o.content.startsWith("data:")?o.content:`data:${c};base64,${o.content}`;s.push({url:d,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function gm(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="attachment"&&typeof o.content=="string"){const c=o.mimeType||"application/octet-stream";c.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:c,content:o.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function mm(e,t){return l`
    <div class="chat-group assistant">
      ${oo("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?l`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${nd(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?l`<span class="chat-working-indicator__details">${t.details}</span>`:f}
              </div>
            `:f}
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
  `}function vm(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return l`
    <div class="chat-group assistant">
      ${oo("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?l`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${nd(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?l`<span class="chat-working-indicator__details">${i.details}</span>`:f}
              </div>
            `:f}
        ${sd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function ym(e,t){const n=ni(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",c=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return l`
    <div class="chat-group ${o}">
      ${oo(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((d,p)=>sd(d.message,{isStreaming:e.isStreaming&&p===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${c}</span>
        </div>
      </div>
    </div>
  `}function oo(e,t){const n=ni(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",c=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&Qr(o)?l`<img
        class="chat-avatar ${c}"
        src="${o}"
        alt="${a}"
      />`:o?l`<div class="chat-avatar ${c}">${o}</div>`:l`<div class="chat-avatar ${c}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&Qr(i)?l`<img
        class="chat-avatar ${c}"
        src="${i}"
        alt="${s}"
      />`:i?l`<div class="chat-avatar ${c}" style="color: var(--accent);">${i}</div>`:l`<div class="chat-avatar ${c}" style="color: var(--accent);">⚛️</div>`:n==="tool"?l`<div class="chat-avatar ${c}">⚙</div>`:l`<div class="chat-avatar ${c}">?</div>`}function Qr(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Yr(e,t,n){if(e.length===0)return f;const s=e.map((a,o)=>{if((a.omitted||!a.url)&&n){const c=n(o);if(c)return{...a,resolvedUrl:c}}return a}),i=s.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return l`
    <div class="chat-message-images">
      ${s.map(a=>{const o=a.resolvedUrl||a.url;if(!o){const d=fm(a.bytes),r=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,d].filter(Boolean).join(" · ");return l`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${a.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${r||"Image"}</span>
            </div>
          `}const c=i.findIndex(d=>d.url===o);return l`
          <img
            src=${o}
            alt=${a.alt??"Attached image"}
            class="chat-message-image"
            @error=${d=>{const p=d.target;p.style.display="none"}}
            @click=${()=>{t&&t(o,i,Math.max(0,c))}}
          />
        `})}
    </div>
  `}function bm(e){return e.length===0?f:l`
    <div class="chat-message-files">
      ${e.map(t=>{const n=t.fileName.length>30?t.fileName.slice(0,27)+"...":t.fileName;return l`
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
  `}function sd(e,t,n,s,i,a,o,c){try{return wm(e,t,n,s,i,a,o,c)}catch(d){return console.error("[chat] message render error:",d),l`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function wm(e,t,n,s,i,a,o,c){const d=e,p=typeof d.role=="string"?d.role:"unknown",r=Jc(e)||p.toLowerCase()==="toolresult"||p.toLowerCase()==="tool_result"||typeof d.toolCallId=="string"||typeof d.tool_call_id=="string",u=Xg(e),h=u.length>0,y=va(e),b=y.length>0,$=typeof d._chatIdx=="number"?d._chatIdx:-1,k=o&&$>=0?Y=>o($,Y):void 0,S=gm(e),A=S.length>0,P=so(e),R=t.showReasoning&&p==="assistant"?Qc(e):null,x=p==="user"&&P?rm(P):null,_=p==="user"?io(e):null,T=_?dm(_):null,N=[...x??[],...T??[]],D=N.length>0;let z=P;if(p==="user"&&z&&(z=hm(z),z=pm(z)),z&&(z=z.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),z){const Y=no(z);Y&&(z=Y)}D&&z&&(z=cm(z));const W=z?.trim()?z:null,j=R?Yc(R):null,de=W,Te=p==="assistant"&&!!de?.trim(),Ke=["chat-bubble",Te?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(h&&r)return l`
      ${b?Yr(y,a,k):f}
      ${u.map(Y=>jr(Y,n,s,i,c))}
    `;if(!de&&!h&&!b&&!A&&!D&&!j){const Y=typeof d.errorMessage=="string"?d.errorMessage:null;if(d.stopReason==="error"&&Y){let te=Y;const O=Y.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(O){const ke=parseInt(O[1]).toLocaleString(),vt=parseInt(O[2]).toLocaleString();te=`Context overflow: ${ke} tokens exceeded the ${vt} token limit. The conversation needs to be compacted.`}else Y.includes("prompt is too long")&&(te="Context overflow: The conversation is too long for the model.");return l`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${te}</div>
        </div>
      `}if(p==="user"&&P?.trim()){let te=P.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(te.startsWith("System:")||te.startsWith("GatewayRestart:")||te.startsWith("Sender (untrusted metadata)")){const O=te.indexOf(`

`);te=O!==-1?te.slice(O+2).trim():""}if(te)return l`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${te}</div>
          </div>
        `}return f}return l`
    <div class="${Ke}">
      ${Te?bg(de):f}
      ${D?lm(N):f}
      ${Yr(y,a,k)}
      ${bm(S)}
      ${j?l`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${Le(we(j))}</div>
            </details>`:f}
      ${de?l`<div class="chat-text" @click=${Y=>om(Y,s)}>${Le(t.isStreaming?Vc(de):we(de))}</div>`:f}
      ${u.map(Y=>jr(Y,n,s,i,c))}
    </div>
  `}function km(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return l`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?l`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:f}
      </div>
      <div class="chat-compaction-summary__content">
        ${Le(we(n))}
      </div>
      ${i?l`<div class="chat-compaction-summary__timestamp">${i}</div>`:f}
    </div>
  `}function $m(e){return e.isCompactionSummary===!0}async function id(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function ad(e){if(!(!e.client||!e.connected)&&!e.rosterLoading){e.rosterLoading=!0,e.rosterError=null;try{const t=await e.client.request("queue.roster",{});t?.roster&&(e.rosterData=t.roster)}catch(t){e.rosterError=String(t)}finally{e.rosterLoading=!1}}}const Sm=Object.freeze(Object.defineProperty({__proto__:null,loadAgents:id,loadRoster:ad},Symbol.toStringTag,{value:"Module"})),od=50,rd=200,xm="Assistant";function Ns(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function ya(e){const t=Ns(e?.name,od)??xm,n=Ns(e?.avatar??void 0,rd)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function Am(){return ya(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const Tm="You";function Jr(e){const t=Ns(e?.name,od)??Tm,n=Ns(e?.avatar??void 0,rd)??null;return{name:t,avatar:n}}function _m(){return Jr(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function ld(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=ya(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let Xr=!1;function Zr(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Cm(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Em(){Xr||(Xr=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function si(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Zr(t)}return Em(),Zr(Cm())}let Tt=null,Ts=null;function cd(){return Ts}const dd=new Map,dt=new Map;function ba(e,t){const n=t.filter(s=>s?.role==="user").length;dd.set(e,n)}async function ud(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return dt.set(t,s),ba(t,s),s}catch{return dt.get(t)??[]}}let Zt=0;async function oe(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Zt;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Zt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ba(t,e.chatMessages),dt.set(t,e.chatMessages)}catch{if(n!==Zt||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Zt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ba(t,e.chatMessages),dt.set(t,e.chatMessages)}catch(s){if(n!==Zt||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Zt&&(e.chatLoading=!1)}}async function pd(e,t){const n=[...e.chatMessages],s=n.length;await oe(e),e.chatStream=null,!t?.allowShrink&&s>0&&e.chatMessages.length<s&&(e.chatMessages=n,setTimeout(()=>{oe(e).then(()=>{e.chatStream=null})},2e3))}function Rm(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function ro(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const o=Date.now();if(!s?.skipOptimisticUpdate){const p=[];if(i&&p.push({type:"text",text:i}),a)for(const r of n)r.mimeType.startsWith("image/")?p.push({type:"image",source:{type:"base64",media_type:r.mimeType,data:r.dataUrl}}):p.push({type:"attachment",mimeType:r.mimeType,fileName:r.fileName,content:r.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:p,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const c=si();e.chatRunId=c,e.chatStream="",e.chatStreamStartedAt=o,Tt={message:i,attachments:a?n:void 0};let d;if(a){const p=[],r=[];for(const u of n){const h=Rm(u.dataUrl);if(h)if(h.mimeType.startsWith("image/"))p.push({type:"image",mimeType:h.mimeType,content:h.content,fileName:u.fileName});else{const y=u.fileName||"file";r.push(`<document>
<source>${y}</source>
<mime_type>${h.mimeType}</mime_type>
<content encoding="base64">
${h.content}
</content>
</document>`)}}if(p.length>0&&(d=p),r.length>0&&(i=`${r.join(`

`)}

${i}`),p.length>0){const u=e.chatMessages.length-1,h=e.sessionKey,y=e.client.request("images.cache",{images:p.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:h}).then(b=>{if(b?.cached&&b.cached.length>0){const $=b.cached.map((k,S)=>({messageIndex:u,imageIndex:S,hash:k.hash,mimeType:k.mimeType,bytes:k.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:h,images:$}).catch(()=>{})}}).catch(()=>{});Ts=y,y.finally(()=>{Ts===y&&(Ts=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:c,attachments:d}),!0}catch(p){const r=String(p);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=r,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+r}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function hd(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,ro(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function Pm(e){e.pendingRetry=null}async function lo(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function fd(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&ug(),t.state==="delta"){const n=dn(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,Tt=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,Tt=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&Tt&&(e.pendingRetry={message:Tt.message,attachments:Tt.attachments,timestamp:Date.now()}),Tt=null;let i=n;if(s){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const o=parseInt(a[1]).toLocaleString(),c=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${o} tokens exceeds ${c} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const Ge=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:lo,clearPendingRetry:Pm,getPendingImageCache:cd,handleChatEvent:fd,laneMessageCache:dt,loadChatHistory:oe,loadChatHistoryAfterFinal:pd,loadLaneHistory:ud,retryPendingMessage:hd,sendChatMessage:ro,sessionTurnCounts:dd},Symbol.toStringTag,{value:"Module"})),gd="godmode.device.auth.v1";function co(e){return e.trim()}function Lm(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function uo(){try{const e=window.localStorage.getItem(gd);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function md(e){try{window.localStorage.setItem(gd,JSON.stringify(e))}catch{}}function Im(e){const t=uo();if(!t||t.deviceId!==e.deviceId)return null;const n=co(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function vd(e){const t=co(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=uo();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:Lm(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,md(n),i}function yd(e){const t=uo();if(!t||t.deviceId!==e.deviceId)return;const n=co(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],md(s)}const bd={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:ce,n:_s,Gx:el,Gy:tl,a:Ui,d:zi,h:Dm}=bd,Ft=32,po=64,Mm=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},ne=(e="")=>{const t=new Error(e);throw Mm(t,ne),t},Om=e=>typeof e=="bigint",Fm=e=>typeof e=="string",Nm=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",ft=(e,t,n="")=>{const s=Nm(e),i=e?.length,a=t!==void 0;if(!s||a&&i!==t){const o=n&&`"${n}" `,c=a?` of length ${t}`:"",d=s?`length=${i}`:`type=${typeof e}`;ne(o+"expected Uint8Array"+c+", got "+d)}return e},ii=e=>new Uint8Array(e),wd=e=>Uint8Array.from(e),kd=(e,t)=>e.toString(16).padStart(t,"0"),$d=e=>Array.from(ft(e)).map(t=>kd(t,2)).join(""),Ve={_0:48,_9:57,A:65,F:70,a:97,f:102},nl=e=>{if(e>=Ve._0&&e<=Ve._9)return e-Ve._0;if(e>=Ve.A&&e<=Ve.F)return e-(Ve.A-10);if(e>=Ve.a&&e<=Ve.f)return e-(Ve.a-10)},Sd=e=>{const t="hex invalid";if(!Fm(e))return ne(t);const n=e.length,s=n/2;if(n%2)return ne(t);const i=ii(s);for(let a=0,o=0;a<s;a++,o+=2){const c=nl(e.charCodeAt(o)),d=nl(e.charCodeAt(o+1));if(c===void 0||d===void 0)return ne(t);i[a]=c*16+d}return i},xd=()=>globalThis?.crypto,Bm=()=>xd()?.subtle??ne("crypto.subtle must be defined, consider polyfill"),Zn=(...e)=>{const t=ii(e.reduce((s,i)=>s+ft(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},Um=(e=Ft)=>xd().getRandomValues(ii(e)),Bs=BigInt,_t=(e,t,n,s="bad number: out of range")=>Om(e)&&t<=e&&e<n?e:ne(s),L=(e,t=ce)=>{const n=e%t;return n>=0n?n:t+n},Ad=e=>L(e,_s),zm=(e,t)=>{(e===0n||t<=0n)&&ne("no inverse n="+e+" mod="+t);let n=L(e,t),s=t,i=0n,a=1n;for(;n!==0n;){const o=s/n,c=s%n,d=i-a*o;s=n,n=c,i=a,a=d}return s===1n?L(i,t):ne("no inverse")},Km=e=>{const t=Ed[e];return typeof t!="function"&&ne("hashes."+e+" not set"),t},Ki=e=>e instanceof Se?e:ne("Point expected"),wa=2n**256n;class Se{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const a=wa;this.X=_t(t,0n,a),this.Y=_t(n,0n,a),this.Z=_t(s,1n,a),this.T=_t(i,0n,a),Object.freeze(this)}static CURVE(){return bd}static fromAffine(t){return new Se(t.x,t.y,1n,L(t.x*t.y))}static fromBytes(t,n=!1){const s=zi,i=wd(ft(t,Ft)),a=t[31];i[31]=a&-129;const o=_d(i);_t(o,0n,n?wa:ce);const d=L(o*o),p=L(d-1n),r=L(s*d+1n);let{isValid:u,value:h}=qm(p,r);u||ne("bad point: y not sqrt");const y=(h&1n)===1n,b=(a&128)!==0;return!n&&h===0n&&b&&ne("bad point: x==0, isLastByteOdd"),b!==y&&(h=L(-h)),new Se(h,o,1n,L(h*o))}static fromHex(t,n){return Se.fromBytes(Sd(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=Ui,n=zi,s=this;if(s.is0())return ne("bad point: ZERO");const{X:i,Y:a,Z:o,T:c}=s,d=L(i*i),p=L(a*a),r=L(o*o),u=L(r*r),h=L(d*t),y=L(r*L(h+p)),b=L(u+L(n*L(d*p)));if(y!==b)return ne("bad point: equation left != right (1)");const $=L(i*a),k=L(o*c);return $!==k?ne("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:a,Y:o,Z:c}=Ki(t),d=L(n*c),p=L(a*i),r=L(s*c),u=L(o*i);return d===p&&r===u}is0(){return this.equals(an)}negate(){return new Se(L(-this.X),this.Y,this.Z,L(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=Ui,a=L(t*t),o=L(n*n),c=L(2n*L(s*s)),d=L(i*a),p=t+n,r=L(L(p*p)-a-o),u=d+o,h=u-c,y=d-o,b=L(r*h),$=L(u*y),k=L(r*y),S=L(h*u);return new Se(b,$,S,k)}add(t){const{X:n,Y:s,Z:i,T:a}=this,{X:o,Y:c,Z:d,T:p}=Ki(t),r=Ui,u=zi,h=L(n*o),y=L(s*c),b=L(a*u*p),$=L(i*d),k=L((n+s)*(o+c)-h-y),S=L($-b),A=L($+b),P=L(y-r*h),R=L(k*S),x=L(A*P),_=L(k*P),T=L(S*A);return new Se(R,x,T,_)}subtract(t){return this.add(Ki(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return an;if(_t(t,1n,_s),t===1n)return this;if(this.equals(Nt))return tv(t).p;let s=an,i=Nt;for(let a=this;t>0n;a=a.double(),t>>=1n)t&1n?s=s.add(a):n&&(i=i.add(a));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(an))return{x:0n,y:1n};const i=zm(s,ce);L(s*i)!==1n&&ne("invalid inverse");const a=L(t*i),o=L(n*i);return{x:a,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Td(n);return s[31]|=t&1n?128:0,s}toHex(){return $d(this.toBytes())}clearCofactor(){return this.multiply(Bs(Dm),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(_s/2n,!1).double();return _s%2n&&(t=t.add(this)),t.is0()}}const Nt=new Se(el,tl,1n,L(el*tl)),an=new Se(0n,1n,1n,0n);Se.BASE=Nt;Se.ZERO=an;const Td=e=>Sd(kd(_t(e,0n,wa),po)).reverse(),_d=e=>Bs("0x"+$d(wd(ft(e)).reverse())),Oe=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=ce;return n},Wm=e=>{const n=e*e%ce*e%ce,s=Oe(n,2n)*n%ce,i=Oe(s,1n)*e%ce,a=Oe(i,5n)*i%ce,o=Oe(a,10n)*a%ce,c=Oe(o,20n)*o%ce,d=Oe(c,40n)*c%ce,p=Oe(d,80n)*d%ce,r=Oe(p,80n)*d%ce,u=Oe(r,10n)*a%ce;return{pow_p_5_8:Oe(u,2n)*e%ce,b2:n}},sl=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,qm=(e,t)=>{const n=L(t*t*t),s=L(n*n*t),i=Wm(e*s).pow_p_5_8;let a=L(e*n*i);const o=L(t*a*a),c=a,d=L(a*sl),p=o===e,r=o===L(-e),u=o===L(-e*sl);return p&&(a=c),(r||u)&&(a=d),(L(a)&1n)===1n&&(a=L(-a)),{isValid:p||r,value:a}},ka=e=>Ad(_d(e)),ho=(...e)=>Ed.sha512Async(Zn(...e)),jm=(...e)=>Km("sha512")(Zn(...e)),Cd=e=>{const t=e.slice(0,Ft);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Ft,po),s=ka(t),i=Nt.multiply(s),a=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:a}},fo=e=>ho(ft(e,Ft)).then(Cd),Hm=e=>Cd(jm(ft(e,Ft))),Vm=e=>fo(e).then(t=>t.pointBytes),Gm=e=>ho(e.hashable).then(e.finish),Qm=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,a=ka(t),o=Nt.multiply(a).toBytes();return{hashable:Zn(o,s,n),finish:p=>{const r=Ad(a+ka(p)*i);return ft(Zn(o,Td(r)),po)}}},Ym=async(e,t)=>{const n=ft(e),s=await fo(t),i=await ho(s.prefix,n);return Gm(Qm(s,i,n))},Ed={sha512Async:async e=>{const t=Bm(),n=Zn(e);return ii(await t.digest("SHA-512",n.buffer))},sha512:void 0},Jm=(e=Um(Ft))=>e,Xm={getExtendedPublicKeyAsync:fo,getExtendedPublicKey:Hm,randomSecretKey:Jm},Us=8,Zm=256,Rd=Math.ceil(Zm/Us)+1,$a=2**(Us-1),ev=()=>{const e=[];let t=Nt,n=t;for(let s=0;s<Rd;s++){n=t,e.push(n);for(let i=1;i<$a;i++)n=n.add(t),e.push(n);t=n.double()}return e};let il;const al=(e,t)=>{const n=t.negate();return e?n:t},tv=e=>{const t=il||(il=ev());let n=an,s=Nt;const i=2**Us,a=i,o=Bs(i-1),c=Bs(Us);for(let d=0;d<Rd;d++){let p=Number(e&o);e>>=c,p>$a&&(p-=a,e+=1n);const r=d*$a,u=r,h=r+Math.abs(p)-1,y=d%2!==0,b=p<0;p===0?s=s.add(al(y,t[u])):n=n.add(al(b,t[h]))}return e!==0n&&ne("invalid wnaf"),{p:n,f:s}},Wi="godmode-device-identity-v1";function Sa(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Pd(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let a=0;a<s.length;a+=1)i[a]=s.charCodeAt(a);return i}function nv(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Ld(e){const t=await crypto.subtle.digest("SHA-256",e);return nv(new Uint8Array(t))}async function sv(){const e=Xm.randomSecretKey(),t=await Vm(e);return{deviceId:await Ld(t),publicKey:Sa(t),privateKey:Sa(e)}}async function go(){try{const n=localStorage.getItem(Wi);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await Ld(Pd(s.publicKey));if(i!==s.deviceId){const a={...s,deviceId:i};return localStorage.setItem(Wi,JSON.stringify(a)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await sv(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(Wi,JSON.stringify(t)),e}async function iv(e,t){const n=Pd(e),s=new TextEncoder().encode(t),i=await Ym(s,n);return Sa(i)}async function gt(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function av(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await gt(e)}catch(n){e.devicesError=String(n)}}async function ov(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await gt(e)}catch(s){e.devicesError=String(s)}}async function rv(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await go(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&vd({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await gt(e)}catch(n){e.devicesError=String(n)}}async function lv(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await go();t.deviceId===s.deviceId&&yd({deviceId:s.deviceId,role:t.role}),await gt(e)}catch(s){e.devicesError=String(s)}}function xa(e){return typeof e=="object"&&e!==null}function cv(e){if(!xa(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!xa(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function dv(e){if(!xa(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Id(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function uv(e,t){const n=Id(e).filter(s=>s.id!==t.id);return n.push(t),n}function ol(e,t){return Id(e).filter(n=>n.id!==t)}async function ai(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const Ue=new Map;async function Z(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??Ds(e.sessionsFilterActive,0),a=t?.limit??Ds(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};i>0&&(o.activeMinutes=i),a>0&&(o.limit=a);const c=await e.client.request("sessions.list",o);if(c){if(c.sessions){const d=new Map;if(e.sessionsResult?.sessions)for(const p of e.sessionsResult.sessions)p.displayName&&d.set(p.key,p.displayName);c.sessions=c.sessions.map(p=>{if(p.label||p.displayName)return p;let r=Ue.get(p.key);if(!r){const h=p.key.split(":").pop();if(h&&h.length>=4){for(const[y,b]of Ue)if(y===p.key||y.endsWith(`:${h}`)||p.key.endsWith(`:${y.split(":").pop()}`)){r=b;break}}}if(r)return{...p,displayName:r};const u=d.get(p.key);return u?{...p,displayName:u}:p})}e.sessionsResult=c}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Cs(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:i}=await E(async()=>{const{safeRequest:o}=await Promise.resolve().then(()=>Av);return{safeRequest:o}},void 0,import.meta.url),a=await i(e.client,"sessions.patch",s);return a.ok?{ok:!0,canonicalKey:a.data?.key??t}:(e.sessionsError=a.error,{ok:!1})}catch(i){return e.sessionsError=String(i),{ok:!1}}}async function Dd(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await Z(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Bt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function Md(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Bt(e),await Z(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function Od(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Bt(e),await Z(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function Fd(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Bt(e),await Z(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const En=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:Md,autoTitleCache:Ue,deleteSession:Dd,loadArchivedSessions:Bt,loadSessions:Z,patchSession:Cs,triggerAutoArchive:Fd,unarchiveSession:Od},Symbol.toStringTag,{value:"Module"})),pv=1800*1e3;function Nd(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function Bd(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function hv(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Nd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=Bd(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function rl(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Nd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=Bd(t),e.updateLastChecked=Date.now()}catch{}}}function fv(e){e.updatePollInterval==null&&(rl(e),e.updatePollInterval=window.setInterval(()=>{rl(e)},pv))}function gv(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function mv(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const i=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,i),hv(e)}catch{}}const Ud={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},ll=Ud,Aa={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(Ud));new Set(Object.values(Aa));function vv(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const yv=4008;class bv{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await go();const r=Im({deviceId:i.deviceId,role:s})?.token;o=r??this.opts.token,a=!!(r&&this.opts.token)}const c=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let d;if(t&&i){const r=Date.now(),u=this.connectNonce??void 0,h=vv({deviceId:i.deviceId,clientId:this.opts.clientName??ll.CONTROL_UI,clientMode:this.opts.mode??Aa.WEBCHAT,role:s,scopes:n,signedAtMs:r,token:o??null,nonce:u}),y=await iv(i.privateKey,h);d={id:i.deviceId,publicKey:i.publicKey,signature:y,signedAt:r,nonce:u}}const p={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??ll.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Aa.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:d,caps:[],auth:c,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",p).then(r=>{r?.auth?.deviceToken&&i&&vd({deviceId:i.deviceId,role:r.auth.role??s,token:r.auth.deviceToken,scopes:r.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(r)}).catch(()=>{a&&i&&yd({deviceId:i.deviceId,role:s}),this.ws?.close(yv,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const o=i.payload,c=o&&typeof o.nonce=="string"?o.nonce:null;c&&(this.connectNonce=c,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=si(),i={type:"req",id:s,method:t,params:n},a=new Promise((o,c)=>{this.pending.set(s,{resolve:d=>o(d),reject:c})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const zd={displayName:"label",sessionKey:"conversationId"},Kd={};for(const[e,t]of Object.entries(zd))Kd[t]=e;const wv={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},Ut=new Map;function kv(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))Ut.set(n,s)}}catch{}}function cl(){try{const e={};for(const[t,n]of Ut)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}kv();function $v(e,t){const n=Ut.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const i={...t};for(const[a,o]of Object.entries(n.fieldRenames))a in i&&!(o in i)&&(i[o]=i[a],delete i[a]);return{method:s,params:i}}return{method:s,params:t}}function Sv(e,t,n){const s=n.toLowerCase(),i=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],o=zd[a];if(o&&t&&typeof t=="object"){const c={...t};if(a in c)return c[o]=c[a],delete c[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${o}"`),{method:e,params:c,renames:{[a]:o}}}}if(s.includes("unknown method")||s.includes("method not found")){const a=wv[e];if(a&&a.length>0){const o=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let o=!1;const c={};for(const[d,p]of Object.entries(Kd))d in a&&(a[p]=a[d],delete a[d],c[d]=p,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${d}" → "${p}"`));if(o)return{method:e,params:a,renames:c}}return null}async function zs(e,t,n,s){const i=s?.timeout??3e4;let{method:a,params:o}=s?.raw?{method:t,params:n}:$v(t,n);const c=async(d,p)=>Promise.race([e.request(d,p),new Promise((r,u)=>setTimeout(()=>u(new Error(`Request timeout (${i}ms): ${d}`)),i))]);try{return{ok:!0,data:await c(a,o),method:a,healed:a!==t}}catch(d){const p=String(d instanceof Error?d.message:d);if(s?.raw)return{ok:!1,error:p,method:t};const r=Sv(a,o,p);if(r)try{const u=await c(r.method,r.params);return Ut.set(t,{resolvedMethod:r.method,fieldRenames:r.renames,ts:Date.now()}),cl(),{ok:!0,data:u,method:r.method,healed:!0}}catch(u){return{ok:!1,error:String(u instanceof Error?u.message:u),method:r.method,healed:!0}}if(s?.fallbacks)for(const u of s.fallbacks)try{const h=await c(u,o);return Ut.set(t,{resolvedMethod:u,fieldRenames:{},ts:Date.now()}),cl(),{ok:!0,data:h,method:u,healed:!0}}catch{continue}return{ok:!1,error:p,method:a}}}function Wd(){Ut.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function xv(){const e={};for(const[t,n]of Ut)e[t]=n;return e}const Av=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:Wd,getHealingEntries:xv,safeRequest:zs},Symbol.toStringTag,{value:"Module"}));let ye=null;function qd(e,t){Wd();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;ye={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===n&&a.methods)return ye.methods=a.methods,ye.probing=!1,ye}}catch{}return Tv(t).catch(()=>{}),ye}async function Tv(e){if(!ye)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),o=a.toLowerCase(),c=o.includes("unknown method")||o.includes("not found")&&o.includes("method");s.available=!c,c&&(s.error="method not available");const d=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);d&&(s.fields=d[1].split(",").map(p=>p.trim().replace(/['"]/g,"")))}ye.methods[n.method]=s}ye.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(ye))}catch{}}function jd(e){if(!ye)return;const t=ye.methods[e];if(t)return t.available}function _v(){return ye?.hostVersion??"unknown"}function Cv(){return ye}function Ev(){return ye?.probing??!1}async function Hd(e,t,n){const s=await zs(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await zs(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function Rv(e,t,n){if(jd("sessions.autoTitle")!==!1){const c=await zs(e,"sessions.autoTitle",{sessionKey:t});if(c.ok)return{ok:!0,title:c.data?.title}}const i=n.find(c=>c.role==="user");if(!i)return{ok:!1,error:"No user message to derive title from"};const a=Pv(i.content),o=await Hd(e,t,a);return o.ok?{ok:!0,title:a}:{ok:!1,error:o.error}}function Pv(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),i=s.lastIndexOf(" ");t=(i>30?s.slice(0,i):s)+"..."}return t}function Lv(e){return String(e.label??e.displayName??e.key??"Untitled")}const Iv=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:Cv,getHostVersion:_v,hasMethod:jd,hostAutoTitle:Rv,hostPatchSession:Hd,initHostCompat:qd,isProbing:Ev,readSessionName:Lv},Symbol.toStringTag,{value:"Module"})),Ta=new Map;let dl=null,qi=!1;function Dv(e,t,n){return Ta.get(`${e}:${t}:${n}`)??null}async function Vd(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const i=e.chatMessages[s],a=va(i);for(let o=0;o<a.length;o++)if(a[o].url&&!a[o].omitted){const c=/^data:([^;]+);base64,(.+)$/.exec(a[o].url);c&&n.push({data:c[2],mimeType:c[1],messageIndex:s,imageIndex:o,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(s?.cached){const i=n.map((a,o)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:s.cached[o]?.hash,mimeType:a.mimeType,bytes:s.cached[o]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!qi){qi=!0;try{const s=cd();s&&await s.catch(()=>{});const i=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){dl!==t&&Ta.clear();for(const[c,d]of Object.entries(o.images))Ta.set(`${t}:${c}`,d);return dl=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(o=>va(o).some(d=>d.omitted||!d.url))){for(const o of[500,1500,3e3])if(await new Promise(c=>setTimeout(c,o)),await i()||e.sessionKey!==t)break}}catch{}finally{qi=!1}}}let ul=null;function Mv(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,i=Array.isArray(s.content)?s.content:[];for(const a of i){const o=a,c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);if(d._sidebarAction?.type==="proof"&&d._sidebarAction.slug){const p=d._sidebarAction.slug;if(p===ul)return;ul=p,e.handleOpenProofDoc(p);return}}catch{}}}}function Ks(e){Vd(e)}const Dn=[];function Ov(){return[...Dn]}let lt=null;const Fv=10,Nv=1e3,Ce=new Map;function ji(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function Bv(e,t){if(!t?.mainSessionKey)return;const n="main",s=r=>(r??"").trim()===n||(r??"").trim()==="",i=s(e.sessionKey)?e.sessionKey:ji(e.sessionKey,t),a=s(e.settings.sessionKey)?e.settings.sessionKey:ji(e.settings.sessionKey,t),o=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:ji(e.settings.lastActiveSessionKey,t),c=i||a||e.sessionKey,d={...e.settings,sessionKey:a||c,lastActiveSessionKey:o||c},p=d.sessionKey!==e.settings.sessionKey||d.lastActiveSessionKey!==e.settings.lastActiveSessionKey;c!==e.sessionKey&&(e.sessionKey=c),p&&Xe(e,d)}function Uv(e){lt&&(clearTimeout(lt),lt=null);const t=(e.reconnectAttempt??0)+1;if(t>Fv){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Nv*Math.pow(2,t-1),3e4);lt=setTimeout(()=>{lt=null,e.connected||mo(e)},n)}async function zv(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Kv(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const i=e;if(i.showSetupTab=!0,n.identity?.name){i.setupQuickDone=!0;const a=e;(!a.userName||!a.settings.userName)&&(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}}else s.onboardingActive=!1,s.onboardingData=n??null}catch{}}function Wv(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const Gd=new Set;function qv(){Gd.clear()}async function jv(e,t){}function mo(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,qv();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),lt&&(clearTimeout(lt),lt=null),e.client?.stop(),e.client=new bv({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const i=e;typeof i.showToast=="function"&&i.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const a=e;"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const c=new Date,d=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==d&&(o.todaySelectedDate=d)}e.workingSessions.clear(),e.requestUpdate?.();for(const c of Ce.values())clearTimeout(c);Ce.clear()}qd(n,e.client),Jv(e,n),ld(e),id(e),ai(e,{quiet:!0}),gt(e,{quiet:!0}),Z(e),as(e),zv(e).then(()=>Kv(e)),Gv(e),Qv(e),fv(e),mv(e),Yv(e)},onClose:({code:n,reason:s})=>{e.connected=!1,gv(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Uv(e)},onEvent:n=>Hv(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function Hv(e,t){try{Vv(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Vv(e,t){if(Dn.unshift({ts:Date.now(),event:t.event,payload:t.payload}),Dn.length>250&&(Dn.length=250),e.tab==="debug"&&(e.eventLog=[...Dn]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),Fh(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Co(e,n.sessionKey),n.state==="delta"){const a=Ce.get(n.sessionKey);a&&(clearTimeout(a),Ce.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const o=`safety:${n.sessionKey}`,c=Ce.get(o);c&&clearTimeout(c),Ce.set(o,setTimeout(()=>{Ce.delete(o),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=Ce.get(n.sessionKey);a&&(clearTimeout(a),Ce.delete(n.sessionKey));const o=`safety:${n.sessionKey}`,c=Ce.get(o);c&&(clearTimeout(c),Ce.delete(o)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&Wv(e,n.sessionKey);const s=fd(e,n),i=n?.sessionKey===Q||(n?.sessionKey?.endsWith(`:${Q}`)??!1);if(n&&i){const a=e,o=e.tab==="chat"&&e.sessionKey===Q;if(n.state==="delta"){const c=dn(n.message);if(!o){if(typeof c=="string"){const d=a.allyStream??"";(!d||c.length>=d.length)&&(a.allyStream=c)}a.allyWorking=!0,a.requestUpdate?.()}}else if(n.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const c=e;c._loadAllyHistory().then(()=>{a.allyPanelOpen&&c._scrollAllyToBottom(),a.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const c=dn(n.message),d=n.state==="aborted"?"Response was stopped.":c||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${d}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await jv(e,n.sessionKey);try{await Z(e,{activeMinutes:0})}catch{}})(),s==="final"||s==="error"||s==="aborted"){if(Wa(e),Su(e),s==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const a=e;a.autoRetryAfterCompact&&a.pendingRetry?(a.autoRetryAfterCompact=!1,setTimeout(()=>{a.handleRetryMessage?.()},500)):(a.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{a.handleSendChat?.("Continue where you left off.")},800))}(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(s==="final"){const a=!!e.compactionStatus?.completedAt;pd(e,{allowShrink:a}).then(()=>{Vd(e),e.loadSessionResources?.(),Mv(e);const c=e;if(!c.compactionStatus?.active){const p=[...Array.isArray(c.chatMessages)?c.chatMessages:[]].reverse().find(r=>typeof r=="object"&&r!==null&&r.role==="user");if(p){const r=p.content;let u="";typeof r=="string"?u=r:Array.isArray(r)&&(u=r.filter(h=>typeof h?.text=="string").map(h=>h.text).join(" ")),(u.includes("Pre-compaction memory flush")||u.includes("pre-compaction memory flush"))&&(c.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{c.handleSendChat?.("Continue where you left off.")},800))}}});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===n.sessionKey&&E(async()=>{const{loadDashboard:c}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:c}},[],import.meta.url).then(({loadDashboard:c})=>{c(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&pi(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&gt(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=cv(t.payload);if(n){e.execApprovalQueue=uv(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=ol(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),c=e;typeof c.showToast=="function"&&c.showToast(`${i} Process ${o} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=dv(t.payload);n&&(e.execApprovalQueue=ol(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const i=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===Q&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,i={role:"assistant",content:n.summary||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],i],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result"];n.type&&a.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&a.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),Ue.set(n.sessionKey,n.title),Gd.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function Gv(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Qv(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function Yv(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const i=await e.client.request("tasks.openSession",{taskId:n});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await E(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:o}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function Jv(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Bv(e,n.sessionDefaults)}async function oi(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const a=s;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Xv(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Zv=2e3,ey=new Set(["trace","debug","info","warn","error","fatal"]);function ty(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function ny(e){if(typeof e!="string")return null;const t=e.toLowerCase();return ey.has(t)?t:null}function sy(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=ny(n?.logLevelName??n?.level),a=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=ty(a);let c=null;o&&(typeof o.subsystem=="string"?c=o.subsystem:typeof o.module=="string"&&(c=o.module)),!c&&a&&a.length<120&&(c=a);let d=null;return typeof t[1]=="string"?d=t[1]:!o&&typeof t[0]=="string"?d=t[0]:typeof t.message=="string"&&(d=t.message),{raw:e,time:s,level:i,subsystem:c,message:d??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function vo(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(s.lines)?s.lines.filter(c=>typeof c=="string"):[]).map(sy),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-Zv),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const Qd={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Team"};function Hi(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):Qd[t??e]??e}function iy(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const i=Math.floor(s/60),a=s%60;if(i<60)return`${i}m ${a}s`;const o=Math.floor(i/60),c=i%60;return`${o}h ${c}m`}function ay(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function oy(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function ry(e,t){const n=[],s=new Set;for(const i of t){i.childSessionKey&&s.add(i.childSessionKey);const a=i.swarm?.enabled===!0,o=i.status==="review";n.push({id:i.id,type:a?"swarm":"coding",task:i.description,status:oy(i.status),model:i.model??null,startedAt:i.startedAt??i.createdAt,endedAt:i.completedAt??null,branch:i.branch,prUrl:i.prUrl,swarmStage:a?i.swarm.currentStage:void 0,swarmStages:a?i.swarm.stages:void 0,error:i.error,canCancel:i.status==="running"||i.status==="validating"||i.status==="queued",roleName:a?"Swarm":"Builder",childSessionKey:i.childSessionKey,isReview:o})}for(const i of e)s.has(i.childSessionKey)||n.push({id:i.runId,type:"subagent",task:i.task,status:i.endedAt?i.outcome?.status==="error"?"failed":"done":"active",model:i.model,startedAt:i.startedAt??i.createdAt,endedAt:i.endedAt,label:i.label,error:i.outcome?.error??void 0,roleName:i.label??"Sub-Agent",childSessionKey:i.childSessionKey});return n.sort((i,a)=>{const o={active:0,queued:1,failed:2,done:3},c=o[i.status]-o[a.status];return c!==0?c:(a.startedAt??0)-(i.startedAt??0)}),n}function ly(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function cy(e,t=0,n=0){const s=ay();let i=0,a=0,o=0,c=0;for(const p of e)p.status==="active"&&i++,p.status==="done"&&p.endedAt&&p.endedAt>=s&&a++,p.status==="failed"&&p.endedAt&&p.endedAt>=s&&o++,p.type==="swarm"&&(p.status==="active"||p.status==="queued")&&c++;const d=e.filter(p=>p.isReview&&(p.type==="coding"||p.type==="swarm")).length;return{activeNow:i,completedToday:a,failed:o,swarmPipelines:c,queueDepth:t,queueReview:n+d}}async function mt(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}let i=[],a=[];try{i=(await e.client.request("subagents.list",{limit:200})).runs??[]}catch{}try{a=(await e.client.request("coding.list",{})).tasks??[]}catch{}const o=ry(i,a),c=s?.items??[],d=[];let p=0;for(const b of c)b.status==="processing"?o.push({id:b.id,type:"queue",task:b.title,status:"active",model:null,startedAt:b.startedAt??b.createdAt,endedAt:null,error:b.error,roleName:Hi(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl}):b.status==="review"?(p++,o.push({id:b.id,type:"queue",task:b.title,status:"done",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,roleName:Hi(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl,isReview:!0})):b.status==="failed"?o.push({id:b.id,type:"queue",task:b.title,status:"failed",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,error:b.error,roleName:Hi(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount}):b.status==="pending"&&d.push(b);o.sort((b,$)=>{const k={active:0,queued:1,failed:2,done:3},S=k[b.status]-k[$.status];return S!==0?S:($.startedAt??0)-(b.startedAt??0)});const r=d.length,u=cy(o,r,p),h=ly(o);let y={projects:[],selectedProjectId:null,detail:null,feed:[],running:!1};try{const b=await e.client.request("godmode.delegation.projects",{});if(b?.running&&b.projects.length>0){const $=b.projects,k=n.missionControlData?.swarm?.selectedProjectId,S=k&&$.some(R=>R.projectId===k)?k:$.find(R=>R.status==="in_progress")?.projectId??$[0].projectId;let A=null,P=[];if(S){try{A=await e.client.request("godmode.delegation.status",{projectId:S})}catch{}try{P=(await e.client.request("godmode.delegation.feed",{projectId:S}))?.events??[]}catch{}}y={projects:$,selectedProjectId:S,detail:A,feed:P,running:!0}}}catch{}n.missionControlData={agents:o,stats:u,activityFeed:h,lastRefreshedAt:Date.now(),queueItems:d,swarm:y}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function dy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await mt(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function uy(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,i=n?.item?.title??"task";if(s){const a=s.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase());e.showToast(`Approved! How did ${a} do on "${i}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await mt(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function py(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await mt(e),!0):!1}catch{return!1}}async function hy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.retry",{id:t}),e.showToast("Retrying...","success",2e3),await mt(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function fy(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}async function gy(e,t){const n=e;n.missionControlData?.swarm&&(n.missionControlData={...n.missionControlData,swarm:{...n.missionControlData.swarm,selectedProjectId:t}}),await mt(e,{quiet:!0})}async function my(e,t,n,s){if(!e.client||!e.connected)return!1;try{const i=await e.client.request("godmode.delegation.steer",{projectId:t,issueTitle:n,instructions:s});return i?.success?(e.showToast("Steering sent","success",2e3),await mt(e,{quiet:!0}),!0):(e.showToast(i?.error??"Failed to steer","error"),!1)}catch(i){return e.showToast("Failed to send steering","error"),console.error("[MissionControl] steer error:",i),!1}}const it=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:Qd,approveCodingTask:py,approveQueueItem:uy,cancelCodingTask:dy,formatDuration:iy,loadAgentDetail:fy,loadMissionControl:mt,retryQueueItem:hy,selectSwarmProject:gy,steerSwarmAgent:my},Symbol.toStringTag,{value:"Module"}));function yo(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ai(e,{quiet:!0})},5e3))}function bo(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function wo(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&vo(e,{quiet:!0})},2e3))}function ko(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function $o(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&oi(e)},3e3))}function So(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function Yd(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&mt(e,{quiet:!0})},5e3))}function Jd(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function ss(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function ri(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function vy(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Ds(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function yy(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Ds(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function by(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=vy(e.cronForm),n=yy(e.cronForm),s=e.cronForm.agentId.trim(),i={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!i.name)throw new Error("Name required.");await e.client.request("cron.add",i),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ri(e),await ss(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function wy(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await ri(e),await ss(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function ky(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await Xd(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function $y(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ri(e),await ss(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Xd(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Wt(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function Sy(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const i=e.guardrailsData?.gates.find(a=>a.id===t)?.name??t;e.showToast(`${i} ${n?"enabled":"disabled"}`,"success",2e3),await Wt(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function xy(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Wt(e)}catch(i){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",i)}}async function Ay(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Wt(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function Ty(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Wt(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function _y(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Wt(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const en=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:_y,deleteCustomGuardrail:Ty,loadGuardrails:Wt,toggleCustomGuardrail:Ay,toggleGuardrail:Sy,updateGuardrailThreshold:xy},Symbol.toStringTag,{value:"Module"}));function Cy(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Ey(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function xo(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Cy(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Ry(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Ry(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Dt(t.file??{}))}async function Py(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=Ey(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await xo(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Ly(e,t,n){const s=Dt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});yc(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Iy(e,t){const n=Dt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});bc(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}const Dy=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function My(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Dy]}function Oy(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function Zd(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function eu(e,t,n){const s=t||re(),i="agentLog.get";try{const a=await e.request(i,{date:s});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||s,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return Fy(e,s)}async function Fy(e,t){const n=My(t),s=i=>i.includes("AGENT-DAY.md");for(const i of n)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!Oy(a.content)||s(i)&&typeof a.modifiedAt=="number"&&re(new Date(a.modifiedAt))!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function Rn(e,t,n){return new Promise((s,i)=>{const a=setTimeout(()=>i(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(a),s(o)},o=>{clearTimeout(a),i(o)})})}const Ny={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function tu(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??re(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const o of s.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&i.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Ny[o.type]??o.type,queueItemId:o.id});const a=(n.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:i.get(o.id)??null}));return e.todayTasks=a,a}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function nu(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function By(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<s)).sort((i,a)=>(a.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Uy(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function Mn(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await Zd(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function zy(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await eu(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function su(e){const t=e||re(),n="VAULT",s=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(i,"_blank")}async function Ws(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?Rn(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([Rn(Zd(e.client,t),1e4,"Daily Brief"),n,Rn(eu(e.client,t),1e4,"Agent Log"),Rn(tu(e),8e3,"Today Tasks"),Rn(nu(e),5e3,"Inbox")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox"],a=s.map((o,c)=>o.status==="rejected"?{section:i[c],reason:o.reason}:null).filter(Boolean);if(a.length>0){for(const o of a)console.warn(`[MyDay] ${o.section} failed:`,o.reason);a.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const On=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:zy,loadBriefOnly:Mn,loadInboxItems:nu,loadMyDay:Ws,loadTodayQueueResults:By,loadTodayTasksWithQueueStatus:tu,openBriefInObsidian:su,syncTodayTasks:Uy},Symbol.toStringTag,{value:"Module"}));async function Ao(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function un(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function li(e){return e instanceof Error?e.message:String(e)}async function is(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=li(n)}finally{e.skillsLoading=!1}}}async function _a(e){if(!(!e.client||!e.connected)){e.godmodeSkillsLoading=!0;try{const t=await e.client.request("godmode.skills.list",{});e.godmodeSkills=t??null}catch(t){console.error("[Skills] Failed to load GodMode skills:",t),e.godmodeSkills=null}finally{e.godmodeSkillsLoading=!1}}}function Ky(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function Wy(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await is(e),un(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=li(s);e.skillsError=i,un(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function qy(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await is(e),un(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=li(n);e.skillsError=s,un(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function jy(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await is(e),un(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const a=li(i);e.skillsError=a,un(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function iu(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function Hy(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const i=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function au(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function Vy(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function Gy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function ci(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function To(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ci(e.lastUpdated,e.lastScanned)}}function Vi(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ci(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function pl(e){return{id:e.id,key:e.key,title:e.title,created:ci(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function qt(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function ou(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ci(t.modified):void 0,children:t.children?ou(t.children):void 0}))}function Qy(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function di(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(To),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=Qy(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function ui(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...To(n.workspace),pinned:(n.pinned??[]).map(Vi),pinnedSessions:(n.pinnedSessions??[]).map(pl),outputs:(n.outputs??[]).map(Vi),folderTree:n.folderTree?ou(n.folderTree):void 0,sessions:(n.sessions??[]).map(pl),tasks:(n.tasks??[]).map(qt),memory:(n.memory??[]).map(Vi)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Yy(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function Jy(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await di(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function Xy(e,t){if(!t){e.selectedWorkspace=null;return}const n=await ui(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Zy(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await ui(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function eb(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await ui(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function tb(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=To(a.workspace),c=e.workspaces??[],d=new Map(c.map(p=>[p.id,p]));return d.set(o.id,o),e.workspaces=Array.from(d.values()).toSorted((p,r)=>r.lastUpdated.getTime()-p.lastUpdated.getTime()),e.workspacesError=null,o}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function nb(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function sb(e,t){e.workspacesSearchQuery=t}function ib(e){e.selectedWorkspace=null}async function ab(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function ob(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function rb(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(qt)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function lb(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(qt)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const cb={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function db(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const i of n.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&s.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:cb[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...qt(i),queueStatus:s.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function ub(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:s});return qt(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function pb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return qt(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function hb(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function fb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return qt(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function gb(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function mb(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function vb(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function yb(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(i){return console.error("[Workspaces] moveFile failed:",i),!1}}async function bb(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(i){return console.error("[Workspaces] renameFile failed:",i),!1}}const pe=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:gb,clearWorkspaceSelection:ib,createTask:fb,createWorkspace:tb,createWorkspaceFolder:vb,deleteWorkspace:nb,getWorkspace:ui,loadAllTasks:lb,loadAllTasksWithQueueStatus:db,loadWorkspaceTasks:rb,loadWorkspaces:di,moveWorkspaceFile:yb,readWorkspaceFile:Yy,renameWorkspaceFile:bb,scanWorkspaces:Jy,searchWorkspaceFiles:mb,selectWorkspace:Xy,setWorkspacesSearchQuery:sb,startTask:hb,startTeamSetup:ab,toggleTaskComplete:ub,toggleWorkspaceFolder:ob,toggleWorkspacePin:Zy,toggleWorkspaceSessionPin:eb,updateTask:pb},Symbol.toStringTag,{value:"Module"})),ru="godmode.ui.settings.v1";function wb(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(ru);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(o=>typeof o=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function kb(e){localStorage.setItem(ru,JSON.stringify(e))}const $b=56,Sb="quantum-particles",xb="quantum-particle";let ct=null,Un=null;function $e(e,t){return Math.random()*(t-e)+e}function lu(){if(cu(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Un=requestAnimationFrame(()=>{Un=null,lu()});return}ct=document.createElement("div"),ct.className=Sb,Object.assign(ct.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<$b;t++){const n=document.createElement("div");n.className=xb;const s=$e(2,5),i=$e(.3,.65),a=$e(15,35),o=$e(0,12),c=$e(5,95),d=$e(5,95),p=$e(-150,150),r=$e(-200,200),u=$e(-250,250),h=$e(-350,350),y=$e(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${c}%`,top:`${d}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${$e(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(i)),n.style.setProperty("--drift-x",`${p}px`),n.style.setProperty("--drift-y",`${r}px`),n.style.setProperty("--drift-end-x",`${u}px`),n.style.setProperty("--drift-end-y",`${h}px`),n.style.setProperty("--particle-scale-mid",String(y)),ct.appendChild(n)}e.prepend(ct)}function cu(){Un!==null&&(cancelAnimationFrame(Un),Un=null),ct&&(ct.remove(),ct=null)}function Ab(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function _o(e){return e==="system"?Ab():e==="light"?"lifetrack":e}const ks=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Tb=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Pn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},_b=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,c=Tb();if(!!o.startViewTransition&&!c){let p=.5,r=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")p=ks(n.pointerClientX/window.innerWidth),r=ks(n.pointerClientY/window.innerHeight);else if(n?.element){const h=n.element.getBoundingClientRect();h.width>0&&h.height>0&&typeof window<"u"&&(p=ks((h.left+h.width/2)/window.innerWidth),r=ks((h.top+h.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${p*100}%`),a.style.setProperty("--theme-switch-y",`${r*100}%`),a.classList.add("theme-transition");const u=setTimeout(()=>{Pn(a)},1e3);try{const h=o.startViewTransition?.(()=>{t()});h?.finished?h.finished.finally(()=>{clearTimeout(u),Pn(a)}):(clearTimeout(u),Pn(a))}catch{clearTimeout(u),Pn(a),t()}return}t(),Pn(a)};function Cb(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function Eb(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const i=n.trim();!i||typeof s!="number"||!Number.isFinite(s)||(t[i]=Math.max(t[i]??0,s))}return t}function Xe(e,t){const n=t.sessionKey.trim()||"main",s=Cb(t.openTabs,n),i=Eb(t.tabLastViewed),a={...t,sessionKey:n,openTabs:s,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=a,kb(a),a.theme!==e.theme&&(e.theme=a.theme,os(e,_o(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Co(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&Xe(e,{...e.settings,lastActiveSessionKey:n})}function du(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let o=!1;if(n!=null){const d=n.trim();d&&d!==e.settings.token&&Xe(e,{...e.settings,token:d}),t.delete("token"),o=!0}if(s!=null){const d=s.trim();d&&(e.password=d),t.delete("password"),o=!0}if(i!=null){const d=i.trim();if(d){e.sessionKey=d;const p=d.toLowerCase(),u=p==="main"||p==="agent:main:main"||p.endsWith(":main")||e.settings.openTabs.includes(d)?e.settings.openTabs:[...e.settings.openTabs,d];Xe(e,{...e.settings,sessionKey:d,lastActiveSessionKey:d,openTabs:u})}}if(a!=null){const d=a.trim();d&&d!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=d),t.delete("gatewayUrl"),o=!0}if(!o)return;const c=new URL(window.location.href);c.search=t.toString(),window.history.replaceState({},"",c.toString())}function Eo(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===Q&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const i=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?yo(e):bo(e),t==="logs"?wo(e):ko(e),t==="debug"?$o(e):So(e),t==="mission-control"?Yd(e):Jd(e),as(e),Po(e,t,!1)}function uu(e,t,n){_b({nextTheme:t,applyTheme:()=>{e.theme=t,Xe(e,{...e.settings,theme:t}),os(e,_o(t))},context:n,currentTheme:e.theme})}async function as(e){if(e.tab==="overview"&&await Lo(e),(e.tab==="today"||e.tab==="my-day")&&(await Ws(e),E(()=>Promise.resolve().then(()=>On),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([iu(e),au(e)]),e.tab==="workspaces"&&(await di(e),E(()=>Promise.resolve().then(()=>pe),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await yu(e),e.tab==="instances"&&await Ao(e),e.tab==="sessions"&&(await Z(e),await Bt(e)),e.tab==="cron"&&await pi(e),e.tab==="skills"&&(await is(e),await _a(e)),e.tab==="agents"){const{loadRoster:t}=await E(async()=>{const{loadRoster:n}=await Promise.resolve().then(()=>Sm);return{loadRoster:n}},void 0,import.meta.url);await t(e)}if(e.tab==="nodes"&&(await ai(e),await gt(e),await Je(e),await xo(e)),e.tab==="chat"&&(await Mo(e),ve(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Wt(t)),n.push(Z(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e,n=t.secondBrainSubtab;n==="intel"?typeof t.handleIntelLoad=="function"&&await t.handleIntelLoad():n==="files"?typeof t.handleSecondBrainFileTreeRefresh=="function"&&await t.handleSecondBrainFileTreeRefresh():typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await wc(e),await Je(e)),e.tab==="debug"&&(await oi(e),e.eventLog=Ov()),e.tab==="logs"&&(e.logsAtBottom=!0,await vo(e,{reset:!0}),xc(e,!0))}function pu(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Xs(e):wh(window.location.pathname)}function hu(e){e.theme=e.settings.theme??"system",os(e,_o(e.theme))}function os(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?lu():cu()}function fu(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&os(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function gu(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function mu(e,t){if(typeof window>"u")return;const n=Tc(window.location.pathname,e.basePath)??"chat";Ro(e,n),Po(e,n,t)}function vu(e){if(typeof window>"u")return;const t=Tc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];Xe(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}Ro(e,t)}function Ro(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?yo(e):bo(e),t==="logs"?wo(e):ko(e),t==="debug"?$o(e):So(e),t==="mission-control"?Yd(e):Jd(e),e.connected&&as(e)}function Po(e,t,n){if(typeof window>"u")return;const s=Vn(Ka(t,e.basePath)),i=Vn(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function be(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function Lo(e){await Promise.all([Ie(e,!1),Ao(e),Z(e),ss(e),oi(e)])}async function yu(e){await Promise.all([Ie(e,!0),wc(e),Je(e)])}async function pi(e){await Promise.all([Ie(e,!1),ss(e),ri(e)])}const Rb=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:os,applySettings:Xe,applySettingsFromUrl:du,attachThemeListener:fu,detachThemeListener:gu,inferBasePath:pu,loadChannelsTab:yu,loadCron:pi,loadOverview:Lo,onPopState:vu,refreshActiveTab:as,setLastActiveSessionKey:Co,setTab:Eo,setTabFromRoute:Ro,setTheme:uu,syncTabWithLocation:mu,syncThemeWithSettings:hu,syncUrlWithSessionKey:be,syncUrlWithTab:Po},Symbol.toStringTag,{value:"Module"}));function qs(e){return e.chatSending||!!e.chatRunId}function Pe(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function Ye(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function bu(e,t){const n=t??e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function wu(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Pb(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function Io(e){e.connected&&(e.chatMessage="",await lo(e))}function Lb(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:si(),text:s,createdAt:a,attachments:i?n?.map(c=>({...c})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),i&&n)for(const c of n)o.push({type:"image",source:{type:"base64",media_type:c.mimeType,data:c.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],ve(e,!0)}async function Ca(e,t,n){Wa(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{ve(e,!0)});const i=await ro(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(Co(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),ve(e,!0),i&&!e.chatRunId&&Do(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function Do(e){if(!e.connected||qs(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Ca(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function ku(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function $u(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],c=o.length>0;if(!i&&!c)return;if(wu(i)){await Io(e);return}const d=Pb(i);if(t==null&&(e.chatMessage="",bu(e)),n?.queue){Lb(e,i,o),qs(e)||await Do(e);return}if(qs(e)){await lo(e),await new Promise(p=>setTimeout(p,50)),await Ca(e,i,{attachments:c?o:void 0,refreshSessions:d});return}await Ca(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:c?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:d})}async function Mo(e){await Promise.all([oe(e),Z(e,{activeMinutes:0}),js(e)]),ve(e,!0)}const Su=Do;function Ib(e){const t=Sc(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Db(e,t){const n=Xs(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function js(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Ib(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Db(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const Gi=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:bu,flushChatQueueForEvent:Su,handleAbortChat:Io,handleSendChat:$u,isChatBusy:qs,isChatStopCommand:wu,refreshChat:Mo,refreshChatAvatar:js,removeQueuedMessage:ku,restoreDraft:Ye,saveDraft:Pe},Symbol.toStringTag,{value:"Module"})),Mb={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Ob={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:Fb}=Np,hl=e=>e,Nb=e=>e.strings===void 0,fl=()=>document.createComment(""),Ln=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const a=s.insertBefore(fl(),i),o=s.insertBefore(fl(),i);n=new Fb(a,o,e,e.options)}else{const a=n._$AB.nextSibling,o=n._$AM,c=o!==e;if(c){let d;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(d=e._$AU)!==o._$AU&&n._$AP(d)}if(a!==i||c){let d=n._$AA;for(;d!==a;){const p=hl(d).nextSibling;hl(s).insertBefore(d,i),d=p}}}return n},$t=(e,t,n=e)=>(e._$AI(t,n),e),Bb={},Ub=(e,t=Bb)=>e._$AH=t,zb=e=>e._$AH,Qi=e=>{e._$AR(),e._$AA.remove()};const gl=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},hi=ja(class extends Ha{constructor(e){if(super(e),e.type!==qa.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],a=[];let o=0;for(const c of e)i[o]=s?s(c,o):o,a[o]=n(c,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=zb(e),{values:a,keys:o}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=o,a;const c=this.ut??=[],d=[];let p,r,u=0,h=i.length-1,y=0,b=a.length-1;for(;u<=h&&y<=b;)if(i[u]===null)u++;else if(i[h]===null)h--;else if(c[u]===o[y])d[y]=$t(i[u],a[y]),u++,y++;else if(c[h]===o[b])d[b]=$t(i[h],a[b]),h--,b--;else if(c[u]===o[b])d[b]=$t(i[u],a[b]),Ln(e,d[b+1],i[u]),u++,b--;else if(c[h]===o[y])d[y]=$t(i[h],a[y]),Ln(e,i[u],i[h]),h--,y++;else if(p===void 0&&(p=gl(o,y,b),r=gl(c,u,h)),p.has(c[u]))if(p.has(c[h])){const $=r.get(o[y]),k=$!==void 0?i[$]:null;if(k===null){const S=Ln(e,i[u]);$t(S,a[y]),d[y]=S}else d[y]=$t(k,a[y]),Ln(e,i[u],k),i[$]=null;y++}else Qi(i[h]),h--;else Qi(i[u]),u++;for(;y<=b;){const $=Ln(e,d[b+1]);$t($,a[y]),d[y++]=$}for(;u<=h;){const $=i[u++];$!==null&&Qi($)}return this.ut=o,Ub(e,d),pt}});function xu(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Kb(e,t){const n=ao(e),s=ni(n.role);if(s==="system")return null;if(s==="tool"){const c=[];for(const d of n.content)if(d.name&&c.push(`**Tool:** ${d.name}`),d.text){const p=d.text.length>2e3?d.text.slice(0,2e3)+`

... (truncated)`:d.text;c.push(p)}return c.length===0?null:`<details>
<summary>Tool result</summary>

${c.join(`

`)}

</details>`}const i=s==="user"||n.role==="User"?"User":t,a=[];for(const c of n.content)if(c.type==="text"&&c.text)a.push(c.text);else if(c.type==="tool_call"&&c.name){const d=c.args?`\`${JSON.stringify(c.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${c.name}\` ${d}`)}if(a.length===0)return null;const o=xu(n.timestamp);return`## ${i}
_${o}_

${a.join(`

`)}`}function Wb(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function qb(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function jb(e,t,n){if(!e||e.length===0)return;const s=n||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${xu(Date.now())}  `),i.push(`**Assistant:** ${s}`),i.push("---");for(const p of e){const r=Kb(p,s);r&&i.push(r)}const a=i.join(`

`)+`
`,o=new Blob([a],{type:"text/markdown;charset=utf-8"}),c=URL.createObjectURL(o),d=document.createElement("a");d.href=c,d.download=`session-${qb(t)}-${Wb()}.md`,document.body.appendChild(d),d.click(),requestAnimationFrame(()=>{document.body.removeChild(d),URL.revokeObjectURL(c)})}function Oo(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function Hb(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function fi(e){Pe(e);const n=`agent:main:webchat-${si().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),be(e,n,!0),oe(e),Oo(),Hb()}function Ea(e,t){const n=Ka(t,e.basePath);return l`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Gn(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${kh(t)}</span>
      <span class="nav-item__text">${Gn(t)}</span>
    </a>
  `}function Au(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=l`
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
  `,o=l`
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
  `,c=l`
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
  `,d=l`
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
  `;return l`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>fi(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${c}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${p=>{const u=p.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:u.bottom+8,right:window.innerWidth-u.right},e.sessionPickerOpen||Z(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${H.folderOpen}
        </button>
        ${e.sessionPickerOpen?Qb(e):f}
      </div>
      <!-- Session search -->
      <div class="session-search-container">
        <button
          class="chat-toolbar__btn ${e.sessionSearchOpen?"active":""}"
          @click=${p=>e.handleToggleSessionSearch(p)}
          title="Search sessions"
          aria-label="Search session contents"
          aria-expanded=${e.sessionSearchOpen}
        >
          ${d}
        </button>
        ${e.sessionSearchOpen?Gb(e):f}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Mo(e)}}
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
        @click=${()=>{jb(e.chatMessages,e.sessionKey,e.assistantName)}}
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
  `}function Vb(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let Yi=null;function Gb(e){if(!e.client||!e.connected)return l`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,Yi&&clearTimeout(Yi),Yi=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Pe(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),Ye(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),be(e,i,!0),oe(e).then(()=>{Js(e),ve(e,!0)})},s=i=>{const a=i.label??i.displayName??i.key,o=i.matches.length>0;return l`
      <div class="session-search-result" @click=${()=>n(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${o?l`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(c=>l`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${c.role}:</span>
                      <span class="session-search-result__text">${c.text}</span>
                    </div>
                  `)}
              </div>
            `:f}
      </div>
    `};return l`
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
        ${e.sessionSearchLoading?l`
                <div class="session-search-empty">Searching...</div>
              `:e.sessionSearchQuery.trim()===""?l`
                  <div class="session-search-empty">Type to search session contents</div>
                `:e.sessionSearchResults.length===0?l`
                    <div class="session-search-empty">No results found</div>
                  `:e.sessionSearchResults.map(s)}
      </div>
    </div>
  `}function Qb(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return l`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;if(e.sessionsLoading)return l`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;let n=(e.sessionsResult?.sessions??[]).filter(h=>!e.settings.openTabs.includes(h.key));t&&(n=n.filter(h=>[h.label,h.displayName,h.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),o=Vb(a),c=h=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Pe(e),e.settings.openTabs.includes(h)?(e.sessionKey=h,e.applySettings({...e.settings,sessionKey:h,lastActiveSessionKey:h,tabLastViewed:{...e.settings.tabLastViewed,[h]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,h],sessionKey:h,lastActiveSessionKey:h,tabLastViewed:{...e.settings.tabLastViewed,[h]:Date.now()}}),e.sessionKey=h),Ye(e,h),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),be(e,h,!0),oe(e).then(()=>{Js(e),ve(e,!0)})},d=async(h,y)=>{if(h.stopPropagation(),!!window.confirm(`Delete session "${y}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter($=>$.key!==y)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:y,deleteTranscript:!0}),Z(e)}catch($){console.error("Failed to delete session:",$),Z(e)}},p=h=>l`
    <div class="session-picker-item" @click=${()=>c(h.key)}>
      <span class="session-picker-item__status ${h.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${h.label??h.displayName??h.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${h.updatedAt?l`<span class="session-picker-item__time">${_h(h.updatedAt)}</span>`:f}
        <button
          class="session-picker-item__close"
          @click=${y=>d(y,h.key)}
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
  `,r=(h,y)=>y.length===0?f:l`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${h}</div>
        ${hi(y,b=>b.key,p)}
      </div>
    `,u=o.today.length+o.yesterday.length+o.older.length;return l`
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
          @input=${h=>{e.sessionPickerSearch=h.target.value}}
          @click=${h=>h.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${u===0?l`
                <div class="session-picker-empty">No other sessions</div>
              `:l`
              ${r("Today",o.today)}
              ${r("Yesterday",o.yesterday)}
              ${r("Older",o.older)}
              ${i>s?l`<div class="session-picker-overflow">
                    Showing ${s} of ${i} sessions. Use search to find more.
                  </div>`:f}
            `}
      </div>
    </div>
  `}const Yb=["system","light","dark","lifetrack"];function Tu(e){const t=Math.max(0,Yb.indexOf(e.theme)),n=s=>i=>{const o={element:i.currentTarget};(i.clientX||i.clientY)&&(o.pointerClientX=i.clientX,o.pointerClientY=i.clientY),e.setTheme(s,o)};return l`
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
          ${Zb()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Jb()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Xb()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${ew()}
        </button>
      </div>
    </div>
  `}function Jb(){return l`
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
  `}function Xb(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Zb(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function ew(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const at=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:fi,renderChatControls:Au,renderTab:Ea,renderThemeToggle:Tu,scrollActiveTabIntoView:Oo},Symbol.toStringTag,{value:"Module"})),Ji=new Set;function ml(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const i=Lt(e.sessionsResult?.sessions,n)?.key??n;if(dt.has(n)||dt.has(i)||Ji.has(i))continue;Ji.add(i);const o=e.client;ud(o,i).then(c=>{i!==n&&c.length>0&&dt.set(n,c)}).finally(()=>{Ji.delete(i),e.applySettings({...e.settings})})}}function tw(e){e.basePath=pu(),e._urlSettingsApplied||(du(e),e._urlSettingsApplied=!0),mu(e,!0),hu(e),fu(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),fi(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),Pe(e),e.sessionKey=i,Ye(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),be(e,i,!0),oe(e).then(()=>{Ks(e)}))},window.addEventListener("keydown",e.keydownHandler),mo(e),e.tab==="nodes"&&yo(e),e.tab==="logs"&&wo(e),e.tab==="debug"&&$o(e)}function nw(e){vh(e)}function sw(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),bo(e),ko(e),So(e),gu(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Lt(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const o=e.find(c=>c.key===i||c.key.endsWith(`:${i}`));if(o)return o}const a=t.replace(/^webchat:/,"");if(a!==t){const o=e.find(c=>c.key.endsWith(a)||c.key.endsWith(`:${a}`));if(o)return o}}function iw(e,t){if(!t||t.length===0)return;const n=d=>{const p=d.toLowerCase();return p==="main"||p==="agent:main:main"||p.endsWith(":main")},s=(d,p)=>{const r=d?.sessionId?.trim();if(r)return`session:${r}`;if(d){const h=[d.kind,d.surface,d.subject,d.room,d.space,d.label,d.displayName].map(y=>String(y??"").trim().toLowerCase()).join("|");if(h.replace(/\|/g,"").length>0)return`meta:${h}`}return`key:${p}`};let i=!1;const a=new Map,o=[];for(const d of e.settings.openTabs){const p=d.trim();if(!p){i=!0;continue}if(n(p)){i=!0;continue}const r=Lt(t,p),u=r?.key??p;u!==d&&(i=!0);const h=s(r,u);if(a.has(h)){i=!0;continue}a.set(h,u),o.push(u)}const c=o.length!==e.settings.openTabs.length;if(i||c){const d={};for(const[b,$]of Object.entries(e.settings.tabLastViewed)){const k=b.trim();if(!k||typeof $!="number"||!Number.isFinite($))continue;const S=Lt(t,k),A=s(S,S?.key??k),P=a.get(A)??S?.key??k;d[P]=Math.max(d[P]??0,$)}const p=Lt(t,e.sessionKey),r=s(p,p?.key??e.sessionKey.trim()),u=a.get(r)??p?.key??(e.sessionKey.trim()||o[0]||"main"),y=u==="main"||u.endsWith(":main")||o.includes(u)?u:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:y,lastActiveSessionKey:y,tabLastViewed:d}),e.sessionKey!==y&&(e.sessionKey=y)}}function aw(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&iw(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&ml(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,i=!n||n.parallelLanes.some((a,o)=>a!==e.settings.parallelLanes[o]);(s||i)&&ml(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&oe(e).then(()=>{Ks(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&as(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s||i)&&Js(e),ve(e,n||s||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&xc(e,t.has("tab")||t.has("logsAutoFollow"))}async function vl(e,t){return!1}async function ow(e,t){return null}function yl(e){return e.charAt(0).toUpperCase()||"A"}function bl(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),i=n>=12?"PM":"AM";return`${n%12||12}:${s} ${i}`}function rw(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function _u(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function Cu(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const wl=new WeakMap;function lw(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=wl.get(n),i=s??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,o=e.stream?.length??0,c=a!==i.lastMsgCount||o>i.lastStreamLen;wl.set(n,{lastMsgCount:a,lastStreamLen:o}),c&&(!s||_u(n,120))&&Cu(t)})}function cw(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!_u(t))}function Eu(e,t){return e.allyAvatar?l`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?l`<span class="ally-panel__header-initial">${yl(e.allyName)}</span>`:l`${yl(e.allyName)}`}function kl(e){if(e.role==="assistant"&&e.content){const t=we(e.content);return l`<div class="ally-msg__content chat-text">${Le(t)}</div>`}return l`<span class="ally-msg__content">${e.content}</span>`}function dw(e,t){return!e.actions||e.actions.length===0?f:l`
    <div class="ally-msg__actions">
      ${e.actions.map(n=>l`
          <button
            type="button"
            class="ally-msg__action-btn"
            @click=${()=>t?.(n.action,n.target,n.method,n.params)}
          >
            ${n.label}
          </button>
        `)}
    </div>
  `}function uw(e,t,n){if(e.isNotification)return l`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${kl(e)}
        ${dw(e,n)}
        ${e.timestamp?l`<div class="ally-msg__time">${bl(e.timestamp)}</div>`:f}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return l`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${kl(e)}
      ${e.timestamp?l`<div class="ally-msg__time">${bl(e.timestamp)}</div>`:f}
    </div>
  `}function pw(e){if(!e)return f;const t=Vc(e);return l`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${Le(t)}</div>
    </div>
  `}function hw(e){return e.connected?f:l`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function fw(){return l`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function gw(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const i of Array.from(n)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const o=new FileReader,c=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const d=o.result;t.onAttachmentsChange([...t.attachments,{id:c,dataUrl:d,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(a),s.push({id:c,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function mw(e){return e.attachments.length===0?f:l`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>l`
          <div class="ally-panel__attachment">
            ${t.dataUrl?l`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:l`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(n=>n.id!==t.id))}
            >${H.x}</button>
          </div>
        `)}
    </div>
  `}function vw(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return l`
    ${mw(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const i=s.target;rw(i),e.onDraftChange(i.value)}}
        @paste=${s=>gw(s,e)}
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
  `}function yw(e){return l`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${Eu(e,"bubble")}
        ${e.isWorking?l`<span class="ally-bubble__working"></span>`:f}
      </button>
      ${e.unreadCount>0?l`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:f}
    </div>
  `}function Ru(e){return lw(e),l`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${Eu(e,"header")}
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

    ${hw(e)}

    <div class="ally-panel__messages" @scroll=${cw}>
      ${e.messages.length===0&&!e.stream?l`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:f}
      ${e.messages.map((t,n)=>uw(t,n,e.onAction))}
      ${e.stream?pw(e.stream):f}
      ${(e.isWorking||e.sending)&&!e.stream?fw():f}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&Cu(n)}}
      >${H.chevronDown}</button>
    </div>

    ${vw(e)}
  `}function bw(e){return e.open?l`
    <div class="ally-panel">
      ${Ru(e)}
    </div>
  `:yw(e)}function ww(e){return e.open?l`
    <div class="ally-inline">
      ${Ru(e)}
    </div>
  `:f}function ze(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Pu(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(ze(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function gi(e){return e.filter(t=>typeof t=="string").join(".")}function xe(e,t){const n=gi(e),s=t[n];if(s)return s;const i=n.split(".");for(const[a,o]of Object.entries(t)){if(!a.includes("*"))continue;const c=a.split(".");if(c.length!==i.length)continue;let d=!0;for(let p=0;p<i.length;p+=1)if(c[p]!=="*"&&c[p]!==i[p]){d=!1;break}if(d)return o}}function tt(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function kw(e){const t=gi(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function rn(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const $w=new Set(["title","description","default","nullable"]);function Sw(e){return Object.keys(e??{}).filter(n=>!$w.has(n)).length===0}function xw(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const es={chevronDown:l`
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
  `,plus:l`
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
  `,minus:l`
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
  `,trash:l`
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
  `,edit:l`
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
  `};function Ze(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,p=ze(t),r=xe(s,i),u=r?.label??t.title??tt(String(s.at(-1))),h=r?.help??t.description,y=gi(s);if(a.has(y))return l`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${u}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const $=(t.anyOf??t.oneOf??[]).filter(x=>!(x.type==="null"||Array.isArray(x.type)&&x.type.includes("null")));if($.length===1)return Ze({...e,schema:$[0]});const k=x=>{if(x.const!==void 0)return x.const;if(x.enum&&x.enum.length===1)return x.enum[0]},S=$.map(k),A=S.every(x=>x!==void 0);if(A&&S.length>0&&S.length<=5){const x=n??t.default;return l`
        <div class="cfg-field">
          ${d?l`<label class="cfg-field__label">${u}</label>`:f}
          ${h?l`<div class="cfg-field__help">${h}</div>`:f}
          <div class="cfg-segmented">
            ${S.map((_,T)=>l`
              <button
                type="button"
                class="cfg-segmented__btn ${_===x||rn(_)===rn(x)?"active":""}"
                ?disabled=${o}
                @click=${()=>c(s,_)}
              >
                ${rn(_)}
              </button>
            `)}
          </div>
        </div>
      `}if(A&&S.length>5)return Sl({...e,options:S,value:n??t.default});const P=new Set($.map(x=>ze(x)).filter(Boolean)),R=new Set([...P].map(x=>x==="integer"?"number":x));if([...R].every(x=>["string","number","boolean"].includes(x))){const x=R.has("string"),_=R.has("number");if(R.has("boolean")&&R.size===1)return Ze({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(x||_)return $l({...e,inputType:_&&!x?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const $=n??t.default;return l`
        <div class="cfg-field">
          ${d?l`<label class="cfg-field__label">${u}</label>`:f}
          ${h?l`<div class="cfg-field__help">${h}</div>`:f}
          <div class="cfg-segmented">
            ${b.map(k=>l`
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
      `}return Sl({...e,options:b,value:n??t.default})}if(p==="object")return Tw(e);if(p==="array")return _w(e);if(p==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return l`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${u}</span>
          ${h?l`<span class="cfg-toggle-row__help">${h}</span>`:f}
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
    `}return p==="number"||p==="integer"?Aw(e):p==="string"?$l({...e,inputType:"text"}):l`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${u}</div>
      <div class="cfg-field__error">Unsupported type: ${p}. Use Raw mode.</div>
    </div>
  `}function $l(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o,inputType:c}=e,d=e.showLabel??!0,p=xe(s,i),r=p?.label??t.title??tt(String(s.at(-1))),u=p?.help??t.description,h=p?.sensitive??kw(s),y=p?.placeholder??(h?"••••":t.default!==void 0?`Default: ${rn(t.default)}`:""),b=n??"";return l`
    <div class="cfg-field">
      ${d?l`<label class="cfg-field__label">${r}</label>`:f}
      ${u?l`<div class="cfg-field__help">${u}</div>`:f}
      <div class="cfg-input-wrap">
        <input
          type=${h?"password":c}
          class="cfg-input"
          placeholder=${y}
          .value=${rn(b)}
          ?disabled=${a}
          @input=${$=>{const k=$.target.value;if(c==="number"){if(k.trim()===""){o(s,void 0);return}const S=Number(k);o(s,Number.isNaN(S)?k:S);return}o(s,k)}}
          @change=${$=>{if(c==="number")return;const k=$.target.value;o(s,k.trim())}}
        />
        ${t.default!==void 0?l`
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
  `}function Aw(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o}=e,c=e.showLabel??!0,d=xe(s,i),p=d?.label??t.title??tt(String(s.at(-1))),r=d?.help??t.description,u=n??t.default??"",h=typeof u=="number"?u:0;return l`
    <div class="cfg-field">
      ${c?l`<label class="cfg-field__label">${p}</label>`:f}
      ${r?l`<div class="cfg-field__help">${r}</div>`:f}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,h-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${rn(u)}
          ?disabled=${a}
          @input=${y=>{const b=y.target.value,$=b===""?void 0:Number(b);o(s,$)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,h+1)}
        >+</button>
      </div>
    </div>
  `}function Sl(e){const{schema:t,value:n,path:s,hints:i,disabled:a,options:o,onPatch:c}=e,d=e.showLabel??!0,p=xe(s,i),r=p?.label??t.title??tt(String(s.at(-1))),u=p?.help??t.description,h=n??t.default,y=o.findIndex($=>$===h||String($)===String(h)),b="__unset__";return l`
    <div class="cfg-field">
      ${d?l`<label class="cfg-field__label">${r}</label>`:f}
      ${u?l`<div class="cfg-field__help">${u}</div>`:f}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${y>=0?String(y):b}
        @change=${$=>{const k=$.target.value;c(s,k===b?void 0:o[Number(k)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map(($,k)=>l`
          <option value=${String(k)}>${String($)}</option>
        `)}
      </select>
    </div>
  `}function Tw(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e;e.showLabel;const d=xe(s,i),p=d?.label??t.title??tt(String(s.at(-1))),r=d?.help??t.description,u=n??t.default,h=u&&typeof u=="object"&&!Array.isArray(u)?u:{},y=t.properties??{},$=Object.entries(y).toSorted((P,R)=>{const x=xe([...s,P[0]],i)?.order??0,_=xe([...s,R[0]],i)?.order??0;return x!==_?x-_:P[0].localeCompare(R[0])}),k=new Set(Object.keys(y)),S=t.additionalProperties,A=!!S&&typeof S=="object";return s.length===1?l`
      <div class="cfg-fields">
        ${$.map(([P,R])=>Ze({schema:R,value:h[P],path:[...s,P],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${A?xl({schema:S,value:h,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:k,onPatch:c}):f}
      </div>
    `:l`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${p}</span>
        <span class="cfg-object__chevron">${es.chevronDown}</span>
      </summary>
      ${r?l`<div class="cfg-object__help">${r}</div>`:f}
      <div class="cfg-object__content">
        ${$.map(([P,R])=>Ze({schema:R,value:h[P],path:[...s,P],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${A?xl({schema:S,value:h,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:k,onPatch:c}):f}
      </div>
    </details>
  `}function _w(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,p=xe(s,i),r=p?.label??t.title??tt(String(s.at(-1))),u=p?.help??t.description,h=Array.isArray(t.items)?t.items[0]:t.items;if(!h)return l`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${r}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const y=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return l`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?l`<span class="cfg-array__label">${r}</span>`:f}
        <span class="cfg-array__count">${y.length} item${y.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const b=[...y,Pu(h)];c(s,b)}}
        >
          <span class="cfg-array__add-icon">${es.plus}</span>
          Add
        </button>
      </div>
      ${u?l`<div class="cfg-array__help">${u}</div>`:f}

      ${y.length===0?l`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:l`
        <div class="cfg-array__items">
          ${y.map((b,$)=>l`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${$+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const k=[...y];k.splice($,1),c(s,k)}}
                >
                  ${es.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${Ze({schema:h,value:b,path:[...s,$],hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:c})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function xl(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:c,onPatch:d}=e,p=Sw(t),r=Object.entries(n??{}).filter(([u])=>!c.has(u));return l`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const u={...n};let h=1,y=`custom-${h}`;for(;y in u;)h+=1,y=`custom-${h}`;u[y]=p?{}:Pu(t),d(s,u)}}
        >
          <span class="cfg-map__add-icon">${es.plus}</span>
          Add Entry
        </button>
      </div>

      ${r.length===0?l`
              <div class="cfg-map__empty">No custom entries.</div>
            `:l`
        <div class="cfg-map__items">
          ${r.map(([u,h])=>{const y=[...s,u],b=xw(h);return l`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${u}
                    ?disabled=${o}
                    @change=${$=>{const k=$.target.value.trim();if(!k||k===u)return;const S={...n};k in S||(S[k]=S[u],delete S[u],d(s,S))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${p?l`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${b}
                          ?disabled=${o}
                          @change=${$=>{const k=$.target,S=k.value.trim();if(!S){d(y,void 0);return}try{d(y,JSON.parse(S))}catch{k.value=b}}}
                        ></textarea>
                      `:Ze({schema:t,value:h,path:y,hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const $={...n};delete $[u],d(s,$)}}
                >
                  ${es.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Al={env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
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
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
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
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Fo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Tl(e){return Al[e]??Al.default}function Cw(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=Fo[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:Fn(t,s)}function Fn(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||Fn(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&Fn(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&Fn(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&Fn(s,t))return!0}return!1}function Ew(e){if(!e.schema)return l`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(ze(t)!=="object"||!t.properties)return l`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??"",o=e.activeSection,c=e.activeSubsection??null,p=Object.entries(i).toSorted((u,h)=>{const y=xe([u[0]],e.uiHints)?.order??50,b=xe([h[0]],e.uiHints)?.order??50;return y!==b?y-b:u[0].localeCompare(h[0])}).filter(([u,h])=>!(o&&u!==o||a&&!Cw(u,h,a)));let r=null;if(o&&c&&p.length===1){const u=p[0]?.[1];u&&ze(u)==="object"&&u.properties&&u.properties[c]&&(r={sectionKey:o,subsectionKey:c,schema:u.properties[c]})}return p.length===0?l`
      <div class="config-empty">
        <div class="config-empty__icon">${H.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:l`
    <div class="config-form config-form--modern">
      ${r?(()=>{const{sectionKey:u,subsectionKey:h,schema:y}=r,b=xe([u,h],e.uiHints),$=b?.label??y.title??tt(h),k=b?.help??y.description??"",S=n[u],A=S&&typeof S=="object"?S[h]:void 0,P=`config-section-${u}-${h}`;return l`
              <section class="config-section-card" id=${P}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Tl(u)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${$}</h3>
                    ${k?l`<p class="config-section-card__desc">${k}</p>`:f}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Ze({schema:y,value:A,path:[u,h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():p.map(([u,h])=>{const y=Fo[u]??{label:u.charAt(0).toUpperCase()+u.slice(1),description:h.description??""};return l`
              <section class="config-section-card" id="config-section-${u}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Tl(u)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${y.label}</h3>
                    ${y.description?l`<p class="config-section-card__desc">${y.description}</p>`:f}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Ze({schema:h,value:n[u],path:[u],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Rw=new Set(["title","description","default","nullable"]);function Pw(e){return Object.keys(e??{}).filter(n=>!Rw.has(n)).length===0}function Lu(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(a=>Object.is(a,i))||s.push(i);return{enumValues:s,nullable:n}}function Iu(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:zn(e,[])}function zn(e,t){const n=new Set,s={...e},i=gi(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const c=Lw(e,t);return c||{schema:e,unsupportedPaths:[i]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=ze(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=a||e.nullable,s.enum){const{enumValues:c,nullable:d}=Lu(s.enum);s.enum=c,d&&(s.nullable=!0),c.length===0&&n.add(i)}if(o==="object"){const c=e.properties??{},d={};for(const[p,r]of Object.entries(c)){const u=zn(r,[...t,p]);u.schema&&(d[p]=u.schema);for(const h of u.unsupportedPaths)n.add(h)}if(s.properties=d,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Pw(e.additionalProperties)){const p=zn(e.additionalProperties,[...t,"*"]);s.additionalProperties=p.schema??e.additionalProperties,p.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const c=Array.isArray(e.items)?e.items[0]:e.items;if(!c)n.add(i);else{const d=zn(c,[...t,"*"]);s.items=d.schema??c,d.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function Lw(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let a=!1;for(const c of n){if(!c||typeof c!="object")return null;if(Array.isArray(c.enum)){const{enumValues:d,nullable:p}=Lu(c.enum);s.push(...d),p&&(a=!0);continue}if("const"in c){if(c.const==null){a=!0;continue}s.push(c.const);continue}if(ze(c)==="null"){a=!0;continue}i.push(c)}if(s.length>0&&i.length===0){const c=[];for(const d of s)c.some(p=>Object.is(p,d))||c.push(d);return{schema:{...e,enum:c,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const c=zn(i[0],t);return c.schema&&(c.schema.nullable=a||c.schema.nullable),c}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(c=>c.type&&o.has(String(c.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function Iw(e,t){let n=e;for(const s of t){if(!n)return null;const i=ze(n);if(i==="object"){const a=n.properties??{};if(typeof s=="string"&&a[s]){n=a[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Dw(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function Mw(e){const t=Iu(e.schema),n=t.schema;if(!n)return l`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Iw(n,["channels",e.channelId]);if(!s)return l`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},a=Dw(i,e.channelId);return l`
    <div class="config-form">
      ${Ze({schema:s,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function nt(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return l`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?l`
              <div class="muted">Loading config schema…</div>
            `:Mw({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function Ow(e){const{props:t,discord:n,accountCountLabel:s}=e;return l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Fw(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Nw(e){const{props:t,imessage:n,accountCountLabel:s}=e;return l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function _l(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Bw(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:c}=e,d=s[0],p=n?.configured??d?.configured??!1,r=n?.running??d?.running??!1,u=n?.publicKey??d?.publicKey,h=n?.lastStartAt??d?.lastStartAt??null,y=n?.lastError??d?.lastError??null,b=s.length>1,$=a!=null,k=A=>{const P=A.publicKey,R=A.profile,x=R?.displayName??R?.name??A.name??A.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${x}</div>
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
            <span class="monospace" title="${P??""}">${_l(P)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${A.lastInboundAt?B(A.lastInboundAt):"n/a"}</span>
          </div>
          ${A.lastError?l`
                <div class="account-card-error">${A.lastError}</div>
              `:f}
        </div>
      </div>
    `},S=()=>{if($&&o)return Zp({state:a,callbacks:o,accountId:s[0]?.accountId??"default"});const A=d?.profile??n?.profile,{name:P,displayName:R,about:x,picture:_,nip05:T}=A??{},N=P||R||x||_||T;return l`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${p?l`
                <button
                  class="btn btn-sm"
                  @click=${c}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:f}
        </div>
        ${N?l`
              <div class="status-list">
                ${_?l`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${_}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${D=>{D.target.style.display="none"}}
                        />
                      </div>
                    `:f}
                ${P?l`<div><span class="label">Name</span><span>${P}</span></div>`:f}
                ${R?l`<div><span class="label">Display Name</span><span>${R}</span></div>`:f}
                ${x?l`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${x}</span></div>`:f}
                ${T?l`<div><span class="label">NIP-05</span><span>${T}</span></div>`:f}
              </div>
            `:l`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${b?l`
            <div class="account-card-list">
              ${s.map(A=>k(A))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${p?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${r?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${u??""}"
                  >${_l(u)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${h?B(h):"n/a"}</span>
              </div>
            </div>
          `}

      ${y?l`<div class="callout danger" style="margin-top: 12px;">${y}</div>`:f}

      ${S()}

      ${nt({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Uw(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function zw(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],a=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,c=typeof i?.connected=="boolean"&&i.connected,p=(n.channelAccounts?.[e]??[]).some(r=>r.configured||r.running||r.connected);return a||o||c||p}function Kw(e,t){return t?.[e]?.length??0}function Du(e,t){const n=Kw(e,t);return n<2?f:l`<div class="account-count">Accounts (${n})</div>`}function Ww(e){const{props:t,signal:n,accountCountLabel:s}=e;return l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function qw(e){const{props:t,slack:n,accountCountLabel:s}=e;return l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function jw(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,a=s.length>1,o=c=>{const p=c.probe?.bot?.username,r=c.name||c.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${p?`@${p}`:r}
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
          ${c.lastError?l`
                <div class="account-card-error">
                  ${c.lastError}
                </div>
              `:f}
        </div>
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${a?l`
            <div class="account-card-list">
              ${s.map(c=>o(c))}
            </div>
          `:l`
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

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${nt({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Hw(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return l`
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
            ${n?.authAgeMs!=null?Uw(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${t.whatsappMessage?l`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:f}

      ${t.whatsappQrDataUrl?l`<div class="qr-wrap">
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

      ${nt({channelId:"whatsapp",props:t})}
    </div>
  `}function Vw(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const a=t?.slack??null,o=t?.signal??null,c=t?.imessage??null,d=t?.nostr??null,r=Gw(e.snapshot).map((u,h)=>({key:u,enabled:zw(u,e),order:h})).toSorted((u,h)=>u.enabled!==h.enabled?u.enabled?-1:1:u.order-h.order);return l`
    <section class="grid grid-cols-2">
      ${r.map(u=>Qw(u.key,e,{whatsapp:n,telegram:s,discord:i,slack:a,signal:o,imessage:c,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?B(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:f}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Gw(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Qw(e,t,n){const s=Du(e,n.channelAccounts);switch(e){case"whatsapp":return Hw({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return jw({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Ow({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return Fw({props:t,accountCountLabel:s});case"slack":return qw({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Ww({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Nw({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],a=i[0],o=a?.accountId??"default",c=a?.profile??null,d=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,p=d?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Bw({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:d,profileFormCallbacks:p,onEditProfile:()=>t.onNostrProfileEdit(o,c)})}default:return Yw(e,t,n.channelAccounts??{})}}function Yw(e,t,n){const s=Xw(t.snapshot,e),i=t.snapshot?.channels?.[e],a=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,c=typeof i?.connected=="boolean"?i.connected:void 0,d=typeof i?.lastError=="string"?i.lastError:void 0,p=n[e]??[],r=Du(e,n);return l`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${r}

      ${p.length>0?l`
            <div class="account-card-list">
              ${p.map(u=>nk(u))}
            </div>
          `:l`
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

      ${d?l`<div class="callout danger" style="margin-top: 12px;">
            ${d}
          </div>`:f}

      ${nt({channelId:e,props:t})}
    </div>
  `}function Jw(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Xw(e,t){return Jw(e)[t]?.label??e?.channelLabels?.[t]??t}const Zw=600*1e3;function Mu(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Zw:!1}function ek(e){return e.running?"Yes":Mu(e)?"Active":"No"}function tk(e){return e.connected===!0?"Yes":e.connected===!1?"No":Mu(e)?"Active":"n/a"}function nk(e){const t=ek(e),n=tk(e);return l`
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
        ${e.lastError?l`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:f}
      </div>
    </div>
  `}const Kn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),Kn(s,t);return!0},Hs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Ou=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),ak(t)}};function sk(e){this._$AN!==void 0?(Hs(this),this._$AM=e,Ou(this)):this._$AM=e}function ik(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)Kn(s[a],!1),Hs(s[a]);else s!=null&&(Kn(s,!1),Hs(s));else Kn(this,e)}const ak=e=>{e.type==qa.CHILD&&(e._$AP??=ik,e._$AQ??=sk)};class ok extends Ha{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Ou(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(Kn(this,t),Hs(this))}setValue(t){if(Nb(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const Xi=new WeakMap,rk=ja(class extends ok{render(e){return f}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),f}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=Xi.get(t);n===void 0&&(n=new WeakMap,Xi.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?Xi.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function lk(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const ck=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function dk(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=lk(e).trim();if(!n)return!1;let s=n;if((n.includes("<system-context")||n.includes("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const i=s.toLowerCase();return ck.filter(a=>i.includes(a)).length>=2}const Cl=25*1024*1024,El=50*1024*1024,Rl=20;function Zi(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function No(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const o of a){if(n.length>=Rl){s.push(`Maximum ${Rl} files allowed per upload`);break}if(o.size>Cl){s.push(`"${o.name}" is too large (${Zi(o.size)}). Max ${Zi(Cl)}. For larger files, mention the file path instead.`);continue}if(i+o.size>El){s.push(`Total upload size exceeds ${Zi(El)} limit`);break}i+=o.size,n.push(o)}return{validFiles:n,errors:s}}const uk=new Set(["md","markdown","mdx"]),pk=new Set(["htm","html"]),hk=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function Fu(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function fk(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?uk.has(n)?"text/markdown":pk.has(n)?"text/html":hk.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function Nu(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return fk(e.filePath??null)??"text/markdown"}function gk(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function mk(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(!i)return;const a=gk(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function vk(e){if(e.error)return l`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return l`
      <div class="muted">No content available</div>
    `;const t=Nu(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?l`
        <div class="sidebar-image">
          <img src=${s} alt=${Fu(e.filePath??"Image preview")} />
        </div>
      `:l`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(t==="application/pdf")return s.startsWith("data:application/pdf")?l`<iframe
        class="sidebar-html-frame sidebar-pdf-frame"
        src=${s}
        type="application/pdf"
      ></iframe>`:l`
      <div class="callout">
        PDF preview unavailable. Use "Open in Browser" to view.
      </div>
    `;if(t==="text/html"||t==="application/xhtml+xml"){const i=new Blob([n],{type:"text/html"}),a=URL.createObjectURL(i);return l`<iframe
      class="sidebar-html-frame"
      src=${a}
      sandbox="allow-same-origin allow-top-navigation-by-user-activation allow-popups"
      @load=${o=>{URL.revokeObjectURL(a);const c=o.target;try{const d=c.contentDocument?.documentElement?.scrollHeight;d&&(c.style.height=`${d}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=jc(n);return l`<div
      class="sidebar-markdown"
      @click=${a=>mk(a,e.onOpenFile)}
    >${Le(we(i))}</div>`}return l`<pre class="sidebar-plain">${n}</pre>`}function yk(e){const t=Nu(e);return t==="text/html"||t==="application/xhtml+xml"}function bk(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Ra(e){const t=e.title?.trim()||"Tool Output",n=yk(e)&&e.content;return l`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?l`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:f}
        </div>
        <div class="sidebar-header-actions">
          ${e.onPushToDrive&&e.filePath?l`<div class="sidebar-drive-wrap">
                <button
                  class="btn sidebar-open-browser-btn${e.driveUploading?" sidebar-drive-uploading":""}"
                  title="Push to Google Drive"
                  ?disabled=${e.driveUploading}
                  @click=${()=>e.driveUploading?void 0:e.onToggleDrivePicker?e.onToggleDrivePicker():e.onPushToDrive(e.filePath)}
                >${e.driveUploading?"Uploading...":"⬆ Drive"}</button>
                ${e.showDrivePicker&&e.driveAccounts&&!e.driveUploading?l`<div class="sidebar-drive-picker">
                      ${e.driveAccounts.length===0?l`<div class="sidebar-drive-item sidebar-drive-empty">No Google accounts configured</div>`:e.driveAccounts.map(s=>l`
                              <button
                                class="sidebar-drive-item"
                                @click=${()=>{e.onPushToDrive(e.filePath,s.email),e.onToggleDrivePicker?.()}}
                                title=${s.email}
                              >
                                <span class="sidebar-drive-label">${s.email.split("@")[0]}</span>
                                <span class="sidebar-drive-domain">@${s.email.split("@")[1]}</span>
                              </button>
                            `)}
                    </div>`:f}
              </div>`:f}
          ${n?l`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>bk(e.content)}
              >Open in Browser</button>`:f}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${H.x}
          </button>
        </div>
      </div>
      ${wk(e)}
      <div class="sidebar-content">${vk(e)}</div>
    </div>
  `}function wk(e){if(e.resource)return l`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||Fu(e.filePath);return l`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return f}var kk=Object.defineProperty,$k=Object.getOwnPropertyDescriptor,rs=(e,t,n,s)=>{for(var i=s>1?void 0:s?$k(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&kk(t,n,i),i};let zt=class extends on{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((n?e.clientY:e.clientX)-this.startPos)/s;let c=this.startRatio+o;c=Math.max(this.minRatio,Math.min(this.maxRatio,c)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:c},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return l``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};zt.styles=bp`
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
  `;rs([ts({type:Number})],zt.prototype,"splitRatio",2);rs([ts({type:Number})],zt.prototype,"minRatio",2);rs([ts({type:Number})],zt.prototype,"maxRatio",2);rs([ts({type:String})],zt.prototype,"direction",2);zt=rs([vc("resizable-divider")],zt);const Sk=5e3;function Pl(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function xk(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Ak(e){const t=xk(e);if(t===null)return f;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(r=>r.key===e.sessionKey),a=i?.totalTokens??0,o=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,c=n>=90?"Soul + identity only":n>=70?"P0 + P1 active":"Full context",d=n>=90?l`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`:n>=70?l`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`:f,p=l`
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P3 Safety nudges, onboarding</span>
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P2 Meetings, cron, queue review</span>
    <span class="chat-context-badge__tier ${n<90?"active":"trimmed"}">P1 Schedule, tasks, skill cards</span>
    <span class="chat-context-badge__tier active">P0 Soul, identity, memory</span>
  `;return l`
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
        <span class="chat-context-badge__tier-list">${p}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `}function Tk(e){return e?e.active?l`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${H.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Sk?l`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${H.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:f:f}function Bo(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function _k(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Ck(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function Ek(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Rk(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((r,u)=>r+(u.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=No(s,a);for(const r of c)t.showToast?.(r,"error");if(o.length===0)return;const d=[];let p=o.length;for(const r of o){const u=new FileReader;u.addEventListener("load",()=>{const h=u.result;d.push({id:Bo(),dataUrl:h,mimeType:r.type||"application/octet-stream",fileName:r.name}),p--,p===0&&t.onAttachmentsChange?.([...i,...d])}),u.addEventListener("error",()=>{t.showToast?.(`Failed to read "${r.name}"`,"error"),p--,p===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),u.readAsDataURL(r)}}function Pk(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let r=0;r<n.length;r++){const u=n[r];if(u.type.startsWith("image/")){const h=u.getAsFile();h&&s.push(h)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((r,u)=>r+(u.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=No(s,a);for(const r of c)t.showToast?.(r,"error");if(o.length===0)return;const d=[];let p=o.length;for(const r of o){const u=new FileReader;u.addEventListener("load",()=>{const h=u.result;d.push({id:Bo(),dataUrl:h,mimeType:r.type,fileName:r.name||"pasted-image"}),p--,p===0&&t.onAttachmentsChange?.([...i,...d])}),u.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),p--,p===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),u.readAsDataURL(r)}}function Lk(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((r,u)=>r+(u.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=No(s,a);for(const r of c)t.showToast?.(r,"error");if(o.length===0){n.value="";return}const d=[];let p=o.length;for(const r of o){const u=new FileReader;u.addEventListener("load",()=>{const h=u.result;d.push({id:Bo(),dataUrl:h,mimeType:r.type||"application/octet-stream",fileName:r.name}),p--,p===0&&t.onAttachmentsChange?.([...i,...d])}),u.addEventListener("error",()=>{t.showToast?.(`Failed to read "${r.name}"`,"error"),p--,p===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),u.readAsDataURL(r)}n.value=""}function Ik(e){const t=e.attachments??[];return t.length===0?f:l`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return l`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?l`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:l`<div class="chat-attachment__file">
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
  `}function Dk(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function Mk(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Ok(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function Fk(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Dk(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const d=i.getAttribute("href");if(!d)return;if(t.onOpenProof)try{const r=d.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(r){e.preventDefault(),t.onOpenProof(r[1]);return}}catch{}try{const r=new URL(d,window.location.href);if(/^https?:$/.test(r.protocol)&&r.origin!==window.location.origin){e.preventDefault(),window.open(r.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(d)||Mk(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const o=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const c=Ok(o);c&&(e.preventDefault(),await t.onMessageLinkClick(c))}const Nk={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function Bk(e){const t=e.sessionResources;if(!t||t.length===0)return f;if(e.sessionResourcesCollapsed)return l`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${t.length})</span>
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;const n=t.slice(0,5);return l`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${t.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${t.length>5?l`<button class="session-resources-view-all" @click=${e.onViewAllResources}>View all</button>`:f}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${n.map(s=>l`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(s)}
            >
              <span>${Nk[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function Uk(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const i=e.sessions?.sessions?.find(h=>h.key===e.sessionKey)?.reasoningLevel??"off",a=e.showThinking&&i!=="off",o={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},c=(e.attachments?.length??0)>0,d=e.connected?c?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",p=e.splitRatio??.6,r=!!(e.sidebarOpen&&e.onCloseSidebar),u=l`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${h=>{Fk(h,e)}}
    >
      ${e.loading?l`
              <div class="muted">Loading chat…</div>
            `:f}
      ${hi(qk(e),h=>h.key,h=>{try{if(h.kind==="reading-indicator")return mm(o,e.currentToolInfo);if(h.kind==="stream")return vm(h.text,h.startedAt,e.onOpenSidebar,o,e.currentToolInfo);if(h.kind==="compaction-summary")return km(h.message);if(h.kind==="group"){const y=e.resolveImageUrl?(b,$)=>e.resolveImageUrl(b,$):void 0;return ym(h,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:y,showReasoning:a,assistantName:e.assistantName,assistantAvatar:o.avatar,userName:e.userName,userAvatar:e.userAvatar})}return f}catch(y){return console.error("[chat] item render error:",y,h.key),f}})}
    </div>
  `;return l`
    <section 
      class="card chat"
      @dragover=${_k}
      @dragenter=${h=>Ck(h,h.currentTarget)}
      @dragleave=${h=>Ek(h,h.currentTarget)}
      @drop=${h=>Rk(h,e)}
    >
      ${e.privateMode?l`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:f}

      ${e.disabledReason?l`<div class="callout">${e.disabledReason}</div>`:f}

      ${e.error?l`<div class="callout danger">${e.error}</div>`:f}

      ${Tk(e.compactionStatus)}

      ${e.pendingRetry&&e.onRetry?l`
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
                ${e.onClearRetry?l`
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

      ${e.focusMode?l`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${H.x}
            </button>
          `:f}

      <div
        class="chat-split-container ${r?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${r?`0 0 ${p*100}%`:"1 1 100%"}"
          @click=${r?()=>e.onCloseSidebar?.():f}
        >
          ${u}
          ${e.showScrollButton?l`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?l`<span class="chat-scroll-bottom__badge"></span>`:f}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:f}
        </div>

        ${r?l`
              <resizable-divider
                .splitRatio=${p}
                @resize=${h=>e.onSplitRatioChange?.(h.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?l`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${Ra({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${ww(e.allyProps)}
                    </div>
                  </div>
                `:l`
                  <div class="chat-sidebar">
                    ${Ra({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:f}
      </div>

      ${e.queue.length?l`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(h=>l`
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
                        ${H.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:f}

      ${Bk(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${h=>Lk(h,e)}
          />
          ${Ik(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${rk(h=>h&&Pl(h))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${h=>{if(h.key!=="Enter"||h.isComposing||h.keyCode===229||h.shiftKey||!e.connected)return;h.preventDefault();const y=h.ctrlKey||h.metaKey;t&&e.onSend(y)}}
              @input=${h=>{const y=h.target;Pl(y),e.onDraftChange(y.value)}}
              @paste=${h=>Pk(h,e)}
              placeholder=${d}
            ></textarea>

            <div class="chat-compose__actions">
              ${Ak(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${H.paperclip}
              </button>

              <button
                class="chat-compose__send-btn"
                ?disabled=${!e.canSend||!e.connected}
                @click=${()=>e.onSend(!1)}
                title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
              >
                ${H.arrowUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const Ll=200;function zk(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=ao(s.message),a=ni(i.role),o=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Kk(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function Wk(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function qk(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-Ll);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Ll} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const o=n[a];if(o._chatIdx=a,$m(o)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:o});continue}if(dk(o))continue;const c=ao(o);!e.showThinking&&c.role.toLowerCase()==="toolresult"&&!Kk(o)||!e.showThinking&&c.role.toLowerCase()==="assistant"&&Wk(o)||t.push({kind:"message",key:Il(o,a),message:o})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:Il(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return zk(t)}function Il(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const o=typeof n.timestamp=="number"?n.timestamp:null,c=typeof n.role=="string"?n.role:"unknown";if(o!=null){const d=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${c}:${o}:${d||t}`}return`msg:${c}:${t}`}function jk(e,t=128){return new Promise((n,s)=>{const i=new Image;i.addEventListener("load",()=>{const a=document.createElement("canvas");a.width=t,a.height=t;const o=a.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const c=Math.min(i.width,i.height),d=(i.width-c)/2,p=(i.height-c)/2;o.drawImage(i,d,p,c,c,0,0,t,t),n(a.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let nn="",Nn=null,Ct=null,Dl=!1,ot=!1;function Hk(e){Dl||(nn=e.userName||"",Nn=e.userAvatar||null,Ct=e.userAvatar||null,Dl=!0,ot=!1)}function Vk(e){Hk(e);const t=d=>{nn=d.target.value,ot=!0},n=async d=>{const r=d.target.files?.[0];if(r){if(!r.type.startsWith("image/")){alert("Please select an image file");return}if(r.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const u=await jk(r,128);Nn=u,Ct=u,ot=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(u){console.error("Failed to process image:",u),alert("Failed to process image")}}},s=()=>{Nn=null,Ct=null,ot=!0;const d=document.getElementById("user-avatar-input");d&&(d.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(nn,Nn||""),ot=!1;const d=document.querySelector(".user-settings__save");d&&(d.textContent="Saved!",setTimeout(()=>{d.textContent="Save"},1500))},a=()=>{nn=e.userName||"",Nn=e.userAvatar||null,Ct=e.userAvatar||null,ot=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=nn||"You",c=Ct?l`<img src="${Ct}" alt="${o}" class="user-settings__avatar-img" />`:l`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return l`
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
                  ${Ct?l`
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
                .value=${nn}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${ot?l`
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
                ?disabled=${!ot}
                @click=${i}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Pa={all:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
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
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
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
  `,user:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},ea=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Ml=new Set(["user","model"]),Ol="__all__";function Fl(e){return Pa[e]??Pa.default}function Gk(e,t){const n=Fo[e];return n||{label:t?.title??tt(e),description:t?.description??""}}function Qk(e){const{key:t,schema:n,uiHints:s}=e;if(!n||ze(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([a,o])=>{const c=xe([t,a],s),d=c?.label??o.title??tt(a),p=c?.help??o.description??"",r=c?.order??50;return{key:a,label:d,description:p,order:r}});return i.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),i}function Yk(e,t){if(!e||!t)return[];const n=[];function s(i,a,o){if(i===a)return;if(typeof i!=typeof a){n.push({path:o,from:i,to:a});return}if(typeof i!="object"||i===null||a===null){i!==a&&n.push({path:o,from:i,to:a});return}if(Array.isArray(i)&&Array.isArray(a)){JSON.stringify(i)!==JSON.stringify(a)&&n.push({path:o,from:i,to:a});return}const c=i,d=a,p=new Set([...Object.keys(c),...Object.keys(d)]);for(const r of p)s(c[r],d[r],o?`${o}.${r}`:r)}return s(e,t,""),n}function Nl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const Bl={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function Jk(e){const t=[],n=e.models,s=e.agents,i=n?.providers;if(i&&typeof i=="object")for(const[o,c]of Object.entries(i)){const d=c;for(const p of d.models??[])t.push({id:`${o}/${p.id}`,name:p.name??p.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:p.reasoning??!1,contextWindow:p.contextWindow??0})}const a=s?.defaults?.models;if(a&&typeof a=="object")for(const o of Object.keys(a)){if(t.some(d=>d.id===o))continue;const c=o.split("/");t.push({id:o,name:c.slice(1).join("/"),provider:c[0]??"unknown",providerLabel:(c[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function Xk(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function Zk(e){const t=e.formValue;if(!t)return l`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",i=n?.defaults?.model?.fallbacks??[],a=Jk(t),o=new Map;for(const d of a){const p=o.get(d.provider)??[];p.push(d),o.set(d.provider,p)}const c=e.saving||e.applying;return l`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${i.length>0?l`<div class="model-picker__fallback">Fallback: ${i.join(", ")}</div>`:f}
      </div>

      ${c?l`<div class="model-picker__status">Switching model...</div>`:f}

      ${Array.from(o.entries()).map(([d,p])=>l`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${Bl[d]??"var(--accent)"}"></span>
              ${p[0]?.providerLabel??d}
            </div>
            <div class="model-picker__cards">
              ${p.map(r=>{const u=r.id===s,h=Bl[r.provider]??"var(--accent)";return l`
                  <button
                    class="model-card ${u?"model-card--active":""}"
                    style="--model-accent: ${h}"
                    ?disabled=${c}
                    @click=${()=>{u||!e.onModelSwitch||e.onModelSwitch(r.id,Xk(r.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${r.name||r.id}</div>
                      ${r.reasoning?l`<span class="model-card__tag">reasoning</span>`:f}
                      ${r.contextWindow>0?l`<span class="model-card__ctx">${Math.round(r.contextWindow/1e3)}k ctx</span>`:f}
                    </div>
                    ${u?l`<span class="model-card__check">Active</span>`:f}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function e$(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Iu(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},a=ea.filter(T=>T.key in i&&!Ml.has(T.key)),o=new Set(ea.map(T=>T.key)),c=Object.keys(i).filter(T=>!o.has(T)).map(T=>({key:T,label:T.charAt(0).toUpperCase()+T.slice(1)})),d=ea.filter(T=>Ml.has(T.key)),p=[...a,...c,...d],r=e.activeSection&&n.schema&&ze(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,u=e.activeSection?Gk(e.activeSection,r):null,h=e.activeSection?Qk({key:e.activeSection,schema:r,uiHints:e.uiHints}):[],y=e.formMode==="form"&&!!e.activeSection&&h.length>0,b=e.activeSubsection===Ol,$=e.searchQuery||b?null:e.activeSubsection??h[0]?.key??null,k=e.formMode==="form"?Yk(e.originalValue,e.formValue):[],S=e.formMode==="raw"&&e.raw!==e.originalRaw,A=e.formMode==="form"?k.length>0:S,P=!!e.formValue&&!e.loading&&!!n.schema,R=e.connected&&!e.saving&&A&&(e.formMode==="raw"?!0:P),x=e.connected&&!e.applying&&!e.updating&&A&&(e.formMode==="raw"?!0:P),_=e.connected&&!e.applying&&!e.updating;return l`
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
            @input=${T=>e.onSearchChange(T.target.value)}
          />
          ${e.searchQuery?l`
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
            <span class="config-nav__icon">${Pa.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${p.map(T=>l`
            <button
              class="config-nav__item ${e.activeSection===T.key?"active":""}"
              @click=${()=>e.onSectionChange(T.key)}
            >
              <span class="config-nav__icon">${Fl(T.key)}</span>
              <span class="config-nav__label">${T.label}</span>
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
            ${A?l`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${k.length} unsaved change${k.length!==1?"s":""}`}</span>
            `:l`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!R}
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
              ?disabled=${!_}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${A&&e.formMode==="form"?l`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${k.length} pending change${k.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${k.map(T=>l`
                <div class="config-diff__item">
                  <div class="config-diff__path">${T.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Nl(T.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Nl(T.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:f}

        ${u&&e.formMode==="form"?l`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${Fl(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${u.label}</div>
                  ${u.description?l`<div class="config-section-hero__desc">${u.description}</div>`:f}
                </div>
              </div>
            `:f}

        ${y?l`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${$===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Ol)}
                >
                  All
                </button>
                ${h.map(T=>l`
                    <button
                      class="config-subnav__item ${$===T.key?"active":""}"
                      title=${T.description||T.label}
                      @click=${()=>e.onSubsectionChange(T.key)}
                    >
                      ${T.label}
                    </button>
                  `)}
              </div>
            `:f}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?Zk(e):e.activeSection==="user"?Vk({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?l`
                  ${e.schemaLoading?l`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Ew({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:$})}
                  ${s?l`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:f}
                `:l`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${T=>e.onRawChange(T.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?l`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:f}
      </main>
    </div>
  `}function t$(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function n$(e){const t=e.ts??null;return t?B(t):"n/a"}function s$(e){return e?`${Qn(e)} (${B(e)})`:"n/a"}function i$(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function a$(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function o$(e){const t=e.state??{},n=t.nextRunAtMs?Qn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Qn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function r$(e){const t=e.schedule;return t.kind==="at"?`At ${Qn(t.atMs)}`:t.kind==="every"?`Every ${_c(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function l$(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function c$(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function d$(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function u$(e){const t=c$(e);return l`
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
            <div class="stat-value">${s$(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?l`<span class="muted">${e.error}</span>`:f}
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
        ${p$(e)}
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
	          ${e.form.payloadKind==="agentTurn"?l`
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
	                    ${t.map(n=>l`<option value=${n}>
                            ${d$(e,n)}
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
                ${e.form.sessionTarget==="isolated"?l`
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
      ${e.jobs.length===0?l`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(n=>h$(n,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?l`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?l`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:l`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(n=>f$(n))}
              </div>
            `}
    </section>
  `}function p$(e){const t=e.form;return t.scheduleKind==="at"?l`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?l`
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
    `:l`
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
  `}function h$(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return l`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${r$(e)}</div>
        <div class="muted">${l$(e)}</div>
        ${e.agentId?l`<div class="muted">Agent: ${e.agentId}</div>`:f}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${o$(e)}</div>
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
  `}function f$(e){return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Qn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?l`<div class="muted">${e.error}</div>`:f}
      </div>
    </div>
  `}function g$(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,a=n?.info??0,o=s>0?"danger":i>0?"warn":"success",c=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return l`
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
            ${n?l`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${c}${a>0?` · ${a} info`:""}. Run
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
        ${e.callError?l`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:f}
        ${e.callResult?l`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:f}
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
      ${e.eventLog.length===0?l`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(d=>l`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${d.event}</div>
                      <div class="list-sub">${new Date(d.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${a$(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function m$(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function St(e,t){return t?l`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:f}function v$(e){const t=e.execApprovalQueue[0];if(!t)return f;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${m$(s)}`:"expired",a=e.execApprovalQueue.length;return l`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?l`<div class="exec-approval-queue">${a} pending</div>`:f}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${St("Host",n.host)}
          ${St("Agent",n.agentId)}
          ${St("Session",n.sessionKey)}
          ${St("CWD",n.cwd)}
          ${St("Resolved",n.resolvedPath)}
          ${St("Security",n.security)}
          ${St("Ask",n.ask)}
        </div>
        ${e.execApprovalError?l`<div class="exec-approval-error">${e.execApprovalError}</div>`:f}
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
  `}function y$(e){const{pendingGatewayUrl:t}=e;return t?l`
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
  `:f}function b$(e){if(!e.gatewayRestartPending)return f;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return l`
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
  `}function w$(e){return l`
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
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:f}
      ${e.statusMessage?l`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:f}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?l`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>k$(t))}
      </div>
    </section>
  `}function k$(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${t$(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>l`<span class="chip">${o}</span>`)}
          ${a?l`<span class="chip">${a}</span>`:f}
          ${e.platform?l`<span class="chip">${e.platform}</span>`:f}
          ${e.deviceFamily?l`<span class="chip">${e.deviceFamily}</span>`:f}
          ${e.modelIdentifier?l`<span class="chip">${e.modelIdentifier}</span>`:f}
          ${e.version?l`<span class="chip">${e.version}</span>`:f}
        </div>
      </div>
      <div class="list-meta">
        <div>${n$(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const Ul=["trace","debug","info","warn","error","fatal"];function $$(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function S$(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function x$(e){const t=e.filterText.trim().toLowerCase(),n=Ul.some(a=>!e.levelFilters[a]),s=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:S$(a,t)),i=t||n?"filtered":"visible";return l`
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
        ${Ul.map(a=>l`
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

      ${e.file?l`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:f}
      ${e.truncated?l`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:f}
      ${e.error?l`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:f}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?l`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(a=>l`
                <div class="log-row">
                  <div class="log-time mono">${$$(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const A$=/(^~\/|^\/|^\.\.?\/|[\\/])/;function zl(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!A$.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function T$(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const i=n.getAttribute("href")??"";let a=i;if(i.includes("%"))try{a=decodeURIComponent(i)}catch{a=i}return zl(a)}const s=t.closest("code");return!s||s.closest("pre")?null:zl(s.textContent??"")}function _$(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const i=Be(n,{listDepth:0,orderedIndex:[]});return E$(i)}function La(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${Qe(n,t)}

`;case"h2":return`## ${Qe(n,t)}

`;case"h3":return`### ${Qe(n,t)}

`;case"h4":return`#### ${Qe(n,t)}

`;case"h5":return`##### ${Qe(n,t)}

`;case"h6":return`###### ${Qe(n,t)}

`;case"p":return`${Be(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Be(n,t)}**`;case"em":case"i":return`*${Be(n,t)}*`;case"del":return`~~${Be(n,t)}~~`;case"a":{const i=n.getAttribute("href")??"",a=Be(n,t);return!i||i===a?a:`[${a}](${i})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const i=n.querySelector("code"),a=i?i.textContent??"":n.textContent??"",o=i?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${a}
\`\`\`

`}case"blockquote":return Be(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return Kl(n,t,!1);case"ol":return Kl(n,t,!0);case"li":return Bu(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return C$(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Be(n,t);default:return Be(n,t)}}function Be(e,t){let n="";for(const s of Array.from(e.childNodes))n+=La(s,t);return n}function Qe(e,t){return Be(e,t).replace(/\n+/g," ").trim()}function Kl(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),i="  ".repeat(t.listDepth);let a="";for(let o=0;o<s.length;o++){const c=s[o],d={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},p=n?`${o+1}. `:"- ",r=Bu(c,d);a+=`${i}${p}${r}
`}return t.listDepth===0&&(a+=`
`),a}function Bu(e,t){let n="";for(const s of Array.from(e.childNodes)){const i=s.tagName?.toLowerCase();i==="ul"||i==="ol"?n+=`
`+La(s,t):n+=La(s,t)}return n.trim()}function C$(e,t){const n=[],s=e.querySelector("thead tr"),i=e.querySelectorAll("tbody tr");if(s){const p=Array.from(s.querySelectorAll("th, td")).map(r=>Qe(r,t));n.push(p)}for(const p of Array.from(i)){const r=Array.from(p.querySelectorAll("td, th")).map(u=>Qe(u,t));n.push(r)}if(n.length===0){const p=e.querySelectorAll("tr");for(const r of Array.from(p)){const u=Array.from(r.querySelectorAll("td, th")).map(h=>Qe(h,t));n.push(u)}}if(n.length===0)return"";const a=Math.max(...n.map(p=>p.length)),o=[];for(let p=0;p<a;p++)o[p]=Math.max(3,...n.map(r=>(r[p]??"").length));let c="";const d=p=>`| ${o.map((u,h)=>(p[h]??"").padEnd(u)).join(" | ")} |`;c+=d(n[0])+`
`,c+=`| ${o.map(p=>"-".repeat(p)).join(" | ")} |
`;for(let p=1;p<n.length;p++)c+=d(n[p])+`
`;return c+`
`}function E$(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function R$(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function P$(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function L$(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let Wn=null,pn=null;function Wl(e,t,n=1500){Wn&&clearTimeout(Wn),Wn=setTimeout(()=>{e!==pn&&(pn=e,t(e))},n)}function I$(e,t){Wn&&clearTimeout(Wn),e!==pn&&(pn=e,t(e))}function ta(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return _$(e.innerHTML)}function D$(e){const{data:t,loading:n,error:s,onRefresh:i,onGenerate:a,onOpenInObsidian:o,onSaveBrief:c,onToggleCheckbox:d,onOpenFile:p}=e;if(n)return l`
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
    `;if(s)return l`
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
            ${i?l`<button class="retry-button" @click=${i}>Retry</button>`:f}
          </div>
        </div>
      </div>
    `;if(!t||!t.content)return l`
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
            ${a?l`<button class="brief-generate-btn" @click=${a}>Generate Brief Now</button>`:i?l`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:f}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;pn===null&&(pn=t.content);const r=k=>{const S=k.currentTarget;if(c){const A=ta(S);Wl(A,c)}},u=k=>{if((k.ctrlKey||k.metaKey)&&k.key==="s"){k.preventDefault();const S=k.currentTarget;if(c){const A=ta(S);I$(A,c)}}if((k.ctrlKey||k.metaKey)&&k.key==="l"){k.preventDefault();const S=window.getSelection();if(!S||S.rangeCount===0)return;const A=S.focusNode,P=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");if(P){const R=P.querySelector('input[type="checkbox"]');if(R)R.nextSibling?.nodeType===Node.TEXT_NODE&&R.nextSibling.textContent===" "&&R.nextSibling.remove(),R.remove();else{const _=document.createElement("input");_.type="checkbox",P.insertBefore(document.createTextNode(" "),P.firstChild),P.insertBefore(_,P.firstChild)}const x=k.currentTarget;if(c){const _=ta(x);Wl(_,c)}}}if(k.key==="Enter"&&!k.shiftKey){const S=window.getSelection();if(!S||S.rangeCount===0)return;const A=S.focusNode,P=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");P&&P.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const R=window.getSelection();if(!R||R.rangeCount===0)return;const x=R.focusNode,_=x instanceof HTMLElement?x.closest("li"):x?.parentElement?.closest("li");if(_&&_!==P&&!_.querySelector('input[type="checkbox"]')){const T=document.createElement("input");T.type="checkbox",_.insertBefore(T,_.firstChild),_.insertBefore(document.createTextNode(" "),T.nextSibling);const N=document.createRange();N.setStartAfter(T.nextSibling),N.collapse(!0),R.removeAllRanges(),R.addRange(N)}},0)}},h=k=>{const S=k.target;if(S.tagName==="INPUT"&&S.getAttribute("type")==="checkbox"){const R=S,x=k.currentTarget;if(d&&x){const T=Array.from(x.querySelectorAll('input[type="checkbox"]')).indexOf(R);T>=0&&d(T,R.checked)}return}const A=T$(k.target);if(A&&p){k.preventDefault(),p(A);return}const P=S.closest?.("a")??S.parentElement?.closest("a");if(P){const R=P.getAttribute("href")??"";/^https?:\/\//i.test(R)&&(k.preventDefault(),window.open(R,"_blank","noopener,noreferrer"))}},y=ng(R$(t.content)),b=t.summary.readiness!=null?l`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:f,$=t.summary.tasks.total>0?l`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:f;return l`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${b}
          ${$}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${P$(t.updatedAt)}</span>
          ${o?l`
                <a
                  href="${L$(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${k=>{k.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:f}
          ${i?l`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:f}
        </div>
      </div>

      <div class="my-day-card-content">
        <div class="brief-content brief-content--live">
          <div
            class="brief-rendered brief-editable"
            contenteditable="true"
            spellcheck="false"
            @input=${r}
            @keydown=${u}
            @click=${h}
          >${Le(y)}</div>
        </div>
      </div>
    </div>
  `}function Uu(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function M$(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function O$(e){return e<=2?"Poor":e<=4?"Below expectations":e<=6?"Okay":e<=8?"Good":"Excellent"}function zu(e,t){if(e.scoringId!==t.id)return f;const n=e.scoringValue??7,s=e.feedbackText??"",i=n<=4,a=n<=4||n>=9;return l`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${n<=4?"low":n>=9?"high":""}">${n}/10 — ${O$(n)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>l`
            <button
              class="inbox-score-btn${o===n?" active":""}${o<=4?" low":o>=9?" high":""}"
              @click=${()=>e.onSetScoring(t.id,o)}
            >${o}</button>
          `)}
      </div>
      ${a?l`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${i?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${s}
                @input=${o=>e.onFeedbackChange(o.target.value)}
              ></textarea>
            </div>
          `:f}
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
  `}function F$(e,t){const n=t.deliverables??[];return l`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${Uu(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary}</div>
        ${n.length>0?l`
              <div class="inbox-deliverables">
                ${n.map(s=>l`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${s.persona.replace(/-/g," ")}</span>
                      <span class="inbox-deliverable-title">${s.title}</span>
                      ${s.proofDocSlug?l`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View</button>`:f}
                    </div>
                  `)}
              </div>
            `:f}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>e.onOpenChat(t.id)}>Review in Chat</button>
        ${t.proofDocSlug?l`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Deliverables</button>`:f}
        <button class="btn btn--sm" @click=${()=>e.onSetScoring(t.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${zu(e,t)}
    </div>
  `}function N$(e,t){if(t.type==="project-completion")return F$(e,t);const n=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return l`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${M$(t)}</span>
        <span class="inbox-card-time">${Uu(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary.slice(0,220)}${t.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${t.outputPath?l`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Output</button>`:f}
        ${t.proofDocSlug?l`<button class="btn btn--sm" @click=${()=>e.onViewProof(t.id)}>Proof</button>`:f}
        ${n?l`<button class="btn btn--sm" @click=${()=>e.onOpenChat(t.id)}>Open Chat</button>`:f}
        <button class="btn btn--sm primary" @click=${()=>e.onSetScoring(t.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${zu(e,t)}
    </div>
  `}function B$(e){const t=e.sortOrder??"newest",n=e.items.filter(i=>i.status==="pending").sort((i,a)=>{const o=new Date(a.createdAt).getTime()-new Date(i.createdAt).getTime();return t==="oldest"?-o:o}),s=e.count??n.length;return e.loading?l`<div class="inbox-loading">Loading inbox…</div>`:s===0?l`
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
    `:l`
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
          ${n.map(i=>N$(e,i))}
        </div>
      </div>
    </div>
  `}function Ku(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Uo(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function ql(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function Wu(e){return`ws-task-priority ws-task-priority--${e}`}function qu(e){return e==="high"?"High":e==="low"?"Low":"Med"}function ju(e){if(!e)return"";const t=re();return e===t?"Today":e<t?`Overdue (${e})`:e}function Hu(e){if(!e)return"ws-task-due";const t=re();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Vs(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,i)=>{if(t==="priority"){const a=n[s.priority]-n[i.priority];return a!==0?a:s.dueDate&&i.dueDate?s.dueDate.localeCompare(i.dueDate):s.dueDate&&!i.dueDate?-1:!s.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&i.dueDate){const a=s.dueDate.localeCompare(i.dueDate);if(a!==0)return a}else{if(s.dueDate&&!i.dueDate)return-1;if(!s.dueDate&&i.dueDate)return 1}return n[s.priority]-n[i.priority]})}function jl(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?l`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${p=>{p.preventDefault();const r=p.currentTarget,u=r.querySelector(".ws-task-edit-input"),h=r.querySelector(".ws-task-date-input"),y=u.value.trim();y&&(a?.(e.id,{title:y,dueDate:h.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${p=>p.stopPropagation()}
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
    `:l`
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
      ${e.briefSection?l`<span class="ws-task-section">${e.briefSection}</span>`:f}
      <span class=${Wu(e.priority)}>${qu(e.priority)}</span>
      ${e.dueDate?l`<span class=${Hu(e.dueDate)}>${ju(e.dueDate)}</span>`:f}
      ${!c&&e.queueStatus?.status==="processing"?l`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&n?l`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?l`
                ${f}
                ${n?l`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:f}
              `:!c&&n?l`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:f}
    </div>
  `}function Ia(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?l`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${p=>{p.preventDefault();const r=p.currentTarget,u=r.querySelector(".ws-task-edit-input"),h=r.querySelector(".ws-task-date-input"),y=u.value.trim();y&&(a?.(e.id,{title:y,dueDate:h.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${p=>p.stopPropagation()}
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
    `:l`
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
      ${e.project?l`<span class="ws-task-project">${e.project}</span>`:f}
      ${e.briefSection?l`<span class="ws-task-section">${e.briefSection}</span>`:f}
      <span class=${Wu(e.priority)}>${qu(e.priority)}</span>
      ${e.dueDate?l`<span class=${Hu(e.dueDate)}>${ju(e.dueDate)}</span>`:f}
      ${!c&&e.queueStatus?.status==="processing"?l`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&n?l`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?l`
                ${o?l`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>o(e.id)}
                      title="Preview agent output"
                    >View Output</button>`:f}
                ${n?l`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:f}
              `:!c&&n?l`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:f}
    </div>
  `}function U$(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function Hl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function Vl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function Vu(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(n)||i.path.toLowerCase().includes(n))&&s.push(i);else{const a=Vu(e,i.children??[]);a.length>0&&s.push({...i,children:a})}return s},[])}function Gu(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=Gu(n.children));return t}const z$=10;function K$(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const n=t.match(/#+ (.+?)(?:\s#|$)/);return n?n[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function W$(e,t=z$){return[...e].sort((n,s)=>s.modified.getTime()-n.modified.getTime()).slice(0,t)}function Qu(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return l`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Uo(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?l`<span class="ws-list-meta">${Ku(e.size)}</span>`:f}
          ${e.modified?l`<span class="ws-list-meta">${B(e.modified.getTime())}</span>`:f}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),i=e.children??[],a=Gu(i);return l`
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
      ${s?l`
            <div class="ws-folder-children">
              ${i.map(o=>Qu(o,t+1,n))}
            </div>
          `:f}
    </div>
  `}function q$(e,t,n){return l`
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
      ${n?l`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:f}
    </div>
  `}function na(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e;return l`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${Uo(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${Ku(n.size)}</span>
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
  `}function j$(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e,o=K$(n);return l`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${Uo(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${B(n.modified.getTime())}</span>
        ${o?l`<span class="ws-list-desc">${o}</span>`:f}
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function H$(e,t){return l`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>l`
          ${s>0?l`<span class="breadcrumb-sep">/</span>`:f}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function V$(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:i,onBrowseFolder:a,onBrowseSearch:o,onBrowseBack:c,onCreateFolder:d,onItemClick:p}=e,r=i??t??[];return l`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>c?.()}>
          &larr; Back
        </button>
        ${n?H$(n,u=>a?.(u)):f}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${u=>{const h=u.target;o?.(h.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const u=prompt("New folder name:");if(u?.trim()){const h=n?.[n.length-1]?.path??".";d?.(`${h}/${u.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${r.length===0?l`<div class="workspace-browse-empty">No files found</div>`:r.map(u=>l`
              <button
                class="workspace-browse-entry"
                @click=${()=>{u.type==="folder"?a?.(u.path):p&&p({path:u.path,name:u.name,type:u.fileType??"text",size:u.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${u.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${u.name}</span>
                ${u.excerpt?l`<span class="browse-entry-excerpt">${u.excerpt}</span>`:f}
              </button>
            `)}
      </div>
    </div>
  `}function G$(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:i=!1,onItemSearch:a,onBack:o,onItemClick:c,onSessionClick:d,onPinToggle:p,onPinSessionToggle:r,onToggleFolder:u,onToggleTaskComplete:h,onCreateTask:y,onToggleCompletedTasks:b,onStartTask:$,editingTaskId:k,onEditTask:S,onUpdateTask:A,onBatchPushToDrive:P}=e,R=Hl(n,t.pinned).toSorted((O,ke)=>ke.modified.getTime()-O.modified.getTime()),x=Vl(n,t.pinnedSessions),_=Hl(n,t.outputs).filter(O=>!t.pinned.some(ke=>ke.path===O.path)),T=(t.folderTree?.length??0)>0,N=T?Vu(n,t.folderTree):[],D=Vl(n,t.sessions),z=new Set(t.pinnedSessions.map(O=>O.key)),W=new Set(t.pinned.map(O=>O.path)),j=n.trim().length>0,de=R.length>0||x.length>0,Te=D.length>0||t.sessions.length===0||j,Ke=W$(t.outputs),Y=Ke.length>0&&!j,te={expandedFolders:s,pinnedPaths:W,workspaceId:t.id,onToggleFolder:u,onItemClick:c,onPinToggle:p};return l`
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
        ${e.browsePath!=null?V$(e):f}

        ${de?l`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${R.length+x.length}</span>
                  </div>
                  <div class="ws-list">
                    ${x.map(O=>l`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>d?.(O)}>
                            <span class=${ql(O.status)}></span>
                            <span class="ws-list-title">${O.title}</span>
                            <span class="ws-list-meta">${B(O.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>r?.(t.id,O.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${R.map(O=>na({workspaceId:t.id,entry:O,pinned:!0,onOpen:c,onPinToggle:p}))}
                  </div>
                </section>
              `:f}

        ${Q$({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:h,onCreateTask:y,onToggleCompletedTasks:b,onStartTask:$,editingTaskId:k,onEditTask:S,onUpdateTask:A})}

        ${Y?l`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${Ke.length}</span>
                </div>
                <div class="ws-list">
                  ${Ke.map(O=>j$({workspaceId:t.id,entry:O,pinned:W.has(O.path),onOpen:c,onPinToggle:p}))}
                </div>
              </section>
            `:f}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${T?N.length:_.length}</span>
            ${P&&_.length>0?l`<button class="ws-export-drive-btn" @click=${()=>{const O=_.map(ke=>ke.path);P(O)}}>Export to Drive</button>`:f}
          </div>
          <div class="ws-list ws-list--scroll">
            ${T?N.length===0?l`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:N.map(O=>Qu(O,0,te)):_.length===0?l`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:_.map(O=>na({workspaceId:t.id,entry:O,pinned:!1,onOpen:c,onPinToggle:p}))}
          </div>
        </section>

        ${Te?l`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${D.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${D.length===0?l`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:D.map(O=>l`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>d?.(O)}>
                                  <span class=${ql(O.status)}></span>
                                  <span class="ws-list-title">${O.title}</span>
                                  <span class="ws-list-meta">${B(O.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${z.has(O.key)?"active":""}"
                                  @click=${()=>r?.(t.id,O.key,z.has(O.key))}
                                  title=${z.has(O.key)?"Unpin":"Pin"}
                                >
                                  ${z.has(O.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:f}

        ${(t.memory?.length??0)>0?l`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${t.memory.map(O=>na({workspaceId:t.id,entry:O,pinned:W.has(O.path),onOpen:c,onPinToggle:p}))}
                </div>
              </section>
            `:f}
      </div>
    </div>
  `}function Q$(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:i,onCreateTask:a,onToggleCompletedTasks:o,onStartTask:c,editingTaskId:d,onEditTask:p,onUpdateTask:r}=e,u=Vs(t.filter(y=>y.status==="pending")),h=Vs(t.filter(y=>y.status==="complete"));return l`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${u.length} open${h.length>0?`, ${h.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${u.length===0&&h.length===0?l`<div class="ws-empty">No tasks</div>`:f}
        ${u.map(y=>jl(y,i,c,d,p,r))}
        ${h.length>0?l`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${h.length} completed
              </button>
              ${s?h.map(y=>jl(y,i,c,d,p,r)):f}
            `:f}
      </div>
      ${a?l`
            <form
              class="ws-task-create-form"
              @submit=${y=>{y.preventDefault();const $=y.currentTarget.querySelector("input"),k=$.value.trim();k&&(a(k,n),$.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `:f}
    </section>
  `}function Y$(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:i,itemSearchQuery:a,expandedFolders:o,loading:c,createLoading:d,error:p,allTasks:r=[],taskFilter:u="outstanding",taskSort:h="due",taskSearch:y="",showCompletedTasks:b=!1,editingTaskId:$,workspaceNames:k=[],onSearch:S,onItemSearch:A,onSelectWorkspace:P,onBack:R,onItemClick:x,onSessionClick:_,onPinToggle:T,onPinSessionToggle:N,onCreateWorkspace:D,onDeleteWorkspace:z,onToggleFolder:W,onTeamSetup:j,onToggleTaskComplete:de,onCreateTask:Te,onSetTaskFilter:Ke,onSetTaskSort:Y,onSetTaskSearch:te,onToggleCompletedTasks:O,onStartTask:ke,onEditTask:vt,onUpdateTask:J}=e,jt=n.filter(q=>U$(i,`${q.name} ${q.path} ${q.type}`));return s?G$({workspace:s,itemSearchQuery:a??"",expandedFolders:o,showCompletedTasks:b,onItemSearch:A,onBack:R,onItemClick:x,onSessionClick:_,onPinToggle:T,onPinSessionToggle:N,onToggleFolder:W,onToggleTaskComplete:de,onCreateTask:Te,onToggleCompletedTasks:O,onStartTask:ke,editingTaskId:$,onEditTask:vt,onUpdateTask:J,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):l`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async q=>{if(q.preventDefault(),d||!D)return;const gn=q.currentTarget,V=new FormData(gn),st=V.get("name"),Ht=(typeof st=="string"?st:"").trim();if(!Ht)return;const We=V.get("type"),Vt=(typeof We=="string"?We:"project").trim().toLowerCase(),mn=Vt==="team"||Vt==="personal"?Vt:"project",vn=V.get("path"),yn=(typeof vn=="string"?vn:"").trim();await D({name:Ht,type:mn,...yn?{path:yn}:{}})!==!1&&gn.reset()}}
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
            @input=${q=>S?.(q.target.value)}
          />
          <span class="workspaces-count">${jt.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${j?l`<button class="ws-team-setup-btn" @click=${()=>j()}>Team Setup</button>`:f}
      </div>

      ${p?l`<div class="callout danger" style="margin: 16px;">${p}</div>`:f}

      ${c?l`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:l`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${jt.length===0?l`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?l`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:f}
                          </div>
                        `:jt.map(q=>q$(q,P,z))}
                </div>

                ${J$({tasks:r,taskFilter:u,taskSort:h,taskSearch:y,onToggleTaskComplete:de,onSetTaskFilter:Ke,onSetTaskSort:Y,onSetTaskSearch:te,onCreateTask:Te,workspaceNames:k,onStartTask:ke,editingTaskId:$,onEditTask:vt,onUpdateTask:J})}
              </div>
            `}
    </div>
  `}function J$(e){const{tasks:t,taskFilter:n,taskSort:s="due",taskSearch:i="",onToggleTaskComplete:a,onSetTaskFilter:o,onSetTaskSort:c,onSetTaskSearch:d,onCreateTask:p,workspaceNames:r=[],onStartTask:u,editingTaskId:h,onEditTask:y,onUpdateTask:b}=e;if(t.length===0&&!p)return l``;let $;if(n==="outstanding")$=t.filter(S=>S.status==="pending");else if(n==="today"){const S=re();$=t.filter(A=>A.status==="pending"&&A.dueDate!=null&&A.dueDate<=S)}else n==="complete"?$=t.filter(S=>S.status==="complete"):$=t;if(i){const S=i.toLowerCase();$=$.filter(A=>A.title.toLowerCase().includes(S)||A.project?.toLowerCase().includes(S))}const k=Vs($,s);return l`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${d?l`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${i}
                  @input=${S=>d(S.target.value)}
                />`:f}
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
        ${p?l`
              <form
                class="ws-task-create-form"
                @submit=${S=>{S.preventDefault();const A=S.currentTarget,P=A.querySelector(".ws-task-create-input"),R=A.querySelector(".ws-task-create-project"),x=P.value.trim();if(!x)return;const _=R?.value||r[0]||"";p(x,_),P.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${r.length>0?l`
                      <select class="ws-task-create-project">
                        ${r.map(S=>l`<option value=${S}>${S}</option>`)}
                      </select>
                    `:f}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:f}
        <div class="ws-list ws-list--scroll">
          ${k.length===0?l`<div class="ws-empty">No tasks</div>`:k.map(S=>Ia(S,a,u,h,y,b))}
        </div>
      </section>
    </div>
  `}function X$(e){return e===re()}function Z$(e){const t=new Date(e+"T12:00:00");return e0(t)}function e0(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],i=n[e.getMonth()],a=e.getDate();return`${s}, ${i} ${a}`}function t0(e){return l`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),i=s.value.trim();i&&(e(i),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function n0(e){const t=Vs(e.todayTasks??[],"due"),n=t.filter(i=>i.status==="pending"),s=t.filter(i=>i.status==="complete");return l`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${n.length} open${s.length>0?l`, ${s.length} done`:f}
        </span>
      </div>
      <div class="my-day-card-content">
        ${e.todayTasksLoading?l`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:l`
              ${e.onCreateTask?t0(e.onCreateTask):f}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?l`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(i=>Ia(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${s.length>0?l`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?l`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(i=>Ia(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:f}
                  `:f}
            `}
      </div>
    </div>
  `}function s0(e){const t=re(),n=e.selectedDate??t,s=X$(n),i=Z$(n),a=e.viewMode??"brief";return l`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?l`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:f}
        <span class="today-date-label ${s?"":"past-date"}">${i}</span>
        ${e.onDateNext?l`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:f}
        ${!s&&e.onDateToday?l`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:f}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${a==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${a==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${a==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?l`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:f}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?l`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:f:e.onEveningCapture?l`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:f}
        ${e.onRefresh?l`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function i0(e){return l`
    <div class="my-day-brief-full">
      ${B$({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,sortOrder:e.inboxSortOrder??"newest",scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onViewProof:t=>e.onInboxViewProof?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,n,s)=>e.onInboxScore?.(t,n,s),onSetScoring:(t,n)=>e.onInboxSetScoring?.(t,n),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onSortToggle:()=>e.onInboxSortToggle?.(),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function a0(e){const t=re();e.selectedDate;const n=e.viewMode??"brief";if(e.loading)return l`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(e.error)return l`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${e.error}</span>
          ${e.onRefresh?l`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const s={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onGenerate:e.onBriefGenerate,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onToggleCheckbox:e.onBriefToggleCheckbox,onOpenFile:e.onOpenFile};return l`
    <div class="my-day-container">
      ${n==="brief"?l`<div class="my-day-brief-full">
            ${D$(s)}
          </div>`:n==="tasks"?l`<div class="my-day-brief-full">${n0(e)}</div>`:i0(e)}
    </div>
  `}function o0(e){const t=p0(e),n=y0(e);return l`
    ${w0(n)}
    ${b0(t)}
    ${r0(e)}
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
        ${e.nodes.length===0?l`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>R0(s))}
      </div>
    </section>
  `}function r0(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return l`
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
      ${e.devicesError?l`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:f}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?l`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>l0(i,e))}
            `:f}
        ${s.length>0?l`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>c0(i,e))}
            `:f}
        ${n.length===0&&s.length===0?l`
                <div class="muted">No paired devices.</div>
              `:f}
      </div>
    </section>
  `}function l0(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?B(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return l`
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
  `}function c0(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${oa(e.roles)}`,a=`scopes: ${oa(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${a}</div>
        ${o.length===0?l`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:l`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(c=>d0(e.deviceId,c,t))}
              </div>
            `}
      </div>
    </div>
  `}function d0(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${oa(t.scopes)}`,a=B(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return l`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?f:l`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const ut="__defaults__",Gl=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],u0=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function p0(e){const t=e.configForm,n=_0(e.nodes),{defaultBinding:s,agents:i}=E0(t),a=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function Ql(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function h0(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function f0(e){const t=e?.defaults??{};return{security:Ql(t.security),ask:h0(t.ask),askFallback:Ql(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function g0(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const a=i,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const c=typeof a.name=="string"?a.name.trim():void 0,d=a.default===!0;s.push({id:o,name:c||void 0,isDefault:d})}),s}function m0(e,t){const n=g0(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const a=Array.from(i.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,c)=>{if(o.isDefault&&!c.isDefault)return-1;if(!o.isDefault&&c.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,p=c.name?.trim()?c.name:c.id;return d.localeCompare(p)}),a}function v0(e,t){return e===ut?ut:e&&t.some(n=>n.id===e)?e:ut}function y0(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=f0(t),i=m0(e.configForm,t),a=C0(e.nodes),o=e.execApprovalsTarget;let c=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&c&&!a.some(u=>u.id===c)&&(c=null);const d=v0(e.execApprovalsSelectedAgent,i),p=d!==ut?(t?.agents??{})[d]??null:null,r=Array.isArray(p?.allowlist)?p.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:d,selectedAgent:p,agents:i,allowlist:r,target:o,targetNodeId:c,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function b0(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return l`
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

      ${e.formMode==="raw"?l`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:f}

      ${e.ready?l`
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
                      ${e.nodes.map(s=>l`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?f:l`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?l`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>T0(s,e))}
            </div>
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function w0(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return l`
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

      ${k0(e)}

      ${t?l`
            ${$0(e)}
            ${S0(e)}
            ${e.selectedScope===ut?f:x0(e)}
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function k0(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return l`
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
          ${e.target==="node"?l`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const a=s.target.value.trim();e.onSelectTarget("node",a||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>l`<option
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
      ${e.target==="node"&&!t?l`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:f}
    </div>
  `}function $0(e){return l`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===ut?"active":""}"
          @click=${()=>e.onSelectScope(ut)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return l`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function S0(e){const t=e.selectedScope===ut,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],a=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,c=typeof s.askFallback=="string"?s.askFallback:void 0,d=t?n.security:a??"__default__",p=t?n.ask:o??"__default__",r=t?n.askFallback:c??"__default__",u=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,h=u??n.autoAllowSkills,y=u==null;return l`
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
              ${t?f:l`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Gl.map(b=>l`<option
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
              ${t?f:l`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${u0.map(b=>l`<option
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
              ${t?f:l`<option value="__default__" ?selected=${r==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Gl.map(b=>l`<option
                    value=${b.value}
                    ?selected=${r===b.value}
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
            ${t?"Allow skill executables listed by the Gateway.":y?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${h?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${h}
              @change=${b=>{const $=b.target;e.onPatch([...i,"autoAllowSkills"],$.checked)}}
            />
          </label>
          ${!t&&!y?l`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:f}
        </div>
      </div>
    </div>
  `}function x0(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return l`
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
      ${n.length===0?l`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,i)=>A0(e,s,i))}
    </div>
  `}function A0(e,t,n){const s=t.lastUsedAt?B(t.lastUsedAt):"never",i=t.lastUsedCommand?Yn(t.lastUsedCommand,120):null,a=t.lastResolvedPath?Yn(t.lastResolvedPath,120):null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?l`<div class="list-sub mono">${i}</div>`:f}
        ${a?l`<div class="list-sub mono">${a}</div>`:f}
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
  `}function T0(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return l`
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
            ${t.nodes.map(a=>l`<option
                  value=${a.id}
                  ?selected=${n===a.id}
                >
                  ${a.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function _0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.run"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function C0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.execApprovals.get"||String(c)==="system.execApprovals.set"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function E0(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const c=[];return o.forEach((d,p)=>{if(!d||typeof d!="object")return;const r=d,u=typeof r.id=="string"?r.id.trim():"";if(!u)return;const h=typeof r.name=="string"?r.name.trim():void 0,y=r.default===!0,$=(r.tools??{}).exec??{},k=typeof $.node=="string"&&$.node.trim()?$.node.trim():null;c.push({id:u,name:h||void 0,index:p,isDefault:y,binding:k})}),c.length===0&&c.push(t),{defaultBinding:i,agents:c}}function R0(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return l`
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
          ${i.slice(0,12).map(o=>l`<span class="chip">${String(o)}</span>`)}
          ${a.slice(0,8).map(o=>l`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}const P0=["","off","minimal","low","medium","high"],L0=["","off","on"],I0=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],D0=["","off","on","stream"];function M0(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function Yu(e){return M0(e)==="zai"}function O0(e){return Yu(e)?L0:P0}function F0(e,t){return!t||!e||e==="off"?e:"on"}function N0(e,t){return e?t&&e==="on"?"low":e:null}function B0(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function U0(){return l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function z0(){return l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function K0(e){return l`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function W0(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(a=>a.sessionKey)),s=t.filter(a=>!n.has(a.key)),i=e.archivedSessions.length;return l`
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

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:f}

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
        ${s.length===0?l`
                <div class="muted">No active sessions found.</div>
              `:s.map(a=>j0(a,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${q0(e,i)}
  `}function q0(e,t){return t===0&&!e.archivedSessionsLoading?f:l`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${K0(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?l`<span class="archived-badge">${t}</span>`:f}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${e.archivedSessionsExpanded?l`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${e.archivedSessionsLoading?l`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?l`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>H0(n,e.onUnarchive,e.loading))}
              </div>
            `:f}
    </section>
  `}function j0(e,t,n,s,i,a){const o=e.updatedAt?B(e.updatedAt):"n/a",c=e.thinkingLevel??"",d=Yu(e.modelProvider),p=F0(c,d),r=O0(e.modelProvider),u=e.verboseLevel??"",h=e.reasoningLevel??"",y=e.displayName??e.key,b=e.kind!=="global",$=b?`${Ka("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return l`
    <div class="table-row">
      <div class="mono">${b?l`<a href=${$} class="session-link">${y}</a>`:y}</div>
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
      <div>${i$(e)}</div>
      <div>
        <select
          .value=${p}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{thinkingLevel:N0(S,d)})}}
        >
          ${r.map(k=>l`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${u}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{verboseLevel:S||null})}}
        >
          ${I0.map(k=>l`<option value=${k.value}>${k.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${h}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{reasoningLevel:S||null})}}
        >
          ${D0.map(k=>l`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${a}
          @click=${()=>i(e.key)}
          title="Archive this session"
        >
          ${U0()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${a} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function H0(e,t,n){const s=B(Date.parse(e.archivedAt));return l`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${B0(e.reason)}</div>
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
          ${z0()}
        </button>
      </div>
    </div>
  `}function V0(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return l`
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
        ${n?l`<button class="btn" ?disabled=${e.loading||e.godmodeSkillsLoading} @click=${e.onRefresh}>
              ${e.loading||e.godmodeSkillsLoading?"Loading…":"Refresh"}
            </button>`:f}
      </div>

      ${t?G0(e):f}
      ${e.subTab==="my-skills"?J0(e):f}
    </section>
  `}function G0(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return l`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return l`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const i=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],a=s?i.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):i;return l`
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

    ${a.length===0?l`<div class="muted" style="margin-top: 16px;">No matches.</div>`:l`<div class="list" style="margin-top: 16px;">
          ${a.map(o=>o._kind==="skill"?Q0(o,e.expandedSkills.has(o.slug),e.onToggleExpand):Y0(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function Q0(e,t,n){const s=e.body.split(`
`).find(a=>a.trim().length>0)??"",i=!!e.schedule;return l`
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
          ${i?l`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`:l`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${Yn(s,120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${e.trigger}</span>
          ${e.schedule?l`<span class="chip">${e.schedule}</span>`:f}
          ${e.persona?l`<span class="chip">${e.persona}</span>`:f}
          <span class="chip">${e.taskType}</span>
        </div>
        ${t?l`
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
                  ${e.persona?l`
                        <span class="muted">Persona:</span>
                        <span>${e.persona}</span>
                      `:f}
                  ${e.schedule?l`
                        <span class="muted">Schedule:</span>
                        <span>${e.schedule}</span>
                      `:f}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:f}
      </div>
    </div>
  `}function Y0(e,t,n){return l`
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
          ${e.tools.length>0?l`<span class="chip">${e.tools.length} tools</span>`:f}
        </div>
        ${t?l`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Keywords:</span>
                  <span>${e.triggers.join(", ")}</span>
                  ${e.tools.length>0?l`
                        <span class="muted">Tools:</span>
                        <span>${e.tools.join(", ")}</span>
                      `:f}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:f}
      </div>
    </div>
  `}function J0(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return l`
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

    ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:f}

    ${s.length===0?l`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:l`<div class="list" style="margin-top: 16px;">
            ${s.map(i=>X0(i,e))}
          </div>`}
  `}function X0(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],c=[];return e.disabled&&c.push("disabled"),e.blockedByAllowlist&&c.push("blocked by allowlist"),l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Yn(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?l`
                  <span class="chip chip-warn">disabled</span>
                `:f}
        </div>
        ${o.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:f}
        ${c.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${c.join(", ")}
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
          ${a?l`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:f}
        </div>
        ${i?l`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:f}
        ${e.primaryEnv?l`
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
            `:f}
      </div>
    </div>
  `}function Z0(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function eS(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(a=>[a.slug,a.name,a.category,a.mission??"",...a.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const a of n){const o=a.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(a)}const i=[...s.keys()].sort((a,o)=>a==="_default"?1:o==="_default"?-1:a.localeCompare(o));return l`
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

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:f}

      ${e.loading&&e.roster.length===0?l`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:f}

      ${!e.loading&&n.length===0?l`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:f}

      ${i.map(a=>{const o=s.get(a),c=a==="_default"?"General":Ju(a);return l`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${c}
            </div>
            <div class="list">
              ${o.map(d=>tS(d,e.expandedAgents.has(d.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function Ju(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function tS(e,t,n){return l`
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
          ${e.engine?l`<span class="chip ${Z0(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:f}
        </div>
        ${e.mission?l`<div class="list-sub" style="margin-left: 18px;">${Yn(e.mission,120)}</div>`:f}
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          ${e.taskTypes.map(s=>l`<span class="chip">${s}</span>`)}
        </div>
        ${t?l`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px;">
                  <span class="muted">Slug:</span>
                  <span style="font-family: monospace;">${e.slug}</span>
                  <span class="muted">Category:</span>
                  <span>${Ju(e.category||"_default")}</span>
                  ${e.engine?l`
                        <span class="muted">Engine:</span>
                        <span>${e.engine}</span>
                      `:f}
                  <span class="muted">Task types:</span>
                  <span>${e.taskTypes.join(", ")||"auto"}</span>
                </div>
                ${e.body?l`
                      <div
                        style="font-size: 13px; line-height: 1.6;
                               white-space: pre-wrap; color: var(--text-color, #333);
                               max-height: 400px; overflow-y: auto;
                               padding-top: 10px; border-top: 1px solid var(--border-color, #eee);"
                      >
                        ${e.body}
                      </div>
                    `:f}
              </div>
            `:f}
      </div>
    </div>
  `}function Xu(){return{open:!1,images:[],currentIndex:0}}function nS(e,t,n){return{open:!0,images:t,currentIndex:n}}function sS(){return Xu()}function iS(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const aS=l`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,oS=l`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,rS=l`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function lS(e,t){if(!e.open||e.images.length===0)return f;const n=e.images[e.currentIndex];if(!n)return f;const s=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return l`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&a&&t.onNav(1),o.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${aS}
      </button>

      ${s&&i?l`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${oS}</button>`:f}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&a?l`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${rS}</button>`:f}

      ${s?l`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:f}
    </div>
  `}const cS=e=>{switch(e){case"success":return l`
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
      `;case"error":return l`
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
      `;case"warning":return l`
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
      `;default:return l`
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
      `}};function dS({toasts:e,onDismiss:t}){return e.length===0?null:l`
    <div class="toast-container">
      ${hi(e,n=>n.id,n=>l`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${cS(n.type)}</div>
            <div class="toast__body">
              <div class="toast__message">${n.message}</div>
              ${n.action?l`${n.action.url?l`<a
                        class="toast__action"
                        href=${n.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >${n.action.label} &rarr;</a>`:l`<button
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
  `}const Yl=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function uS(e,t){return l`
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
  `}function pS(e,t,n){const i=!!(t?.[e.key]??e.default);return l`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${uS(i,()=>n(e.key,!i))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function hS(e){const{connected:t,loading:n,options:s,onToggle:i,onOpenWizard:a}=e;return t?n&&!s?l`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:l`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${Yl.map(o=>pS(o,s,i))}
      </div>
      ${Yl.length===0?l`<div class="options-empty">
            No configurable features yet.
          </div>`:f}
      ${a?l`
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
          `:f}
    </section>
  `:l`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const Jl=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],fS=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],gS=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],sa=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],Xl=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function Zl(e){const n=Math.min(Number(e),8);return l`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,i)=>l`
          <div class="wizard-progress-dot ${i<n?"completed":""} ${i===n?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${n<8?`Step ${n+1} of 8`:"Review"}
      </div>
    </div>
  `}function mS(e){if(e>=Xl.length)return l`${f}`;const t=Xl[e];return l`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function vS(e,t,n,s){return l`
    <div class="wizard-nav">
      ${e>0?l`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${()=>t.onStepChange(e-1)}
            >Back</button>
          `:l`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${n?"":"wizard-btn--disabled"}"
        ?disabled=${!n}
        @click=${()=>{s?(t.onStepChange(8),t.onPreview()):t.onStepChange(e+1)}}
      >${s?"Review":"Continue"}</button>
    </div>
  `}function Zu(){return l`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function yS(e,t){function n(i){const a=i.target.value;t.onAnswerChange("name",a)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(1))}return l`
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
  `}function bS(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return l`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${Jl.includes(n)?f:l`<option value="${n}">${n} (detected)</option>`}
        ${Jl.map(s=>l`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${Zu()}
    </div>
  `}function wS(e,t){function n(i){t.onAnswerChange("focus",i.target.value)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(3))}return l`
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
  `}function kS(e,t){function n(){const a=document.querySelector(".wizard-project-input");if(!a)return;const o=a.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),a.value="",a.focus())}function s(a){const o=e.projects.filter((c,d)=>d!==a);t.onAnswerChange("projects",o)}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return l`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((a,o)=>l`
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
      ${e.projects.length===0?l`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:f}
    </div>
  `}function $S(e,t){return l`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${fS.map(n=>l`
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
  `}function SS(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(c=>c!==o)):t.onAnswerChange("hardRules",[...n,o])}function i(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const c=o.value.trim();c&&(t.onAnswerChange("hardRules",[...n,c]),o.value="",o.focus())}function a(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&i())}return l`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${sa.map(o=>l`
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
      ${n.filter(o=>!sa.includes(o)).length>0?l`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!sa.includes(o)).map(o=>l`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(c=>c!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:f}
    </div>
  `}function xS(e,t){function n(){const a=document.querySelector(".wizard-person-input");if(!a)return;const o=a.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),a.value="",a.focus())}function s(a){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,c)=>c!==a))}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return l`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((a,o)=>l`
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
  `}function AS(e,t){return l`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${gS.map(n=>l`
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
      ${Zu()}
    </div>
  `}function ia(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function TS(e,t){const{answers:n,preview:s,diff:i,fileSelections:a,configSelections:o,generating:c}=e,d=s?.some(r=>r.exists)??!1,p=i&&(i.changes.length>0||i.additions.length>0);return l`
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

        ${n.projects.length>0?l`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${n.projects.map(r=>l`<div class="wizard-review-item">${r}</div>`)}
              </div>
            `:f}

        ${n.keyPeople.length>0?l`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(r=>l`<div class="wizard-review-item">${r}</div>`)}
              </div>
            `:f}

        ${n.hardRules.length>0?l`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(r=>l`<div class="wizard-review-item">${r}</div>`)}
              </div>
            `:f}
      </div>

      ${s&&s.length>0?l`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${d?l`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:f}
              <div class="wizard-file-list">
                ${s.map(r=>{const u=a[r.path]??r.wouldCreate;return l`
                    <label class="wizard-file-item ${r.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${u}
                        @change=${h=>t.onFileToggle(r.path,h.target.checked)}
                      />
                      <span class="wizard-file-path">${r.path}</span>
                      <span class="wizard-file-status">${r.exists?u?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:f}

      ${p?l`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${i.additions.length>0?l`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${i.additions.map(r=>{const u=o[r.path]??!0;return l`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${u}
                              @change=${h=>t.onConfigToggle(r.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${r.path}</span>
                            <span class="wizard-config-value">${ia(r.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:f}

              ${i.changes.length>0?l`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${i.changes.map(r=>{const u=o[r.path]??!1;return l`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${u}
                              @change=${h=>t.onConfigToggle(r.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${r.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${ia(r.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${ia(r.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:f}

              ${i.matching.length>0?l`<p class="wizard-hint">${i.matching.length} settings already match GodMode's recommendations.</p>`:f}
            </div>
          `:l`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

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

      ${e.error?l`<div class="wizard-error">${e.error}</div>`:f}
    </div>
  `}function _S(e,t){const n=e.result;return n?l`
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
  `:l`${f}`}function ep(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function CS(){return{step:0,answers:ep(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function tp(e,t){const{step:n,answers:s}=e;if(n===9)return l`
      <div class="wizard-fullscreen">
        ${_S(e,t)}
      </div>
    `;if(n===8)return l`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${Zl(n)}
          ${TS(e,t)}
        </div>
      </div>
    `;const i=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),a=n===7,o=(()=>{switch(n){case 0:return yS(s,t);case 1:return bS(s,t);case 2:return wS(s,t);case 3:return kS(s,t);case 4:return $S(s,t);case 5:return SS(s,t);case 6:return xS(s,t);case 7:return AS(s,t);default:return l`${f}`}})();return l`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${Zl(n)}
        ${mS(n)}
        ${o}
        ${vS(n,t,i,a)}
      </div>
    </div>
  `}const ES=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:ep,emptyWizardState:CS,renderOnboardingWizard:tp},Symbol.toStringTag,{value:"Module"}));function fn(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function ls(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function RS(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function PS(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function LS(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function IS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function DS(e){const t=e.overallScore,n=fn(t);return l`
    <div class="trust-overall">
      <div class="trust-overall-score ${ls(n)}">
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
  `}function MS(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),i=fn(e??(t>0?t:null));return l`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${ls(i)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function OS(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",i=fn(e.trustScore??(e.avgRating>0?e.avgRating:null)),a=e.count<10?10-e.count:0;return l`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?l`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:f}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${ls(i)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${PS(e.trend)}">
          ${LS(e.trend)} ${RS(e.trend)}
        </span>
      </div>

      ${MS(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${a>0?l`<span class="trust-card-pending">${a} more until trust score</span>`:f}
        ${e.needsFeedback?l`<span class="trust-card-needs-feedback">Needs improvement</span>`:f}
      </div>

      ${e.recentFeedback.length>0?l`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>l`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:f}
    </div>
  `}function FS(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function NS(){const e=FS();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function BS(e){const t=fn(e.rating);return l`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${ls(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?l`<span class="trust-rating-note">${e.note}</span>`:f}
      <span class="trust-rating-time">${IS(e.timestamp)}</span>
    </div>
  `}function US(){return l`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function zS(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,i=e.data?.todayRating??null,a=e.updateStatus??null,o=a?.openclawUpdateAvailable||a?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const d=[];return a.openclawUpdateAvailable&&a.openclawLatest&&d.push(`OpenClaw ${a.openclawVersion} → ${a.openclawLatest}`),a.pluginUpdateAvailable&&a.pluginLatest&&d.push(`GodMode ${a.pluginVersion} → ${a.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:d.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const d=n.gates.filter(r=>r.enabled).length,p=n.gates.length;if(d<p)return{level:"warn",icon:"🛡",text:`${p-d} security gate${p-d!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const c=a&&!o?" Up to date.":"";return i?i.rating>=8?{level:"ok",icon:"✨",text:`Rated ${i.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${c}`}:i.rating>=5?{level:"ok",icon:"💪",text:`Rated ${i.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${c}`}:{level:"warn",icon:"💬",text:`Rated ${i.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${c}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${c} Rate your day below to help improve.`}}function KS(e){const{level:t,icon:n,text:s,detail:i}=zS(e);return l`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${i}</div>
      </div>
    </div>
  `}function WS(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function ec(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return l`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return l`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),i=fn(n.rating);return l`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${i==="none"?"medium":i}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function qS(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],i=t?.dailyStreak??0,a=t?.dailyAverage??null;if(!e.onDailyRate)return f;if(n){const o=fn(n.rating),c=n.rating<7&&!n.note;return l`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${i>1?l`<span class="trust-daily-streak">${i} day streak</span>`:f}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${ls(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?l`<span class="trust-daily-result-note">"${n.note}"</span>`:f}
            ${a!==null?l`<span class="trust-daily-result-note">7-day avg: ${a}/10</span>`:f}
          </div>
          ${s.length>1?ec(s):f}
        </div>
        ${c?l`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${d=>{if(d.key==="Enter"){const p=d.target,r=p.value.trim();r&&e.onDailyRate&&(e.onDailyRate(n.rating,r),p.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${d=>{const r=d.target.previousElementSibling,u=r?.value?.trim();u&&e.onDailyRate&&(e.onDailyRate(n.rating,u),r.value="")}}
                >Send</button>
              </div>
            `:f}
      </div>
    `}return l`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${i>0?l`<span class="trust-daily-streak">${i} day streak</span>`:f}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>l`
            <button
              class="trust-daily-button ${WS(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?l`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${ec(s)}
              ${a!==null?l`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${a}/10</span>`:f}
            </div>
          `:f}
    </div>
  `}function jS(e){if(!e)return l`
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
    `;const t=e.gates,n=t.filter(r=>r.enabled).length,s=t.length,i=n===s,a=Date.now()-864e5,o=e.activity.filter(r=>Date.parse(r.timestamp)>a),c=o.filter(r=>r.action==="blocked").length,d=o.filter(r=>r.action==="fired").length,p=i?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return l`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${p}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(r=>l`
            <div class="trust-health-gate ${r.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${r.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${r.icon}</span>
              <span class="trust-health-gate-name">${r.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?l`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${c>0?l` &middot; <span class="trust-health-activity-count">${c}</span> blocked`:f}
              ${d>0?l` &middot; <span class="trust-health-activity-count">${d}</span> fired`:f}
            </div>
          `:l`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function HS(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function VS(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function GS(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,i=e.gatewayUptimeMs,c=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return l`
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
        <span class="trust-health-dot ${VS(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${HS(n)}</span>
      </div>

      ${s!=null?l`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:f}

      ${i!=null?l`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${_c(i)}</span>
            </div>
          `:f}
    </div>
  `}function QS(e){return l`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${jS(e.guardrailsData)}
        ${GS(e)}
      </div>
    </div>
  `}function YS(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:i,onRefresh:a}=e;if(!t)return l`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return l`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const c=!(s?.summaries??[]).some(u=>u.count>0),d=c?NS():s,p=d.summaries,r=c?[]:s?.ratings??[];return l`
    <section class="tab-body trust-section">
      ${KS(e)}

      ${c?US():f}

      ${qS(e)}

      ${DS(d)}

      <div class="trust-workflows-grid">
        ${p.map(u=>OS(u,c?null:i))}
      </div>

      ${QS(e)}

      ${r.length>0?l`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${r.slice(0,20).map(BS)}
              </div>
            </div>
          `:f}
    </section>
  `}function JS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function XS(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function np(e,t){return l`
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
  `}function ZS(e,t,n,s){const i=e.thresholds?.[t]??0;return l`
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
  `}function e1(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return l`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${np(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?l`
            <div class="guardrails-thresholds">
              ${s.map(i=>ZS(e,i,e.thresholdLabels[i],n))}
            </div>
          `:f}
    </div>
  `}function t1(e,t,n){const s=e.action==="redirect"?"↪":"🚫",i=e.action==="redirect"?"redirect":"block";return l`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${i}">${i}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${np(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(a=>l`<span class="guardrails-pattern-tag">${a}</span>`)}
      </div>
    </div>
  `}function n1(e){return l`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${XS(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${JS(e.timestamp)}</span>
    </div>
  `}function s1(e){const{connected:t,loading:n,data:s,onToggle:i,onThresholdChange:a,onCustomToggle:o,onCustomDelete:c,onToggleAddForm:d,onOpenAllyChat:p}=e;if(!t)return l`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return l`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const r=s?.gates??[],u=s?.activity??[],h=s?.custom??[],y=r.filter(k=>k.enabled).length,b=h.filter(k=>k.enabled).length,$=[`${y}/${r.length} gates active`];return h.length>0&&$.push(`${b} custom rule${h.length===1?"":"s"}`),l`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${y}/${r.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${r.map(k=>e1(k,i,a))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${h.length>0?` (${b} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{p?p("Create a new guardrail rule: "):d()}}>+ Add Rule</button>
            </div>

            ${h.length>0?l`
                  <div class="guardrails-custom-grid">
                    ${h.map(k=>t1(k,o,c))}
                  </div>
                `:l`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${u.length>0?l`
                  <div class="guardrails-history-list">
                    ${u.slice(0,30).map(n1)}
                  </div>
                `:l`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}function et(e){if(!e)return"";try{return B(new Date(e).getTime())}catch{return""}}function hn(e){return l`<div class="second-brain-md-body">${Le(we(e))}</div>`}function i1(e){const{identity:t}=e;return!t||t.files.length===0?l`
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
    `:l`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>
      ${t.identityOs?l`
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
      `:f}

      ${t.files.map(n=>l`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.label}</span>
            ${n.updatedAt?l`<span class="second-brain-card-updated">${et(n.updatedAt)}</span>`:f}
          </div>
          <div class="second-brain-card-content">${hn(n.content)}</div>
        </div>
      `)}

      ${t.identityOs&&t.identityOs.artifacts.length>0?l`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">Identity OS Artifacts</span>
            <span class="second-brain-section-count">${t.identityOs.artifacts.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.identityOs.artifacts.map(n=>Es(n,e))}
          </div>
        </div>
      `:f}
    </div>
  `}function a1(e){const{memoryBank:t,selectedEntry:n,searchQuery:s,browsingFolder:i,folderEntries:a,folderName:o}=e;if(n)return l`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?l`<span class="second-brain-card-updated">${et(n.updatedAt)}</span>`:f}
          </div>
          ${n.relativePath?l`<div class="second-brain-card-path">${n.relativePath}</div>`:f}
          <div class="second-brain-card-content">${hn(n.content)}</div>
        </div>
      </div>
    `;if(i&&a)return l`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${o??"Folder"}</span>
            <span class="second-brain-section-count">${a.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${a.length>0?a.map(p=>Es(p,e)):l`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!t)return mi("No memory bank files found","Start building your memory bank by telling your ally about the people, companies, and projects in your life.");const c=(s??"").toLowerCase().trim(),d=p=>c?p.filter(r=>r.name.toLowerCase().includes(c)||r.excerpt.toLowerCase().includes(c)):p;return l`
    <div class="second-brain-panel">
      <div class="second-brain-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search people, companies, projects..."
          .value=${s??""}
          @input=${p=>e.onSearch(p.target.value)}
        />
        <span class="second-brain-search-count">${t.totalEntries} entries</span>
      </div>

      ${t.sections.map(p=>{const r=d(p.entries);return p.entries.length===0?f:l`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">${p.icon} ${p.label}</span>
              <span class="second-brain-section-count">${p.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${r.length>0?r.map(u=>Es(u,e)):c?l`<div class="second-brain-empty-inline">No matches</div>`:f}
            </div>
          </div>
        `})}

      ${t.extraFiles.length>0?l`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
            <span class="second-brain-section-count">${t.extraFiles.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.extraFiles.map(p=>Es(p,e))}
          </div>
        </div>
      `:f}

      ${t.curated?l`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
            <span class="second-brain-section-count">${et(t.curated.updatedAt)}</span>
          </div>
          <div class="second-brain-card">
            <div class="second-brain-card-content">${hn(t.curated.content)}</div>
          </div>
        </div>
      `:f}
    </div>
  `}function Es(e,t){const n=e.isDirectory;return l`
    <div class="second-brain-entry" @click=${()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${n?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${n?"/":""}</div>
        ${e.excerpt?l`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:f}
      </div>
      ${e.updatedAt?l`<div class="second-brain-entry-meta">${et(e.updatedAt)}</div>`:f}
    </div>
  `}function o1(e){const{aiPacket:t,syncing:n}=e,s=t?.snapshot??t?.consciousness??null,i=t?.snapshot?"Awareness Snapshot":"CONSCIOUSNESS.md";return l`
    <div class="second-brain-panel">
      <div class="second-brain-sync-bar">
        <div class="second-brain-sync-info">
          <span class="second-brain-sync-label">Live Context Injection</span>
          <span class="second-brain-sync-time">
            ${s?.updatedAt?`Last synced ${et(s.updatedAt)}`:"Not yet synced"}
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

      ${s?l`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${i}</span>
            <span class="second-brain-card-updated">${s.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${hn(s.content)}</div>
        </div>
      `:l`
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F9E0}</div>
          <div class="second-brain-empty-title">No awareness snapshot yet</div>
          <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
        </div>
      `}

      ${t?.working?l`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">WORKING.md</span>
            <span class="second-brain-card-updated">${t.working.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${hn(t.working.content)}</div>
        </div>
      `:f}
    </div>
  `}const tc={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function r1(e){const{sourcesData:t}=e;if(!t||t.sources.length===0)return mi("No sources detected","Connect data sources to build your context universe.");const n=t.sources.filter(i=>i.status==="connected"),s=t.sources.filter(i=>i.status==="available");return l`
    <div class="second-brain-panel">
      <div class="second-brain-sources-summary">
        <span class="second-brain-sources-count">${t.connectedCount}</span>
        <span class="second-brain-sources-label">sources connected</span>
        <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add a Source</button>
      </div>

      ${n.length>0?l`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E2} Connected</span>
            <span class="second-brain-section-count">${n.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${n.map(i=>nc(i))}
          </div>
        </div>
      `:f}

      ${s.length>0?l`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E1} Available</span>
            <span class="second-brain-section-count">${s.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${s.map(i=>nc(i))}
          </div>
        </div>
      `:f}
    </div>
  `}function nc(e){const t=tc[e.status]??tc.available;return l`
    <div class="second-brain-source-card ${t.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?l`<div class="second-brain-source-stats">${e.stats}</div>`:f}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${t.dot}</span>
        <span class="second-brain-source-status-label">${t.label}</span>
        ${e.status==="connected"&&e.lastSync?l`<span class="second-brain-source-sync">${et(e.lastSync)}</span>`:f}
      </div>
    </div>
  `}function sc(e,t){const n=e.isDirectory,s=n?"📁":"📑",i=()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)},a=e.frontmatter?.title||e.name;return l`
    <div class="second-brain-entry" @click=${i}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${s}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${a}${n?"/":""}</div>
        ${e.frontmatter?.url?l`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:f}
        ${e.excerpt&&!n?l`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:f}
        ${e.frontmatter?.tags?.length?l`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(o=>l`<span class="second-brain-research-tag">${o}</span>`)}
          </div>
        `:f}
      </div>
      ${e.updatedAt?l`<div class="second-brain-entry-meta">${et(e.updatedAt)}</div>`:f}
    </div>
  `}function l1(e){const{researchData:t,selectedEntry:n,searchQuery:s,browsingFolder:i,folderEntries:a,folderName:o}=e;if(n)return l`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?l`<span class="second-brain-card-updated">${et(n.updatedAt)}</span>`:f}
          </div>
          ${n.relativePath?l`<div class="second-brain-card-path">${n.relativePath}</div>`:f}
          <div class="second-brain-card-content">${hn(n.content)}</div>
        </div>
      </div>
    `;if(i&&a)return l`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${o??"Category"}</span>
            <span class="second-brain-section-count">${a.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${a.length>0?a.map(p=>sc(p,e)):l`<div class="second-brain-empty-inline">No research in this category</div>`}
          </div>
        </div>
      </div>
    `;if(!t||t.totalEntries===0)return l`
      <div class="second-brain-panel">
        <div class="second-brain-research-toolbar">
          <div style="flex:1"></div>
          <button class="second-brain-sync-btn" @click=${()=>e.onSaveViaChat()}>
            + Save via Chat
          </button>
        </div>
        ${mi("No research collected yet","Click 'Save via Chat' to paste links, bookmarks, or notes — your AI will organize them for you.")}
      </div>
    `;const c=(s??"").toLowerCase().trim(),d=p=>c?p.filter(r=>r.name.toLowerCase().includes(c)||r.excerpt.toLowerCase().includes(c)||(r.frontmatter?.tags??[]).some(u=>u.toLowerCase().includes(c))||(r.frontmatter?.url??"").toLowerCase().includes(c)):p;return l`
    <div class="second-brain-panel">
      <div class="second-brain-research-toolbar">
        <div class="second-brain-search" style="flex:1">
          <input
            class="second-brain-search-input"
            type="text"
            placeholder="Search research by title, tag, URL..."
            .value=${s??""}
            @input=${p=>e.onSearch(p.target.value)}
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

      ${t.categories.map(p=>{const r=d(p.entries);return p.entries.length===0?f:l`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4C1} ${p.label}</span>
              <span class="second-brain-section-count">${p.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${r.length>0?r.map(u=>sc(u,e)):c?l`<div class="second-brain-empty-inline">No matches</div>`:f}
            </div>
          </div>
        `})}
    </div>
  `}function c1(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function d1(e){return l`
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

      ${e.fileSearchResults?u1(e):e.fileTreeLoading?l`<div class="sb-files-loading">Loading file tree...</div>`:e.fileTree?sp(e.fileTree,e):l`<div class="sb-files-empty">No files found</div>`}
    </div>
  `}function u1(e){const t=e.fileSearchResults??[];return t.length===0?l`<div class="sb-files-empty">No results found</div>`:l`
    <div class="sb-files-results">
      ${t.map(n=>l`
          <button
            class="sb-files-result-item"
            @click=${()=>e.onFileSelect?.(n.path)}
          >
            <span class="sb-file-icon">${n.type==="folder"?"📁":"📄"}</span>
            <div class="sb-file-info">
              <span class="sb-file-name">${n.name}</span>
              <span class="sb-file-path">${n.path}</span>
              ${n.matchContext||n.excerpt?l`<span class="sb-file-excerpt">${n.matchContext??n.excerpt}</span>`:f}
            </div>
          </button>
        `)}
    </div>
  `}function sp(e,t,n=0){return l`
    <div class="sb-file-tree" style="padding-left: ${n*16}px">
      ${e.map(s=>s.type==="folder"?l`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${s.name}</span>
                ${s.childCount!=null?l`<span class="sb-tree-count">${s.childCount}</span>`:f}
              </summary>
              ${s.children?sp(s.children,t,n+1):f}
            </details>
          `:l`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>t.onFileSelect?.(s.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${s.name}</span>
            ${s.size!=null?l`<span class="sb-tree-size">${c1(s.size)}</span>`:f}
          </button>
        `)}
    </div>
  `}function mi(e,t){return l`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${t}</div>
    </div>
  `}function p1(e){if(!e)return f;if(!e.available)return l`
      <div class="vault-health-bar vault-health-disconnected">
        <span class="vault-health-status">\u26A0\uFE0F Vault not connected</span>
        <span class="vault-health-detail">Using local storage. Set OBSIDIAN_VAULT_PATH to connect your Obsidian vault.</span>
      </div>
    `;const t=e.stats;if(!t)return f;const n=t.lastActivity?et(t.lastActivity):"never",s=t.inboxCount>0?l`<span class="vault-health-inbox-badge">${t.inboxCount} in inbox</span>`:f;return l`
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
  `}function h1(e){let t=0;const n=[];return e.identity&&e.identity.files.length>0?t+=20:n.push("Create USER.md to help your ally know you"),e.vaultHealth?.available??!1?t+=20:n.push("Connect your Obsidian vault for long-term memory"),e.memoryBank&&e.memoryBank.totalEntries>0?t+=20:n.push("Teach your ally — chat naturally and it remembers"),e.sourcesData&&e.sourcesData.connectedCount>0?t+=20:n.push("Connect a data source (calendar, Oura, etc.)"),e.vaultHealth?.stats&&e.vaultHealth.stats.dailyCount>=7?t+=20:n.push("Keep using the morning brief — it compounds"),{score:t,tips:n}}function f1(e){const{subtab:t,loading:n,vaultHealth:s}=e,i=h1(e);return l`
    <section class="second-brain-container">
      ${p1(s)}
      ${i.score<100?l`
        <div class="sb-health-score">
          <div class="sb-health-score-bar">
            <div class="sb-health-score-fill" style="width: ${i.score}%"></div>
          </div>
          <div class="sb-health-score-info">
            <span class="sb-health-score-label">Context Health: ${i.score}%</span>
            ${i.tips.length>0?l`<span class="sb-health-score-tip">${i.tips[0]}</span>`:f}
          </div>
        </div>
      `:f}
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

      ${t==="intel"?g1(e):n?l`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:t==="identity"?i1(e):t==="memory-bank"?a1(e):t==="ai-packet"?o1(e):t==="sources"?r1(e):t==="resources"?m1(e):t==="files"?d1(e):l1(e)}
    </section>
  `}function g1(e){const t=e.vaultHealth?.available??!1,n=(e.vaultHealth?.stats?.dailyCount??0)>=3,s=(e.sourcesData?.connectedCount??0)>0;return l`
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
  `}function m1(e){const{communityResources:t,communityResourceAddFormOpen:n}=e;return l`
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

      ${n?y1(e):f}

      ${!t||t.resources.length===0?mi("No community resources yet","Add GitHub repos, awesome-lists, and tools for your AI agents to discover and reference."):l`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4E6} Bookmarked Resources</span>
              <span class="second-brain-section-count">${t.count}</span>
            </div>
            <div class="second-brain-entry-list">
              ${t.resources.map(s=>v1(s,e))}
            </div>
          </div>
        `}
    </div>
  `}function v1(e,t){return l`
    <div class="second-brain-entry">
      <div class="second-brain-entry-icon">\u{1F517}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">
          <a href=${e.url} target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
            ${e.label}
          </a>
        </div>
        ${e.description?l`<div class="second-brain-entry-excerpt">${e.description}</div>`:f}
        ${e.tags.length>0?l`<div class="second-brain-research-tags">
              ${e.tags.map(n=>l`<span class="second-brain-research-tag">${n}</span>`)}
            </div>`:f}
      </div>
      <button
        class="second-brain-back-btn"
        style="font-size: 11px; padding: 2px 8px; color: var(--danger, #ef4444);"
        @click=${n=>{n.stopPropagation(),t.onCommunityResourceRemove(e.id)}}
      >Remove</button>
    </div>
  `}function y1(e){const t=e.communityResourceAddForm??{url:"",label:"",description:"",tags:""};return l`
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
  `}const Da={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},b1=[{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Tasks, calendar, priorities, and focus score",prompt:"Create a morning overview dashboard that shows my top priorities, today's calendar events, active queue items, and readiness score. Use clean CSS grid layout."},{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"What you accomplished this week",prompt:"Create a weekly impact dashboard showing tasks completed vs created this week, agent task outcomes, trust score changes, and top 3 wins. Use CSS bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue throughput, personas, and trust scores",prompt:"Create an agent activity dashboard showing queue stats (pending, processing, completed, failed), most active personas, cron skill execution log, and trust scores by workflow."},{id:"health-energy",name:"Health & Energy",category:"personal",description:"Sleep, readiness, and activity from Oura",prompt:"Create a health and energy dashboard showing last night's sleep score, 7-day sleep trend, today's readiness score, activity level, and HRV trend. Pull from Oura integration."},{id:"goals-tracker",name:"Goals Tracker",category:"personal",description:"Active goals with progress bars",prompt:"Create a goals tracker dashboard showing my active goals as cards with progress bars, grouped by area (health, career, finance, personal), with overall completion percentage."},{id:"content-performance",name:"Content Performance",category:"business",description:"Social posts and content pipeline",prompt:"Create a content performance dashboard showing recent content pieces, content pipeline status, engagement metrics from X intelligence, and a content calendar for the next 7 days."}];function w1(e){return e==="global"?l`<span class="dashboard-card-scope">Global</span>`:l`<span class="dashboard-card-scope">${e}</span>`}function ip(e){return Date.now()-new Date(e).getTime()>1440*60*1e3}function ap(e){const t=(e.title+" "+(e.description??"")).toLowerCase();return t.includes("health")||t.includes("sleep")||t.includes("oura")||t.includes("energy")||t.includes("goal")?"personal":t.includes("agent")||t.includes("queue")||t.includes("trust")||t.includes("skill")?"system":t.includes("revenue")||t.includes("business")||t.includes("content")||t.includes("metric")?"business":t.includes("task")||t.includes("calendar")||t.includes("morning")||t.includes("impact")||t.includes("weekly")?"productivity":"custom"}function ic(e,t){const n=Da[e.category]??Da.custom;return l`
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
  `}function k1(e,t,n,s){const i=ip(e.updatedAt);return l`
    <div class="dashboard-card ${e.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>t(e.id)}
      >
        <div class="dashboard-card-title">
          ${e.pinned?l`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:f}
          ${e.title}
        </div>
        ${e.description?l`<div class="dashboard-card-desc">${e.description}</div>`:f}
        <div class="dashboard-card-meta">
          ${w1(e.scope)}
          <span>${B(new Date(e.updatedAt).getTime())}</span>
          ${i?l`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:f}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${s?l`<button
              class="dashboard-card-pin"
              title="${e.pinned?"Unpin":"Pin"}"
              @click=${a=>{a.stopPropagation(),s(e.id)}}
            >${e.pinned?"📌":"📅"}</button>`:f}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${a=>{a.stopPropagation(),confirm(`Delete "${e.title}"?`)&&n(e.id)}}
        >&times;</button>
      </div>
    </div>
  `}function $1(e){const{activeDashboardHtml:t,activeDashboardManifest:n,isWorking:s}=e;if(!t||!n)return f;const i=ip(n.updatedAt);return l`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>e.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${n.title}</span>
          <span class="dashboards-active-meta">
            ${B(new Date(n.updatedAt).getTime())}
            ${i?l` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:f}
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
          ${Le(ag(t))}
        </div>
      </div>
    </section>
  `}function S1(e,t,n){const s={all:t.length};for(const i of t){const a=ap(i);s[a]=(s[a]??0)+1}return l`
    <div class="dashboards-category-bar">
      ${Object.entries(Da).map(([i,a])=>l`
        <button
          class="dashboards-category-btn ${e===i?"active":""}"
          @click=${()=>n(i)}
        >
          ${a.icon} ${a.label}
          ${s[i]?l`<span class="category-count">${s[i]}</span>`:f}
        </button>
      `)}
    </div>
  `}function x1(e){const{loading:t,dashboards:n}=e,s=e.categoryFilter??"all",i=e.templates??b1,o=[...s==="all"?n??[]:(n??[]).filter(p=>ap(p)===s)].sort((p,r)=>p.pinned&&!r.pinned?-1:!p.pinned&&r.pinned?1:new Date(r.updatedAt).getTime()-new Date(p.updatedAt).getTime()),c=s==="all"?i:i.filter(p=>p.category===s),d=(n??[]).length>0;return l`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(n??[]).length} dashboard${(n??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>e.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${d&&e.onCategoryFilter?S1(s,n??[],e.onCategoryFilter):f}

      ${t?l`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:o.length===0&&!d?l`
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
                  ${i.map(p=>ic(p,e.onCreateViaChat))}
                </div>
              </div>
            `:l`
              <div class="dashboards-grid">
                ${o.map(p=>k1(p,e.onSelectDashboard,e.onDeleteDashboard,e.onTogglePin))}
              </div>
              ${c.length>0?l`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${c.map(p=>ic(p,e.onCreateViaChat))}
                  </div>
                </div>
              `:f}
            `}
    </section>
  `}function A1(e){return e.error?l`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${e.error}</p>
          <button class="retry-button" @click=${()=>e.onRefresh()}>Retry</button>
        </div>
      </section>
    `:e.activeDashboardHtml&&e.activeDashboardManifest?$1(e):x1(e)}const T1=/^data:/i,_1=/^https?:\/\//i;function C1(e){const t=e.agentsList?.agents??[],s=Sc(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(c=>c.id===s)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return T1.test(o)||_1.test(o)?o:a?.avatarUrl}function E1(e,t){const n=e.dynamicSlots[t];return n?l`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${Le(Hc(n))}</div>
    </div>
  `:f}function ac(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const c=n.length/2,d=n.slice(0,c).join(" "),p=n.slice(c).join(" ");if(d.toLowerCase()===p.toLowerCase())return d}const s=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(s.length/2),a=s.slice(0,i).trim(),o=s.slice(i).trim();return a&&a===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Ma(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function oc(e){if(e===Q)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function R1(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(c=>c.trim()).filter(Boolean))].filter(c=>!oc(c)),s=Lt(t,e.sessionKey),i=Ma(e.sessionKey,s),a=new Map;for(const c of n){const d=Lt(t,c),p=Ma(c,d);if(!a.has(p)){a.set(p,c);continue}c===e.sessionKey&&a.set(p,c)}const o=[...a.values()];if(o.length===0){const c=e.sessionKey.trim()||"main";oc(c)||o.push(c)}return{tabKeys:o,activeIdentity:i}}function P1(e){if(e.wizardActive&&e.wizardState)return tp(e.wizardState,{onStepChange:r=>{e.handleWizardStepChange?.(r)},onAnswerChange:(r,u)=>{e.handleWizardAnswerChange?.(r,u)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(r,u)=>{e.handleWizardFileToggle?.(r,u)},onConfigToggle:(r,u)=>{e.handleWizardConfigToggle?.(r,u)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const n=e.connected?null:"Disconnected from gateway.",s=e.tab==="chat",i=s&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,o=C1(e),c=e.chatAvatarUrl??o??null,{tabKeys:d,activeIdentity:p}=R1(e);return l`
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
          ${f}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?l`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${r=>{r.preventDefault(),e.setTab("config")}}
                >
                  <span class="pill__icon">${H.zap}</span>
                  <span>Update Ready</span>
                </a>`:f}
          ${e.updateStatus?.pendingDeploy?l`<button
                  class="pill pill--deploy"
                  @click=${r=>{r.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${H.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:f}
          <button
            class="pill pill--support"
            @click=${r=>{r.preventDefault(),e.handleOpenSupportChat()}}
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
          ${Tu(e)}
        </div>
      </header>
      ${e.deployPanelOpen&&e.updateStatus?.pendingDeploy?(()=>{const r=e.updateStatus.pendingDeploy,u=Date.now()-r.ts,h=Math.floor(u/6e4),y=h<1?"just now":h<60?`${h}m ago`:`${Math.floor(h/60)}h ago`;return l`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${r.summary??"Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${y}</span>
                    ${r.files?.length?l`<details class="deploy-review-panel__files">
                          <summary>${r.files.length} file${r.files.length>1?"s":""} changed</summary>
                          <ul>${r.files.map(b=>l`<li>${b}</li>`)}</ul>
                        </details>`:f}
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
              </div>`})():f}
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">

        ${yh.map(r=>{const u=e.settings.navGroupsCollapsed[r.label]??!1,h=r.tabs.some(b=>b===e.tab),y=!r.label||r.tabs.length===1&&Gn(r.tabs[0])===r.label;return l`
            <div class="nav-group ${u&&!h?"nav-group--collapsed":""} ${y?"nav-group--no-header":""}">
              ${y?f:l`
                <button
                  class="nav-label"
                  @click=${()=>{const b={...e.settings.navGroupsCollapsed};b[r.label]=!u,e.applySettings({...e.settings,navGroupsCollapsed:b})}}
                  aria-expanded=${!u}
                >
                  <span class="nav-label__text">${r.label}</span>
                  <span class="nav-label__chevron">${u?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!r.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?l`
                        <a
                          class="nav-item ${e.tab==="onboarding"?"active":""}"
                          href="#"
                          @click=${b=>{b.preventDefault(),e.handleWizardOpen?.()}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                        </a>
                      `:f}
                ${r.tabs.map(b=>Ea(e,b))}
              </div>
            </div>
          `})}
        ${bh.map(r=>{const u=e.settings.navGroupsCollapsed[r.label]??!0,h=r.tabs.some(y=>y===e.tab);return l`
            <div class="nav-group ${u&&!h?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const y={...e.settings.navGroupsCollapsed};y[r.label]=!u,e.applySettings({...e.settings,navGroupsCollapsed:y})}}
                aria-expanded=${!u}
              >
                <span class="nav-label__text">${r.label}</span>
                <span class="nav-label__chevron">${u?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${r.tabs.map(y=>Ea(e,y))}
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
            ${e.tab!=="chat"&&e.tab!=="onboarding"?l`
              <div class="page-title">${Gn(e.tab)}</div>
              <div class="page-sub">${$h(e.tab)}</div>
            `:e.tab==="chat"?l`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===Q?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==Q&&(Pe(e),e.sessionKey=Q,e.allyUnread=0,Ye(e,Q),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...e.settings.tabLastViewed,[Q]:Date.now()}}),e.loadAssistantIdentity(),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),e.loadSessionResources(),Z(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?l`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:l`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?l`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:f}
                </div>
                ${hi(d,r=>r,(r,u)=>{const h=Lt(e.sessionsResult?.sessions,r),y=Ma(r,h)===p,$=(()=>{if(h?.label||h?.displayName)return ac(h.label??h.displayName);const x=Ue.get(r);if(x)return ac(x);if(r==="agent:main:support")return"Support";if(r.includes("webchat")){const T=r.match(/webchat[:-](\d+)/);return T?`Chat ${T[1]}`:"Chat"}if(r.includes("main"))return"MAIN";const _=r.split(/[:-]/);return _[_.length-1]||r})(),k=e.workingSessions.has(r),S=e.settings.tabLastViewed[r]??0,A=h?.updatedAt??0,P=!y&&!k&&A>S,R=e.editingTabKey===r;return l`
                      <div
                        class="session-tab ${y?"session-tab--active":""} ${k?"session-tab--working":""} ${P?"session-tab--ready":""} ${R?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${x=>{if(e.editingTabKey===r){x.preventDefault();return}x.dataTransfer.effectAllowed="move",x.dataTransfer.setData("text/session-key",r),x.dataTransfer.setData("text/plain",u.toString()),x.target.classList.add("dragging")}}
                        @click=${()=>{if(!R){if(y){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}});return}Pe(e),e.sessionKey=r,Ye(e,r),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}),e.loadAssistantIdentity(),be(e,r,!0),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),e.loadSessionResources(),Z(e),Oo()}}}
                        @dragend=${x=>{x.target.classList.remove("dragging")}}
                        @dragover=${x=>{x.preventDefault(),x.dataTransfer.dropEffect="move";const _=x.currentTarget,T=_.getBoundingClientRect(),N=T.left+T.width/2;x.clientX<N?(_.classList.add("drop-left"),_.classList.remove("drop-right")):(_.classList.add("drop-right"),_.classList.remove("drop-left"))}}
                        @dragleave=${x=>{x.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${x=>{x.preventDefault();const _=parseInt(x.dataTransfer.getData("text/plain")),T=u;if(_===T)return;const N=e.settings.openTabs.slice(),[D]=N.splice(_,1);N.splice(T,0,D),e.applySettings({...e.settings,openTabs:N}),x.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${$}
                      >
                        ${R?l`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${h?.label??h?.displayName??""}
                            @click=${x=>x.stopPropagation()}
                            @dblclick=${x=>x.stopPropagation()}
                            @blur=${async x=>{const _=x.target;if(_._committedByEnter)return;const T=_.value.trim();e.editingTabKey=null;const N=h?.label??h?.displayName??"";if(T!==N){T?Ue.set(r,T):Ue.delete(r),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(j=>j.key===r?{...j,label:T||void 0,displayName:T||void 0}:j)});const D=await Cs(e,r,{label:T||null,displayName:T||null});Z(e);const z=D.ok&&D.canonicalKey!==r?D.canonicalKey:r,W=r===e.sessionKey;e.applySettings({...e.settings,...D.ok&&D.canonicalKey!==r&&e.settings.openTabs.includes(r)?{openTabs:e.settings.openTabs.map(j=>j===r?D.canonicalKey:j)}:{},tabLastViewed:{...e.settings.tabLastViewed,[z]:Date.now()},...W&&D.ok&&D.canonicalKey!==r?{sessionKey:D.canonicalKey,lastActiveSessionKey:D.canonicalKey}:{}}),W&&D.ok&&D.canonicalKey!==r&&(e.sessionKey=D.canonicalKey,be(e,D.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}})}}
                            @keydown=${async x=>{if(x.key==="Enter"){x.preventDefault();const _=x.target;_._committedByEnter=!0;const T=_.value.trim();e.editingTabKey=null;const N=h?.label??h?.displayName??"";if(T!==N){T?Ue.set(r,T):Ue.delete(r),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(j=>j.key===r?{...j,label:T||void 0,displayName:T||void 0}:j)});const D=await Cs(e,r,{label:T||null,displayName:T||null});Z(e);const z=D.ok&&D.canonicalKey!==r?D.canonicalKey:r,W=r===e.sessionKey;e.applySettings({...e.settings,...D.ok&&D.canonicalKey!==r&&e.settings.openTabs.includes(r)?{openTabs:e.settings.openTabs.map(j=>j===r?D.canonicalKey:j)}:{},tabLastViewed:{...e.settings.tabLastViewed,[z]:Date.now()},...W&&D.ok&&D.canonicalKey!==r?{sessionKey:D.canonicalKey,lastActiveSessionKey:D.canonicalKey}:{}}),W&&D.ok&&D.canonicalKey!==r&&(e.sessionKey=D.canonicalKey,be(e,D.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}})}else x.key==="Escape"&&(x.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let x=null;return l`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${_=>{_.stopPropagation(),x&&clearTimeout(x),x=setTimeout(()=>{x=null,e.editingTabKey!==r&&(r===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}):(Pe(e),e.sessionKey=r,e.chatPrivateMode=!!e.privateSessions?.has(r),Ye(e,r),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}),e.loadAssistantIdentity(),be(e,r,!0),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),e.loadSessionResources(),Z(e)))},250)}}
                            @dblclick=${_=>{_.preventDefault(),_.stopPropagation(),x&&(clearTimeout(x),x=null),e.editingTabKey=r;const T=_.target.closest(".session-tab"),N=D=>{const z=D.target;T&&!T.contains(z)&&(e.editingTabKey=null,document.removeEventListener("mousedown",N,!0))};document.addEventListener("mousedown",N,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const D=T?.querySelector(".session-tab__name-input");D&&(D.focus(),D.select())})})}}
                          >${$}</span>
                        `})()}
                        ${e.privateSessions?.has(r)?(()=>{const x=e.privateSessions.get(r),_=Math.max(0,x-Date.now()),T=Math.floor(_/36e5),N=Math.floor(_%36e5/6e4),D=T>0?`${T}h ${N}m`:`${N}m`;return l`
                                  <span class="session-tab__private" title="Private session — expires in ${D}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${D}</span
                                  >
                                `})():f}
                        ${k?l`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:f}
                        ${P?l`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:f}
                        ${l`
                          <button
                            class="session-tab__close"
                            @click=${x=>{if(x.stopPropagation(),e.privateSessions?.has(r)){e._destroyPrivateSession(r);return}const _=e.settings.openTabs.filter(D=>D!==r),T=r===e.sessionKey,N=_[0]||Q;e.applySettings({...e.settings,openTabs:_,...T?{sessionKey:N,lastActiveSessionKey:N}:{}}),T&&(e.sessionKey=N,e.sessionResources=[],be(e,N,!0),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(r)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:f}
          </div>
          <div class="page-meta">
            ${e.reconnecting?l`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?l`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:f}
            ${s?Au(e):f}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?s0({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:r=>e.handleTodayViewModeChange(r),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):f}
          </div>
        </section>

        ${i?l`<button
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
            </button>`:f}

        ${e.tab==="setup"||e.tab==="onboarding"?l`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the onboarding wizard to get started.</p>
                    <button class="retry-button" @click=${()=>e.handleWizardOpen?.()}>Open Wizard</button>
                  </div>
                </div>
              </div>`:f}

        ${e.tab==="workspaces"?Y$({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",expandedFolders:e.workspaceExpandedFolders??new Set,loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:r=>e.workspacesSearchQuery=r,onItemSearch:r=>e.workspaceItemSearchQuery=r,onCreateWorkspace:async r=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:u,selectWorkspace:h}=await E(async()=>{const{createWorkspace:b,selectWorkspace:$}=await Promise.resolve().then(()=>pe);return{createWorkspace:b,selectWorkspace:$}},void 0,import.meta.url),y=await u(e,r);return y?(e.workspaceItemSearchQuery="",await h(e,y),e.showToast(`Created workspace: ${y.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onDeleteWorkspace:async r=>{const{deleteWorkspace:u,loadAllTasksWithQueueStatus:h}=await E(async()=>{const{deleteWorkspace:b,loadAllTasksWithQueueStatus:$}=await Promise.resolve().then(()=>pe);return{deleteWorkspace:b,loadAllTasksWithQueueStatus:$}},void 0,import.meta.url);if(!await u(e,r.id)){e.showToast(`Failed to delete ${r.name}`,"error");return}e.showToast(`Deleted workspace: ${r.name}`,"success"),e.allTasks=await h(e)},onSelectWorkspace:async r=>{e.workspaceItemSearchQuery="";const{selectWorkspace:u}=await E(async()=>{const{selectWorkspace:h}=await Promise.resolve().then(()=>pe);return{selectWorkspace:h}},void 0,import.meta.url);await u(e,r)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async r=>{const{readWorkspaceFile:u}=await E(async()=>{const{readWorkspaceFile:b}=await Promise.resolve().then(()=>pe);return{readWorkspaceFile:b}},void 0,import.meta.url),h=e.selectedWorkspace?.id,y=await u(e,r.path,h);if(!y){e.showToast(`Failed to open ${r.name}`,"error");return}e.handleOpenSidebar(y.content,{mimeType:y.mime,filePath:r.path,title:r.name})},onSessionClick:async r=>{if(!r.key)return;const u=r.key;Pe(e),e.sessionKey=u,Ye(e,u),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const h=e.settings.openTabs.includes(u)?e.settings.openTabs:[...e.settings.openTabs,u];e.applySettings({...e.settings,openTabs:h,sessionKey:u,lastActiveSessionKey:u,tabLastViewed:{...e.settings.tabLastViewed,[u]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),be(e,u,!0),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),e.loadSessionResources()},onPinToggle:async(r,u,h)=>{const{toggleWorkspacePin:y}=await E(async()=>{const{toggleWorkspacePin:$}=await Promise.resolve().then(()=>pe);return{toggleWorkspacePin:$}},void 0,import.meta.url);await y(e,r,u,h)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(r,u,h)=>{const{toggleWorkspaceSessionPin:y}=await E(async()=>{const{toggleWorkspaceSessionPin:$}=await Promise.resolve().then(()=>pe);return{toggleWorkspaceSessionPin:$}},void 0,import.meta.url);await y(e,r,u,h)||e.showToast("Failed to update session pin","error")},onToggleFolder:r=>{E(async()=>{const{toggleWorkspaceFolder:u}=await Promise.resolve().then(()=>pe);return{toggleWorkspaceFolder:u}},void 0,import.meta.url).then(({toggleWorkspaceFolder:u})=>{e.workspaceExpandedFolders=u(e.workspaceExpandedFolders??new Set,r),e.requestUpdate()})},onTeamSetup:async()=>{let r="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";try{const u=await e.client?.request("workspaces.teamSetupPrompt",{});u?.prompt&&(r=u.prompt)}catch{}e.handleStartChatWithPrompt(r)},allTasks:e.allTasks??[],taskFilter:e.taskFilter??"outstanding",taskSort:e.taskSort??"due",taskSearch:e.taskSearch??"",showCompletedTasks:e.showCompletedTasks??!1,onToggleTaskComplete:async(r,u)=>{const{toggleTaskComplete:h,loadAllTasksWithQueueStatus:y,getWorkspace:b}=await E(async()=>{const{toggleTaskComplete:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}=await Promise.resolve().then(()=>pe);return{toggleTaskComplete:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}},void 0,import.meta.url);if(!await h(e,r,u)){e.showToast("Failed to update task","error");return}if(e.allTasks=await y(e),e.selectedWorkspace){const k=await b(e,e.selectedWorkspace.id);k&&(e.selectedWorkspace=k)}},onCreateTask:async(r,u)=>{const{createTask:h,loadAllTasksWithQueueStatus:y,getWorkspace:b}=await E(async()=>{const{createTask:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}=await Promise.resolve().then(()=>pe);return{createTask:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}},void 0,import.meta.url),$=await h(e,r,u);if(!$){e.showToast("Failed to create task","error");return}if(e.showToast(`Task created: ${$.title}`,"success"),e.allTasks=await y(e),e.selectedWorkspace){const k=await b(e,e.selectedWorkspace.id);k&&(e.selectedWorkspace=k)}},onSetTaskFilter:r=>{e.taskFilter=r},onSetTaskSort:r=>{e.taskSort=r},onSetTaskSearch:r=>{e.taskSearch=r},onToggleCompletedTasks:()=>{e.showCompletedTasks=!(e.showCompletedTasks??!1)},editingTaskId:e.editingTaskId??null,workspaceNames:(e.workspaces??[]).map(r=>r.name),onStartTask:async r=>{const{startTask:u,loadAllTasksWithQueueStatus:h}=await E(async()=>{const{startTask:k,loadAllTasksWithQueueStatus:S}=await Promise.resolve().then(()=>pe);return{startTask:k,loadAllTasksWithQueueStatus:S}},void 0,import.meta.url),y=await u(e,r);if(!y?.sessionId){e.showToast("Failed to open session for task","error");return}Pe(e);const b=y.sessionId;y.task?.title&&Ue.set(b,y.task.title);const $=e.settings.openTabs.includes(b)?e.settings.openTabs:[...e.settings.openTabs,b];if(e.applySettings({...e.settings,openTabs:$,sessionKey:b,lastActiveSessionKey:b,tabLastViewed:{...e.settings.tabLastViewed,[b]:Date.now()}}),e.sessionKey=b,e.setTab("chat"),y.created&&!y.queueOutput){const k=e.allTasks??[],S=e.selectedWorkspace?.tasks??[],A=[...k,...S].find(R=>R.id===r),P=A?.project?` (project: ${A.project})`:"";e.chatMessage=`Let's work on: ${A?.title??"this task"}${P}`}else e.chatMessage="";e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),be(e,b,!0),await oe(e),e.loadSessionResources(),y.queueOutput&&e.chatMessages.length===0&&e.seedSessionWithAgentOutput(y.task?.title??"this task",y.queueOutput,y.agentPrompt??void 0),e.allTasks=await h(e),e.requestUpdate()},onEditTask:r=>{e.editingTaskId=r},onUpdateTask:async(r,u)=>{const{updateTask:h,loadAllTasksWithQueueStatus:y,getWorkspace:b}=await E(async()=>{const{updateTask:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}=await Promise.resolve().then(()=>pe);return{updateTask:k,loadAllTasksWithQueueStatus:S,getWorkspace:A}},void 0,import.meta.url);if(!await h(e,r,u)){e.showToast("Failed to update task","error");return}if(e.editingTaskId=null,e.allTasks=await y(e),e.selectedWorkspace){const k=await b(e,e.selectedWorkspace.id);k&&(e.selectedWorkspace=k)}},browsePath:e.workspaceBrowsePath??null,browseEntries:e.workspaceBrowseEntries??null,breadcrumbs:e.workspaceBreadcrumbs??null,browseSearchQuery:e.workspaceBrowseSearchQuery??"",browseSearchResults:e.workspaceBrowseSearchResults??null,onBrowseFolder:r=>e.handleWorkspaceBrowse(r),onBrowseSearch:r=>e.handleWorkspaceBrowseSearch(r),onBrowseBack:()=>e.handleWorkspaceBrowseBack(),onCreateFolder:r=>e.handleWorkspaceCreateFolder(r),onBatchPushToDrive:r=>e.handleBatchPushToDrive(r)}):f}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?E1(e,"today"):a0({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefGenerate:()=>e.handleDailyBriefGenerate(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:r=>e.handleBriefSave(r),onBriefToggleCheckbox:(r,u)=>e.handleBriefToggleCheckbox(r,u),onOpenFile:r=>{e.handleOpenFile(r)},selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:r=>e.handleTodayViewModeChange(r),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh(),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),todayTasks:e.todayTasks??[],todayTasksLoading:e.todayTasksLoading??!1,onToggleTaskComplete:(r,u)=>e.handleMyDayTaskStatusChange(r,u==="complete"?"pending":"complete"),onStartTask:r=>e.handleTodayStartTask(r),onViewTaskOutput:r=>e.handleTodayViewTaskOutput(r),onCreateTask:r=>e.handleTodayCreateTask(r),onEditTask:r=>e.handleTodayEditTask(r),onUpdateTask:(r,u)=>e.handleTodayUpdateTask(r,u),editingTaskId:e.todayEditingTaskId,showCompletedTasks:e.todayShowCompleted,onToggleCompletedTasks:()=>e.handleTodayToggleCompleted(),decisionCards:(e.todayQueueResults??[]).length>0?{items:e.todayQueueResults,onApprove:r=>e.handleDecisionApprove(r),onReject:r=>e.handleDecisionReject(r),onDismiss:r=>e.handleDecisionDismiss(r),onViewOutput:(r,u)=>e.handleDecisionViewOutput(r,u),onOpenChat:r=>e.handleDecisionOpenChat(r),onMarkComplete:r=>e.handleDecisionMarkComplete(r),onRate:(r,u,h)=>e.handleDecisionRate(r,u,h),onFeedback:(r,u,h)=>e.handleDecisionFeedback(r,u,h)}:void 0,inboxItems:e.inboxItems??[],inboxLoading:e.inboxLoading??!1,inboxCount:e.inboxCount??0,inboxScoringId:e.inboxScoringId??null,inboxScoringValue:e.inboxScoringValue,inboxFeedbackText:e.inboxFeedbackText,onInboxViewOutput:r=>{e.handleInboxViewOutput(r)},onInboxViewProof:r=>{e.handleInboxViewProof(r)},onInboxOpenChat:r=>e.handleInboxOpenChat(r),onInboxDismiss:r=>{e.handleInboxDismiss(r)},onInboxScore:(r,u,h)=>{e.handleInboxScore(r,u,h)},onInboxSetScoring:(r,u)=>e.handleInboxSetScoring(r,u),onInboxFeedbackChange:r=>e.handleInboxFeedbackChange(r),onInboxSortToggle:()=>e.handleInboxSortToggle(),inboxSortOrder:e.inboxSortOrder??"newest",onInboxMarkAll:()=>{e.handleInboxMarkAll()},onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):f}

        ${e.tab==="channels"?Vw({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:r=>Ie(e,r),onWhatsAppStart:r=>e.handleWhatsAppStart(r),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(r,u)=>sn(e,r,u),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(r,u)=>e.handleNostrProfileEdit(r,u),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(r,u)=>e.handleNostrProfileFieldChange(r,u),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):f}

        ${e.tab==="instances"?w$({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Ao(e)}):f}

        ${e.tab==="sessions"?W0({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:r=>{e.sessionsFilterActive=r.activeMinutes,e.sessionsFilterLimit=r.limit,e.sessionsIncludeGlobal=r.includeGlobal,e.sessionsIncludeUnknown=r.includeUnknown},onRefresh:()=>{Z(e),Bt(e)},onPatch:async(r,u)=>{const h=await Cs(e,r,u);if(h.ok&&h.canonicalKey!==r&&e.settings.openTabs.includes(r)){const y=e.settings.openTabs.map($=>$===r?h.canonicalKey:$),b=r===e.sessionKey;e.applySettings({...e.settings,openTabs:y,tabLastViewed:{...e.settings.tabLastViewed,[h.canonicalKey]:e.settings.tabLastViewed[r]??Date.now()},...b?{sessionKey:h.canonicalKey,lastActiveSessionKey:h.canonicalKey}:{}}),b&&(e.sessionKey=h.canonicalKey,be(e,h.canonicalKey,!0))}},onDelete:r=>Dd(e,r),onArchive:r=>Md(e,r),onUnarchive:r=>Od(e,r),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Bt(e)},onAutoArchive:()=>Fd(e)}):f}

        ${e.tab==="cron"?u$({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(r=>r.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:r=>e.cronForm={...e.cronForm,...r},onRefresh:()=>e.loadCron(),onAdd:()=>by(e),onToggle:(r,u)=>wy(e,r,u),onRun:r=>ky(e,r),onRemove:r=>$y(e,r),onLoadRuns:r=>Xd(e,r)}):f}

        ${e.tab==="skills"?V0({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:r=>e.skillsFilter=r,onRefresh:()=>{is(e,{clearMessages:!0}),_a(e)},onToggle:(r,u)=>Wy(e,r,u),onEdit:(r,u)=>Ky(e,r,u),onSaveKey:r=>qy(e,r),onInstall:(r,u,h)=>jy(e,r,u,h),onSubTabChange:r=>{e.skillsSubTab=r,r==="godmode"&&!e.godmodeSkills&&_a(e),r==="clawhub"&&e.clawhubExploreItems},onToggleExpand:r=>{const u=new Set(e.expandedSkills);u.has(r)?u.delete(r):u.add(r),e.expandedSkills=u},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:r=>{e.clawhubQuery=r},onExplore:r=>void 0,onDetail:r=>void 0,onCloseDetail:()=>void 0,onImport:r=>vl(),onImportAndPersonalize:async r=>{if(!await vl())return;const h=await ow();h&&(Eo(e,"chat"),fi(e),e.chatMessage=h)}}}):f}

        ${e.tab==="agents"?eS({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:r=>e.rosterFilter=r,onRefresh:()=>ad(e),onToggleExpand:r=>{const u=new Set(e.expandedAgents);u.has(r)?u.delete(r):u.add(r),e.expandedAgents=u}}):f}

        ${e.tab==="nodes"?o0({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ai(e),onDevicesRefresh:()=>gt(e),onDeviceApprove:r=>av(e,r),onDeviceReject:r=>ov(e,r),onDeviceRotate:(r,u,h)=>rv(e,{deviceId:r,role:u,scopes:h}),onDeviceRevoke:(r,u)=>lv(e,{deviceId:r,role:u}),onLoadConfig:()=>Je(e),onLoadExecApprovals:()=>{const r=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return xo(e,r)},onBindDefault:r=>{r?sn(e,["tools","exec","node"],r):vr(e,["tools","exec","node"])},onBindAgent:(r,u)=>{const h=["agents","list",r,"tools","exec","node"];u?sn(e,h,u):vr(e,h)},onSaveBindings:()=>Is(e),onExecApprovalsTargetChange:(r,u)=>{e.execApprovalsTarget=r,e.execApprovalsTargetNodeId=u,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:r=>{e.execApprovalsSelectedAgent=r},onExecApprovalsPatch:(r,u)=>Ly(e,r,u),onExecApprovalsRemove:r=>Iy(e,r),onSaveExecApprovals:()=>{const r=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Py(e,r)}}):f}

        ${e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length?l`
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

        ${e.tab==="chat"?Uk({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:r=>{Pe(e),e.sessionKey=r,Ye(e,r),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r}),e.loadAssistantIdentity(),oe(e).then(()=>{e.resetChatScroll(),ve(e,!0)}),js(e),e.loadSessionResources(),Ks(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:c,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:n,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),Ks(e),Promise.all([oe(e),js(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:r=>e.handleChatScroll(r),onDraftChange:r=>e.chatMessage=r,attachments:e.chatAttachments,onAttachmentsChange:r=>e.chatAttachments=r,showToast:(r,u)=>e.showToast(r,u),onSend:r=>e.handleSendChat(void 0,{queue:r}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:r=>e.removeQueuedMessage(r),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(r,u)=>e.handleOpenSidebar(r,u),onMessageLinkClick:r=>e.handleOpenMessageFileLink(r),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:r=>{e.handleOpenProofDoc(r)},onOpenFile:r=>e.handleOpenFile(r),onSplitRatioChange:r=>e.handleSplitRatioChange(r),onPushToDrive:(r,u)=>e.handlePushToDrive(r,u),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(r,u,h)=>e.handleImageClick(r,u,h),resolveImageUrl:(r,u)=>Dv(e.sessionKey,r,u),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const r=document.querySelector(".chat-thread");r&&(r.scrollTo({top:r.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:r=>e.handleAllyDraftChange(r),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:r=>e.handleAllyAttachmentsChange(r),onAction:(r,u,h,y)=>e.handleAllyAction(r,u,h,y)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:r=>e.handleSessionResourceClick(r),onViewAllResources:()=>e.handleViewAllResources()}):f}

        ${e.tab==="options"?hS({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(r,u)=>e.handleOptionToggle(r,u),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):f}

        ${e.tab==="guardrails"?s1({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(r,u)=>e.handleGuardrailToggle(r,u),onThresholdChange:(r,u,h)=>e.handleGuardrailThresholdChange(r,u,h),onCustomToggle:(r,u)=>e.handleCustomGuardrailToggle(r,u),onCustomDelete:r=>e.handleCustomGuardrailDelete(r),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:r=>{e.handleAllyToggle(),r&&e.handleAllyDraftChange(r)}}):f}

        ${e.tab==="trust"?YS({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:r=>e.handleTrustAddWorkflow(r),onRemoveWorkflow:r=>e.handleTrustRemoveWorkflow(r),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(r,u)=>e.handleDailyRate(r,u),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):f}

        ${e.tab==="second-brain"?f1({connected:e.connected,loading:e.secondBrainLoading??!1,error:e.secondBrainError??null,subtab:e.secondBrainSubtab??"identity",identity:e.secondBrainIdentity??null,memoryBank:e.secondBrainMemoryBank??null,aiPacket:e.secondBrainAiPacket??null,sourcesData:e.secondBrainSourcesData??null,selectedEntry:e.secondBrainSelectedEntry??null,searchQuery:e.secondBrainSearchQuery??"",syncing:e.secondBrainSyncing??!1,browsingFolder:e.secondBrainBrowsingFolder??null,folderEntries:e.secondBrainFolderEntries??null,folderName:e.secondBrainFolderName??null,onSubtabChange:r=>e.handleSecondBrainSubtabChange(r),onSelectEntry:r=>e.handleSecondBrainSelectEntry(r),onOpenInBrowser:r=>e.handleSecondBrainOpenInBrowser(r),onBrowseFolder:r=>e.handleSecondBrainBrowseFolder(r),onBack:()=>e.handleSecondBrainBack(),onSearch:r=>e.handleSecondBrainSearch(r),onSync:()=>e.handleSecondBrainSync(),onRefresh:()=>e.handleSecondBrainRefresh(),onOpenSidebar:(r,u)=>e.handleOpenSidebar(r,u),researchData:e.secondBrainResearchData??null,researchAddFormOpen:e.secondBrainResearchAddFormOpen??!1,researchAddForm:e.secondBrainResearchAddForm,researchCategories:e.secondBrainResearchCategories??[],onResearchAddFormToggle:()=>e.handleResearchAddFormToggle(),onResearchAddFormChange:(r,u)=>e.handleResearchAddFormChange(r,u),onResearchAddSubmit:()=>e.handleResearchAddSubmit(),onSaveViaChat:()=>e.handleResearchSaveViaChat(),communityResources:e.secondBrainCommunityResources??null,communityResourceAddFormOpen:e.secondBrainCommunityResourceAddFormOpen??!1,communityResourceAddForm:e.secondBrainCommunityResourceAddForm,onCommunityResourceAdd:()=>e.handleCommunityResourceAdd(),onCommunityResourceRemove:r=>e.handleCommunityResourceRemove(r),onCommunityResourceAddFormToggle:()=>e.handleCommunityResourceAddFormToggle(),onCommunityResourceAddFormChange:(r,u)=>e.handleCommunityResourceAddFormChange(r,u),onAddSource:()=>e.handleAddSource(),fileTree:e.secondBrainFileTree??null,fileTreeLoading:e.secondBrainFileTreeLoading??!1,fileSearchQuery:e.secondBrainFileSearchQuery??"",fileSearchResults:e.secondBrainFileSearchResults??null,onFileTreeRefresh:()=>e.handleSecondBrainFileTreeRefresh(),onFileSearch:r=>e.handleSecondBrainFileSearch(r),onFileSelect:r=>e.handleSecondBrainFileSelect(r),intelProps:(e.secondBrainSubtab??"identity")==="intel"?{insights:e.intelInsights??[],discoveries:e.intelDiscoveries??[],patterns:e.intelPatterns??null,status:e.intelStatus??null,loading:e.intelLoading??!1,error:e.intelError??null,onDismiss:r=>e.handleIntelDismiss(r),onAct:r=>e.handleIntelAct(r),onRefresh:()=>e.handleIntelRefresh()}:void 0,vaultHealth:e.secondBrainVaultHealth??null}):f}

        ${e.tab==="dashboards"?e.dynamicSlots.dashboards?l`<div class="dynamic-slot">${Le(Hc(e.dynamicSlots.dashboards))}</div>`:A1({connected:e.connected,loading:e.dashboardsLoading??!1,error:e.dashboardsError??null,dashboards:e.dashboardsList,activeDashboardId:e.activeDashboardId??null,activeDashboardHtml:e.activeDashboardHtml??null,activeDashboardManifest:e.activeDashboardManifest??null,isWorking:e.activeDashboardManifest?.sessionId?e.workingSessions.has(e.activeDashboardManifest.sessionId):!1,onSelectDashboard:r=>e.handleDashboardSelect(r),onDeleteDashboard:r=>e.handleDashboardDelete(r),onCreateViaChat:r=>e.handleDashboardCreateViaChat(r),onTogglePin:r=>e.handleDashboardTogglePin(r),categoryFilter:e.dashboardCategoryFilter??null,onCategoryFilter:r=>e.handleDashboardCategoryFilter(r),onBack:()=>e.handleDashboardBack(),onRefresh:()=>e.handleDashboardsRefresh(),onOpenSession:r=>e.handleDashboardOpenSession(r)}):f}

        ${e.tab==="config"?e$({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:r=>{e.configRaw=r},onFormModeChange:r=>e.configFormMode=r,onFormPatch:(r,u)=>sn(e,r,u),onSearchChange:r=>e.configSearchQuery=r,onSectionChange:r=>{e.configActiveSection=r,e.configActiveSubsection=null},onSubsectionChange:r=>e.configActiveSubsection=r,onReload:()=>Je(e),onSave:()=>Is(e),onApply:()=>Qp(e),onUpdate:()=>Yp(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(r,u)=>e.handleUpdateUserProfile(r,u),onModelSwitch:(r,u)=>Jp(e,r,u)}):f}

        ${e.tab==="debug"?g$({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:r=>e.debugCallMethod=r,onCallParamsChange:r=>e.debugCallParams=r,onRefresh:()=>oi(e),onCall:()=>Xv(e)}):f}

        ${e.tab==="logs"?x$({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:r=>e.logsFilterText=r,onLevelToggle:(r,u)=>{e.logsLevelFilters={...e.logsLevelFilters,[r]:u}},onToggleAutoFollow:r=>e.logsAutoFollow=r,onRefresh:()=>vo(e,{reset:!0}),onExport:(r,u)=>e.exportLogs(r,u),onScroll:r=>e.handleLogsScroll(r)}):f}
      </main>
      ${e.tab!=="chat"?bw({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:r=>e.handleAllyDraftChange(r),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:r=>e.handleAllyAttachmentsChange(r),onAction:(r,u,h,y)=>e.handleAllyAction(r,u,h,y)}):f}
      ${v$(e)}
      ${y$(e)}
      ${b$(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?l`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Ra({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:r=>e.handleOpenFile(r),onPushToDrive:(r,u)=>e.handlePushToDrive(r,u),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:f}
      ${dS({toasts:e.toasts,onDismiss:r=>e.dismissToast(r)})}
      ${lS(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:r=>e.handleLightboxNav(r)})}
    </div>
  `}async function L1(e){}async function I1(e){}async function D1(e,t){}async function M1(e){}async function O1(e){}async function F1(e){}async function zo(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function op(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await zo(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function N1(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await op(e,[...n,t.trim()])}async function B1(e,t){const n=e.trustTrackerData?.workflows??[];await op(e,n.filter(s=>s!==t))}async function U1(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await zo(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const z1=6e4,rc=15,lc=new Set;let Rs=null;async function cc(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+rc*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(lc.has(i.id))continue;const a=new Date(i.startTime),o=Math.round((a.getTime()-t.getTime())/6e4);if(o>0&&o<=rc){lc.add(i.id);const c=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),d=i.location?` @ ${i.location}`:"",p=`${i.title} starts in ${o} min (${c})${d}`;e.showToast(p,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function K1(e){rp(),cc(e),Rs=setInterval(()=>{cc(e)},z1)}function rp(){Rs&&(clearInterval(Rs),Rs=null)}let W1=0;function q1(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${W1++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function j1(e,t){return e.filter(n=>n.id!==t)}function H1(e,t){return[...e,t]}var V1=Object.defineProperty,G1=Object.getOwnPropertyDescriptor,m=(e,t,n,s)=>{for(var i=s>1?void 0:s?G1(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&V1(t,n,i),i};function aa(){return Am()}function $s(){return _m()}function Q1(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function Y1(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>s.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const a=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const dc=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),J1=["path","filePath","file","workspacePath"];let g=class extends on{constructor(){super(...arguments),this.settings=wb(),this.password="",this.tab="chat",this.onboarding=Q1(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=aa().name,this.assistantAvatar=aa().avatar,this.assistantAgentId=aa().agentId??null,this.userName=$s().name,this.userAvatar=$s().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=Xu(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Ob},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=re(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Mb},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainResearchAddFormOpen=!1,this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""},this.secondBrainResearchCategories=[],this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>vu(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=$s();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=$s();this.userAvatar=t.avatar}tw(this);const e=re();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),K1(this),this._restorePrivateSessions()}firstUpdated(){nw(this)}disconnectedCallback(){rp(),this._stopPrivateSessionTimer(),sw(this),super.disconnectedCallback()}updated(e){aw(this,e)}connect(){mo(this)}handleChatScroll(e){fh(this,e)}handleLogsScroll(e){gh(this,e)}exportLogs(e,t){mh(e,t)}resetToolStream(){Wa(this),this.sessionResources=[]}resetChatScroll(){Js(this)}async loadAssistantIdentity(){await ld(this)}applySettings(e){Xe(this,e)}setTab(e){Eo(this,e)}setTheme(e,t){uu(this,e,t)}async loadOverview(){await Lo(this)}async loadCron(){await pi(this)}async handleAbortChat(){await Io(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await L1()}async handleFocusPulseStartMorning(){await I1(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>at);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await D1()}async handleFocusPulseComplete(){await M1()}async handleFocusPulsePulseCheck(){await O1()}async handleFocusPulseEndDay(){await F1()}async handleTrustLoad(){await zo(this)}async handleTrustAddWorkflow(e){await N1(this,e)}async handleTrustRemoveWorkflow(e){await B1(this,e)}async handleDailyRate(e,t){await U1(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await E(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>en);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await E(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>en);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await E(async()=>{const{updateGuardrailThreshold:i}=await Promise.resolve().then(()=>en);return{updateGuardrailThreshold:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await E(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>en);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await E(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>en);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await E(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>en);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await E(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>it);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await E(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>it);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await E(async()=>{const{approveCodingTask:i,approveQueueItem:a}=await Promise.resolve().then(()=>it);return{approveCodingTask:i,approveQueueItem:a}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await E(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>it);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await E(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>it);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>En);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await E(async()=>{const{selectSwarmProject:n}=await Promise.resolve().then(()=>it);return{selectSwarmProject:n}},void 0,import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,n){const{steerSwarmAgent:s}=await E(async()=>{const{steerSwarmAgent:i}=await Promise.resolve().then(()=>it);return{steerSwarmAgent:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const i=`## Task Files

${n.map(a=>`- **${a.name}** (${a.type}, ${(a.size/1024).toFixed(1)} KB)
  \`${a.path}\``).join(`

`)}`;this.handleOpenSidebar(i,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=Sh(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const d=[];for(const p of t){if(!p.dataUrl)continue;const r=p.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!r)continue;const[,u,h]=r;u.startsWith("image/")&&d.push({type:"image",mimeType:u,content:h,fileName:p.fileName})}if(d.length>0){i=d;try{await this.client?.request("images.cache",{images:d.map(p=>({data:p.content,mimeType:p.mimeType,fileName:p.fileName})),sessionKey:Q})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:Q,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:Q,message:s,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,c=setInterval(async()=>{if(!this.allyWorking){clearInterval(c);return}try{await this._loadAllyHistory();const d=this.allyMessages[this.allyMessages.length-1];d&&d.role==="assistant"&&d.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(c),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(c),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...this.settings.tabLastViewed,[Q]:Date.now()}}),this.sessionKey=Q,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:Q,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await E(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>Lg);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",o=a.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const c=i;if(c.toolCallId||c.tool_call_id||c.toolName||c.tool_name)return null;if(Array.isArray(i.content)){const u=i.content;if(!u.some(y=>{const b=(typeof y.type=="string"?y.type:"").toLowerCase();return(b==="text"||b==="")&&typeof y.text=="string"&&y.text.trim().length>0})&&u.some(b=>{const $=(typeof b.type=="string"?b.type:"").toLowerCase();return $==="tool_use"||$==="tool_result"||$==="toolresult"||$==="tooluse"}))return null}let d=t(i);if(!d)return null;const p=n(d);if(p&&(d=p),d=d.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!d)return null;const r=Y1(d,a);return r?{role:o==="user"?"user":"assistant",content:r,timestamp:i.timestamp}:null}).filter(i=>i!==null);const s=[];for(const i of this.allyMessages){const a=s[s.length-1];a&&a.role===i.role&&a.content===i.content||s.push(i)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,userRating:n,feedbackPending:s}:i),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,feedbackPending:!1}:i).filter(i=>!(i.id===e&&i.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(i=>i.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await E(async()=>{const{createNewSession:i}=await Promise.resolve().then(()=>at);return{createNewSession:i}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await E(async()=>{const{autoTitleCache:i}=await Promise.resolve().then(()=>En);return{autoTitleCache:i}},void 0,import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const i=await this.client.request("queue.readOutput",{path:t.outputPath});i?.content&&await this.seedSessionWithAgentOutput(t.title,i.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await E(async()=>{const{sendChatMessage:c}=await Promise.resolve().then(()=>Ge);return{sendChatMessage:c}},void 0,import.meta.url);await o(this,a)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await E(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>it);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await E(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await E(async()=>{const{loadDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:i}=await E(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>En);return{autoTitleCache:c}},void 0,import.meta.url);i.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:a}=await E(async()=>{const{saveDraft:c}=await Promise.resolve().then(()=>Gi);return{saveDraft:c}},void 0,import.meta.url);a(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await E(async()=>{const{loadChatHistory:c}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:c}},void 0,import.meta.url);await o(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await E(async()=>{const{deleteDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await E(async()=>{const{toggleDashboardPin:n}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>at);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,E(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>Gi);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,E(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await E(async()=>{const{syncUrlWithSessionKey:i}=await Promise.resolve().then(()=>Rb);return{syncUrlWithSessionKey:i}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await E(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await E(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await E(async()=>{const{loadSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,e==="intel"?this.handleIntelLoad().catch(t=>{console.error("[Intel] Load after subtab change failed:",t),this.intelError=t instanceof Error?t.message:"Failed to load intel data"}):e==="files"?this.handleSecondBrainFileTreeRefresh().catch(t=>{console.error("[SecondBrain] File tree load after subtab change failed:",t)}):this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await E(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainOpenInBrowser(e){try{if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")){window.open(e,"_blank","noopener,noreferrer");return}const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=new Blob([t.content],{type:"text/html"}),s=URL.createObjectURL(n);window.open(s,"_blank","noopener,noreferrer")}}catch(t){console.error("[SecondBrain] Failed to open in browser:",t)}}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await E(async()=>{const{browseFolder:n}=await import("./second-brain-ghSM5E6X.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await E(async()=>{const{syncSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}async handleSecondBrainFileTreeRefresh(){if(!(!this.client||!this.connected)){this.secondBrainFileTreeLoading=!0;try{const e=await this.client.request("secondBrain.fileTree",{depth:4});this.secondBrainFileTree=e.tree??[]}catch(e){console.error("[SecondBrain] fileTree failed:",e)}finally{this.secondBrainFileTreeLoading=!1}}}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}handleResearchAddFormToggle(){this.secondBrainResearchAddFormOpen=!this.secondBrainResearchAddFormOpen,this.secondBrainResearchAddFormOpen&&(this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""})}handleResearchAddFormChange(e,t){this.secondBrainResearchAddForm={...this.secondBrainResearchAddForm,[e]:t}}async handleResearchAddSubmit(){const{addResearch:e}=await E(async()=>{const{addResearch:t}=await import("./second-brain-ghSM5E6X.js");return{addResearch:t}},[],import.meta.url);await e(this)}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>at);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>at);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}async handleCommunityResourceAdd(){const{addCommunityResource:e}=await E(async()=>{const{addCommunityResource:t}=await import("./second-brain-ghSM5E6X.js");return{addCommunityResource:t}},[],import.meta.url);await e(this)}async handleCommunityResourceRemove(e){const{removeCommunityResource:t}=await E(async()=>{const{removeCommunityResource:n}=await import("./second-brain-ghSM5E6X.js");return{removeCommunityResource:n}},[],import.meta.url);await t(this,e)}handleCommunityResourceAddFormToggle(){this.secondBrainCommunityResourceAddFormOpen=!this.secondBrainCommunityResourceAddFormOpen,this.secondBrainCommunityResourceAddFormOpen&&(this.secondBrainCommunityResourceAddForm={url:"",label:"",description:"",tags:""})}handleCommunityResourceAddFormChange(e,t){this.secondBrainCommunityResourceAddForm={...this.secondBrainCommunityResourceAddForm,[e]:t}}removeQueuedMessage(e){ku(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,i=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((i>0?s/i:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),c=e==null?[...this.chatAttachments??[]]:[];if(o||c.length>0){this.pendingRetry={message:o,attachments:c,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await $u(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await th(this,e)}async handleWhatsAppWait(){await nh(this)}async handleWhatsAppLogout(){await sh(this)}async handleChannelConfigSave(){await ih(this)}async handleChannelConfigReload(){await ah(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await hd(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){rh(this,e,t)}handleNostrProfileCancel(){lh(this)}handleNostrProfileFieldChange(e,t){ch(this,e,t)}async handleNostrProfileSave(){await uh(this)}async handleNostrProfileImport(){await ph(this)}handleNostrProfileToggleAdvanced(){dh(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,Xe(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}let t=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{t=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const n=await this.client.request("files.read",{path:t}),s=t.split(".").pop()?.toLowerCase()??"",i=n.contentType??n.mime??(s==="md"?"text/markdown":null),a=t.split("/").pop()??t;this.handleOpenSidebar(n.content,{mimeType:i,filePath:t,title:a}),n.truncated&&this.showToast(`Opened truncated file: ${a}`,"warning")}catch(n){console.error("[Chat] Failed to open file:",n),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),i=t?` to ${t.split("@")[0]}`:"",a=s?.message??`Uploaded${i} to Google Drive`,o=s?.driveUrl;this.showToast(a,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const i=s?.results?.filter(o=>o.success).length??0,a=s?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=nS(e,t,n)}handleLightboxClose(){this.lightbox=sS()}handleLightboxNav(e){this.lightbox=iS(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let p=t.slice(7);p.startsWith("/~/")&&(p="~"+p.slice(2));try{p=decodeURIComponent(p)}catch{}n.push(p);const r=[],u=new Set;for(const h of n){const y=this.normalizeWorkspacePathCandidate(h,{allowAbsolute:!0});!y||u.has(y)||(u.add(y),r.push(y))}return r}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const b of J1){const $=o.searchParams.get(b);$&&n.push($)}const r=(t.split("#")[0]??"").split("?")[0]??"";r.length>0&&!r.startsWith("/")&&!r.includes("://")&&n.push(r);let h=o.pathname;this.basePath&&h.startsWith(`${this.basePath}/`)?h=h.slice(this.basePath.length):this.basePath&&h===this.basePath&&(h="");const y=h.startsWith("/")?h.slice(1):h;if(y){n.push(y);const b=y.indexOf("/");if(b>0){const $=y.slice(0,b).toLowerCase();dc.has($)&&n.push(y.slice(b+1))}}if(h.startsWith("/")&&y){const b=y.split("/")[0]?.toLowerCase()??"";dc.has(b)||n.push(h)}}const c=[],d=new Set;for(const p of n){let r=p;try{r=decodeURIComponent(p)}catch{}const u=this.normalizeWorkspacePathCandidate(r,{allowAbsolute:!0});!u||d.has(u)||(d.add(u),c.push(u))}return c}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const i=q1(e,t,n,s);this.toasts=H1(this.toasts,i),n>0&&window.setTimeout(()=>{this.dismissToast(i.id)},n)}dismissToast(e){this.toasts=j1(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await Ws(this),this._loadDecisionCards()}_loadDecisionCards(){E(()=>Promise.resolve().then(()=>On),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>On);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:re(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await E(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>On);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>On);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(a=>a.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),i=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:i})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:a}=await E(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>En);return{autoTitleCache:c}},void 0,import.meta.url);a.set(n,t.task.title);const{hostPatchSession:o}=await E(async()=>{const{hostPatchSession:c}=await Promise.resolve().then(()=>Iv);return{hostPatchSession:c}},void 0,import.meta.url);o(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:i}=await E(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:a}},void 0,import.meta.url);await i(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=re(e),Mn(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=re(),n=re(e);n>t||(this.todaySelectedDate=n,Mn(this))}handleDateToday(){this.todaySelectedDate=re(),Ws(this)}async handleDailyBriefRefresh(){await Mn(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await Mn(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;su(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),E(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>at);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(i=>i!==e),s=n[0]||Q;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await E(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:i}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,i])=>i>n);if(this.privateSessions=new Map(s),s.length!==t.length){const i=t.filter(([,a])=>a<=n);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([iu(this),au(this)])}async handleResourcePin(e,t){await Vy(this,e,t)}async handleResourceDelete(e){await Gy(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],n=new Set(t.filter(s=>s.proofSlug).map(s=>s.proofSlug));if(this.chatMessages?.length)for(const s of this.chatMessages){const i=s,a=Array.isArray(i.content)?i.content:[];for(const o of a){const c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);d._sidebarAction?.type==="proof"&&d._sidebarAction.slug&&!n.has(d._sidebarAction.slug)&&(n.add(d._sidebarAction.slug),t.unshift({id:`proof:${d._sidebarAction.slug}`,title:d.title??"Proof Document",type:"doc",path:d.filePath,sessionKey:this.sessionKey,proofSlug:d._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||Hy(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await di(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await E(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>pe);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await E(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>pe);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await E(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>pe);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>at);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>at);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}E(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>Gi);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>En);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Ge);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){E(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>ES);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const i of e.files??[])n[i.path]=i.wouldCreate;const s={};if(t){for(const i of t.additions)s[i.path]=!0;for(const i of t.changes)s[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){E(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),E(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){E(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){E(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){E(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(n?.content){this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(n){console.error("[Inbox] Failed to load output file:",n)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,n=i.filePath?.trim()||null,s=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return P1(this)}};m([v()],g.prototype,"settings",2);m([v()],g.prototype,"password",2);m([v()],g.prototype,"tab",2);m([v()],g.prototype,"onboarding",2);m([v()],g.prototype,"connected",2);m([v()],g.prototype,"reconnecting",2);m([v()],g.prototype,"reconnectAttempt",2);m([v()],g.prototype,"theme",2);m([v()],g.prototype,"themeResolved",2);m([v()],g.prototype,"hello",2);m([v()],g.prototype,"lastError",2);m([v()],g.prototype,"eventLog",2);m([v()],g.prototype,"assistantName",2);m([v()],g.prototype,"assistantAvatar",2);m([v()],g.prototype,"assistantAgentId",2);m([v()],g.prototype,"userName",2);m([v()],g.prototype,"userAvatar",2);m([v()],g.prototype,"sessionKey",2);m([v()],g.prototype,"sessionPickerOpen",2);m([v()],g.prototype,"sessionPickerPosition",2);m([v()],g.prototype,"sessionPickerSearch",2);m([v()],g.prototype,"sessionSearchOpen",2);m([v()],g.prototype,"sessionSearchPosition",2);m([v()],g.prototype,"sessionSearchQuery",2);m([v()],g.prototype,"sessionSearchResults",2);m([v()],g.prototype,"sessionSearchLoading",2);m([v()],g.prototype,"profilePopoverOpen",2);m([v()],g.prototype,"profileEditName",2);m([v()],g.prototype,"profileEditAvatar",2);m([v()],g.prototype,"editingTabKey",2);m([v()],g.prototype,"chatLoading",2);m([v()],g.prototype,"chatSending",2);m([v()],g.prototype,"chatSendingSessionKey",2);m([v()],g.prototype,"chatMessage",2);m([v()],g.prototype,"chatDrafts",2);m([v()],g.prototype,"chatMessages",2);m([v()],g.prototype,"chatToolMessages",2);m([v()],g.prototype,"chatStream",2);m([v()],g.prototype,"chatStreamStartedAt",2);m([v()],g.prototype,"chatRunId",2);m([v()],g.prototype,"currentToolName",2);m([v()],g.prototype,"currentToolInfo",2);m([v()],g.prototype,"workingSessions",2);m([v()],g.prototype,"compactionStatus",2);m([v()],g.prototype,"chatAvatarUrl",2);m([v()],g.prototype,"chatThinkingLevel",2);m([v()],g.prototype,"chatQueue",2);m([v()],g.prototype,"chatAttachments",2);m([v()],g.prototype,"pendingRetry",2);m([v()],g.prototype,"autoRetryAfterCompact",2);m([v()],g.prototype,"sidebarOpen",2);m([v()],g.prototype,"sidebarContent",2);m([v()],g.prototype,"sidebarError",2);m([v()],g.prototype,"sidebarMimeType",2);m([v()],g.prototype,"sidebarFilePath",2);m([v()],g.prototype,"sidebarTitle",2);m([v()],g.prototype,"sidebarMode",2);m([v()],g.prototype,"sidebarProofSlug",2);m([v()],g.prototype,"sidebarProofUrl",2);m([v()],g.prototype,"sidebarProofHtml",2);m([v()],g.prototype,"splitRatio",2);m([v()],g.prototype,"lightbox",2);m([v()],g.prototype,"driveAccounts",2);m([v()],g.prototype,"showDrivePicker",2);m([v()],g.prototype,"driveUploading",2);m([v()],g.prototype,"updateStatus",2);m([v()],g.prototype,"updateLoading",2);m([v()],g.prototype,"updateError",2);m([v()],g.prototype,"updateLastChecked",2);m([v()],g.prototype,"nodesLoading",2);m([v()],g.prototype,"nodes",2);m([v()],g.prototype,"devicesLoading",2);m([v()],g.prototype,"devicesError",2);m([v()],g.prototype,"devicesList",2);m([v()],g.prototype,"execApprovalsLoading",2);m([v()],g.prototype,"execApprovalsSaving",2);m([v()],g.prototype,"execApprovalsDirty",2);m([v()],g.prototype,"execApprovalsSnapshot",2);m([v()],g.prototype,"execApprovalsForm",2);m([v()],g.prototype,"execApprovalsSelectedAgent",2);m([v()],g.prototype,"execApprovalsTarget",2);m([v()],g.prototype,"execApprovalsTargetNodeId",2);m([v()],g.prototype,"execApprovalQueue",2);m([v()],g.prototype,"execApprovalBusy",2);m([v()],g.prototype,"execApprovalError",2);m([v()],g.prototype,"pendingGatewayUrl",2);m([v()],g.prototype,"gatewayRestartPending",2);m([v()],g.prototype,"gatewayRestartBusy",2);m([v()],g.prototype,"deployPanelOpen",2);m([v()],g.prototype,"configLoading",2);m([v()],g.prototype,"configRaw",2);m([v()],g.prototype,"configRawOriginal",2);m([v()],g.prototype,"configValid",2);m([v()],g.prototype,"configIssues",2);m([v()],g.prototype,"configSaving",2);m([v()],g.prototype,"configApplying",2);m([v()],g.prototype,"updateRunning",2);m([v()],g.prototype,"applySessionKey",2);m([v()],g.prototype,"configSnapshot",2);m([v()],g.prototype,"configSchema",2);m([v()],g.prototype,"configSchemaVersion",2);m([v()],g.prototype,"configSchemaLoading",2);m([v()],g.prototype,"configUiHints",2);m([v()],g.prototype,"configForm",2);m([v()],g.prototype,"configFormOriginal",2);m([v()],g.prototype,"configFormDirty",2);m([v()],g.prototype,"configFormMode",2);m([v()],g.prototype,"configSearchQuery",2);m([v()],g.prototype,"configActiveSection",2);m([v()],g.prototype,"configActiveSubsection",2);m([v()],g.prototype,"channelsLoading",2);m([v()],g.prototype,"channelsSnapshot",2);m([v()],g.prototype,"channelsError",2);m([v()],g.prototype,"channelsLastSuccess",2);m([v()],g.prototype,"whatsappLoginMessage",2);m([v()],g.prototype,"whatsappLoginQrDataUrl",2);m([v()],g.prototype,"whatsappLoginConnected",2);m([v()],g.prototype,"whatsappBusy",2);m([v()],g.prototype,"nostrProfileFormState",2);m([v()],g.prototype,"nostrProfileAccountId",2);m([v()],g.prototype,"presenceLoading",2);m([v()],g.prototype,"presenceEntries",2);m([v()],g.prototype,"presenceError",2);m([v()],g.prototype,"presenceStatus",2);m([v()],g.prototype,"agentsLoading",2);m([v()],g.prototype,"agentsList",2);m([v()],g.prototype,"agentsError",2);m([v()],g.prototype,"sessionsLoading",2);m([v()],g.prototype,"sessionsResult",2);m([v()],g.prototype,"sessionsError",2);m([v()],g.prototype,"sessionsFilterActive",2);m([v()],g.prototype,"sessionsFilterLimit",2);m([v()],g.prototype,"sessionsIncludeGlobal",2);m([v()],g.prototype,"sessionsIncludeUnknown",2);m([v()],g.prototype,"archivedSessions",2);m([v()],g.prototype,"archivedSessionsLoading",2);m([v()],g.prototype,"archivedSessionsExpanded",2);m([v()],g.prototype,"cronLoading",2);m([v()],g.prototype,"cronJobs",2);m([v()],g.prototype,"cronStatus",2);m([v()],g.prototype,"cronError",2);m([v()],g.prototype,"cronForm",2);m([v()],g.prototype,"cronRunsJobId",2);m([v()],g.prototype,"cronRuns",2);m([v()],g.prototype,"cronBusy",2);m([v()],g.prototype,"workspaceNeedsSetup",2);m([v()],g.prototype,"onboardingPhase",2);m([v()],g.prototype,"onboardingData",2);m([v()],g.prototype,"onboardingActive",2);m([v()],g.prototype,"wizardActive",2);m([v()],g.prototype,"wizardState",2);m([v()],g.prototype,"showSetupTab",2);m([v()],g.prototype,"setupCapabilities",2);m([v()],g.prototype,"setupCapabilitiesLoading",2);m([v()],g.prototype,"setupQuickDone",2);m([v()],g.prototype,"onboardingIntegrations",2);m([v()],g.prototype,"onboardingCoreProgress",2);m([v()],g.prototype,"onboardingExpandedCard",2);m([v()],g.prototype,"onboardingLoadingGuide",2);m([v()],g.prototype,"onboardingActiveGuide",2);m([v()],g.prototype,"onboardingTestingId",2);m([v()],g.prototype,"onboardingTestResult",2);m([v()],g.prototype,"onboardingConfigValues",2);m([v()],g.prototype,"onboardingProgress",2);m([v()],g.prototype,"workspaces",2);m([v()],g.prototype,"selectedWorkspace",2);m([v()],g.prototype,"workspacesSearchQuery",2);m([v()],g.prototype,"workspaceItemSearchQuery",2);m([v()],g.prototype,"workspacesLoading",2);m([v()],g.prototype,"workspacesCreateLoading",2);m([v()],g.prototype,"workspacesError",2);m([v()],g.prototype,"workspaceExpandedFolders",2);m([v()],g.prototype,"allTasks",2);m([v()],g.prototype,"taskFilter",2);m([v()],g.prototype,"taskSort",2);m([v()],g.prototype,"taskSearch",2);m([v()],g.prototype,"showCompletedTasks",2);m([v()],g.prototype,"editingTaskId",2);m([v()],g.prototype,"workspaceBrowsePath",2);m([v()],g.prototype,"workspaceBrowseEntries",2);m([v()],g.prototype,"workspaceBreadcrumbs",2);m([v()],g.prototype,"workspaceBrowseSearchQuery",2);m([v()],g.prototype,"workspaceBrowseSearchResults",2);m([v()],g.prototype,"myDayLoading",2);m([v()],g.prototype,"myDayError",2);m([v()],g.prototype,"todaySelectedDate",2);m([v()],g.prototype,"todayViewMode",2);m([v()],g.prototype,"dailyBrief",2);m([v()],g.prototype,"dailyBriefLoading",2);m([v()],g.prototype,"dailyBriefError",2);m([v()],g.prototype,"agentLog",2);m([v()],g.prototype,"agentLogLoading",2);m([v()],g.prototype,"agentLogError",2);m([v()],g.prototype,"briefNotes",2);m([v()],g.prototype,"todayTasks",2);m([v()],g.prototype,"todayTasksLoading",2);m([v()],g.prototype,"todayEditingTaskId",2);m([v()],g.prototype,"todayShowCompleted",2);m([v()],g.prototype,"allyPanelOpen",2);m([v()],g.prototype,"allyMessages",2);m([v()],g.prototype,"allyStream",2);m([v()],g.prototype,"allyDraft",2);m([v()],g.prototype,"allyUnread",2);m([v()],g.prototype,"allySending",2);m([v()],g.prototype,"allyWorking",2);m([v()],g.prototype,"allyAttachments",2);m([v()],g.prototype,"todayQueueResults",2);m([v()],g.prototype,"inboxItems",2);m([v()],g.prototype,"inboxLoading",2);m([v()],g.prototype,"inboxCount",2);m([v()],g.prototype,"inboxScoringId",2);m([v()],g.prototype,"inboxScoringValue",2);m([v()],g.prototype,"inboxFeedbackText",2);m([v()],g.prototype,"inboxSortOrder",2);m([v()],g.prototype,"chatPrivateMode",2);m([v()],g.prototype,"privateSessions",2);m([v()],g.prototype,"dynamicSlots",2);m([v()],g.prototype,"workProjects",2);m([v()],g.prototype,"workLoading",2);m([v()],g.prototype,"workError",2);m([v()],g.prototype,"workExpandedProjects",2);m([v()],g.prototype,"workProjectFiles",2);m([v()],g.prototype,"workDetailLoading",2);m([v()],g.prototype,"workResources",2);m([v()],g.prototype,"workResourcesLoading",2);m([v()],g.prototype,"workResourceFilter",2);m([v()],g.prototype,"sessionResources",2);m([v()],g.prototype,"sessionResourcesCollapsed",2);m([v()],g.prototype,"skillsLoading",2);m([v()],g.prototype,"skillsReport",2);m([v()],g.prototype,"skillsError",2);m([v()],g.prototype,"skillsFilter",2);m([v()],g.prototype,"skillEdits",2);m([v()],g.prototype,"skillsBusyKey",2);m([v()],g.prototype,"skillMessages",2);m([v()],g.prototype,"skillsSubTab",2);m([v()],g.prototype,"godmodeSkills",2);m([v()],g.prototype,"godmodeSkillsLoading",2);m([v()],g.prototype,"expandedSkills",2);m([v()],g.prototype,"rosterData",2);m([v()],g.prototype,"rosterLoading",2);m([v()],g.prototype,"rosterError",2);m([v()],g.prototype,"rosterFilter",2);m([v()],g.prototype,"expandedAgents",2);m([v()],g.prototype,"debugLoading",2);m([v()],g.prototype,"debugStatus",2);m([v()],g.prototype,"debugHealth",2);m([v()],g.prototype,"debugModels",2);m([v()],g.prototype,"debugHeartbeat",2);m([v()],g.prototype,"debugCallMethod",2);m([v()],g.prototype,"debugCallParams",2);m([v()],g.prototype,"debugCallResult",2);m([v()],g.prototype,"debugCallError",2);m([v()],g.prototype,"logsLoading",2);m([v()],g.prototype,"logsError",2);m([v()],g.prototype,"logsFile",2);m([v()],g.prototype,"logsEntries",2);m([v()],g.prototype,"logsFilterText",2);m([v()],g.prototype,"logsLevelFilters",2);m([v()],g.prototype,"logsAutoFollow",2);m([v()],g.prototype,"logsTruncated",2);m([v()],g.prototype,"logsCursor",2);m([v()],g.prototype,"logsLastFetchAt",2);m([v()],g.prototype,"logsLimit",2);m([v()],g.prototype,"logsMaxBytes",2);m([v()],g.prototype,"logsAtBottom",2);m([v()],g.prototype,"toasts",2);m([v()],g.prototype,"chatUserNearBottom",2);m([v()],g.prototype,"chatNewMessagesBelow",2);m([v()],g.prototype,"consciousnessStatus",2);m([v()],g.prototype,"focusPulseData",2);m([v()],g.prototype,"trustTrackerData",2);m([v()],g.prototype,"trustTrackerLoading",2);m([v()],g.prototype,"guardrailsData",2);m([v()],g.prototype,"guardrailsLoading",2);m([v()],g.prototype,"guardrailsShowAddForm",2);m([v()],g.prototype,"missionControlData",2);m([v()],g.prototype,"missionControlLoading",2);m([v()],g.prototype,"missionControlError",2);m([v()],g.prototype,"missionControlFullControl",2);m([v()],g.prototype,"godmodeOptions",2);m([v()],g.prototype,"godmodeOptionsLoading",2);m([v()],g.prototype,"dashboardsList",2);m([v()],g.prototype,"dashboardsLoading",2);m([v()],g.prototype,"dashboardsError",2);m([v()],g.prototype,"activeDashboardId",2);m([v()],g.prototype,"activeDashboardHtml",2);m([v()],g.prototype,"activeDashboardManifest",2);m([v()],g.prototype,"dashboardChatOpen",2);m([v()],g.prototype,"dashboardCategoryFilter",2);m([v()],g.prototype,"secondBrainSubtab",2);m([v()],g.prototype,"secondBrainLoading",2);m([v()],g.prototype,"secondBrainError",2);m([v()],g.prototype,"secondBrainIdentity",2);m([v()],g.prototype,"secondBrainMemoryBank",2);m([v()],g.prototype,"secondBrainAiPacket",2);m([v()],g.prototype,"secondBrainSourcesData",2);m([v()],g.prototype,"secondBrainResearchData",2);m([v()],g.prototype,"secondBrainResearchAddFormOpen",2);m([v()],g.prototype,"secondBrainResearchAddForm",2);m([v()],g.prototype,"secondBrainResearchCategories",2);m([v()],g.prototype,"secondBrainSelectedEntry",2);m([v()],g.prototype,"secondBrainSearchQuery",2);m([v()],g.prototype,"secondBrainSyncing",2);m([v()],g.prototype,"secondBrainBrowsingFolder",2);m([v()],g.prototype,"secondBrainFolderEntries",2);m([v()],g.prototype,"secondBrainFolderName",2);m([v()],g.prototype,"secondBrainFileTree",2);m([v()],g.prototype,"secondBrainFileTreeLoading",2);m([v()],g.prototype,"secondBrainFileSearchQuery",2);m([v()],g.prototype,"secondBrainFileSearchResults",2);g=m([vc("godmode-app")],g);
