(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const mp="modulepreload",vp=function(e,t){return new URL(e,t).href},io={},R=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let u=function(h){return Promise.all(h.map(f=>Promise.resolve(f).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const r=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");a=u(n.map(h=>{if(h=vp(h,s),h in io)return;io[h]=!0;const f=h.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(s)for(let w=r.length-1;w>=0;w--){const S=r[w];if(S.href===h&&(!f||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${m}`))return;const g=document.createElement("link");if(g.rel=f?"stylesheet":mp,f||(g.as="script"),g.crossOrigin="",g.href=h,c&&g.setAttribute("nonce",c),document.head.appendChild(g),f)return new Promise((w,S)=>{g.addEventListener("load",w),g.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${h}`)))})}))}function i(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};const ks=globalThis,Bi=ks.ShadowRoot&&(ks.ShadyCSS===void 0||ks.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fi=Symbol(),ro=new WeakMap;let mc=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Fi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(Bi&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=ro.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ro.set(n,t))}return t}toString(){return this.cssText}};const yp=e=>new mc(typeof e=="string"?e:e+"",void 0,Fi),bp=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,a,i)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new mc(n,e,Fi)},wp=(e,t)=>{if(Bi)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),a=ks.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=n.cssText,e.appendChild(s)}},oo=Bi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return yp(n)})(e):e;const{is:kp,defineProperty:$p,getOwnPropertyDescriptor:Sp,getOwnPropertyNames:Ap,getOwnPropertySymbols:Tp,getPrototypeOf:xp}=Object,Qs=globalThis,lo=Qs.trustedTypes,_p=lo?lo.emptyScript:"",Cp=Qs.reactiveElementPolyfillSupport,Mn=(e,t)=>e,Es={toAttribute(e,t){switch(t){case Boolean:e=e?_p:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Ui=(e,t)=>!kp(e,t),co={attribute:!0,type:String,converter:Es,reflect:!1,useDefault:!1,hasChanged:Ui};Symbol.metadata??=Symbol("metadata"),Qs.litPropertyMetadata??=new WeakMap;let Yt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=co){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(t,s,n);a!==void 0&&$p(this.prototype,t,a)}}static getPropertyDescriptor(t,n,s){const{get:a,set:i}=Sp(this.prototype,t)??{get(){return this[n]},set(r){this[n]=r}};return{get:a,set(r){const l=a?.call(this);i?.call(this,r),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??co}static _$Ei(){if(this.hasOwnProperty(Mn("elementProperties")))return;const t=xp(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Mn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Mn("properties"))){const n=this.properties,s=[...Ap(n),...Tp(n)];for(const a of s)this.createProperty(a,n[a])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,a]of n)this.elementProperties.set(s,a)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const a=this._$Eu(n,s);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const a of s)n.unshift(oo(a))}else t!==void 0&&n.push(oo(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wp(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,s);if(a!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:Es).toAttribute(n,s.type);this._$Em=t,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(t,n){const s=this.constructor,a=s._$Eh.get(t);if(a!==void 0&&this._$Em!==a){const i=s.getPropertyOptions(a),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Es;this._$Em=a;const l=r.fromAttribute(n,i.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,s,a=!1,i){if(t!==void 0){const r=this.constructor;if(a===!1&&(i=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??Ui)(i,n)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:a,wrapped:i},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??n??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[a,i]of s){const{wrapped:r}=i,l=this[a];r!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,i,l)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Yt.elementStyles=[],Yt.shadowRootOptions={mode:"open"},Yt[Mn("elementProperties")]=new Map,Yt[Mn("finalized")]=new Map,Cp?.({ReactiveElement:Yt}),(Qs.reactiveElementVersions??=[]).push("2.1.2");const zi=globalThis,uo=e=>e,Rs=zi.trustedTypes,po=Rs?Rs.createPolicy("lit-html",{createHTML:e=>e}):void 0,vc="$lit$",ot=`lit$${Math.random().toFixed(9).slice(2)}$`,yc="?"+ot,Lp=`<${yc}>`,Et=document,Un=()=>Et.createComment(""),zn=e=>e===null||typeof e!="object"&&typeof e!="function",Ki=Array.isArray,Ep=e=>Ki(e)||typeof e?.[Symbol.iterator]=="function",Ea=`[ 	
\f\r]`,wn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ho=/-->/g,fo=/>/g,vt=RegExp(`>|${Ea}(?:([^\\s"'>=/]+)(${Ea}*=${Ea}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),go=/'/g,mo=/"/g,bc=/^(?:script|style|textarea|title)$/i,wc=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),o=wc(1),ds=wc(2),ut=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),vo=new WeakMap,Ct=Et.createTreeWalker(Et,129);function kc(e,t){if(!Ki(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return po!==void 0?po.createHTML(t):t}const Rp=(e,t)=>{const n=e.length-1,s=[];let a,i=t===2?"<svg>":t===3?"<math>":"",r=wn;for(let l=0;l<n;l++){const c=e[l];let u,h,f=-1,m=0;for(;m<c.length&&(r.lastIndex=m,h=r.exec(c),h!==null);)m=r.lastIndex,r===wn?h[1]==="!--"?r=ho:h[1]!==void 0?r=fo:h[2]!==void 0?(bc.test(h[2])&&(a=RegExp("</"+h[2],"g")),r=vt):h[3]!==void 0&&(r=vt):r===vt?h[0]===">"?(r=a??wn,f=-1):h[1]===void 0?f=-2:(f=r.lastIndex-h[2].length,u=h[1],r=h[3]===void 0?vt:h[3]==='"'?mo:go):r===mo||r===go?r=vt:r===ho||r===fo?r=wn:(r=vt,a=void 0);const g=r===vt&&e[l+1].startsWith("/>")?" ":"";i+=r===wn?c+Lp:f>=0?(s.push(u),c.slice(0,f)+vc+c.slice(f)+ot+g):c+ot+(f===-2?l:g)}return[kc(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Kn{constructor({strings:t,_$litType$:n},s){let a;this.parts=[];let i=0,r=0;const l=t.length-1,c=this.parts,[u,h]=Rp(t,n);if(this.el=Kn.createElement(u,s),Ct.currentNode=this.el.content,n===2||n===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(a=Ct.nextNode())!==null&&c.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(const f of a.getAttributeNames())if(f.endsWith(vc)){const m=h[r++],g=a.getAttribute(f).split(ot),w=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:w[2],strings:g,ctor:w[1]==="."?Pp:w[1]==="?"?Mp:w[1]==="@"?Dp:Xs}),a.removeAttribute(f)}else f.startsWith(ot)&&(c.push({type:6,index:i}),a.removeAttribute(f));if(bc.test(a.tagName)){const f=a.textContent.split(ot),m=f.length-1;if(m>0){a.textContent=Rs?Rs.emptyScript:"";for(let g=0;g<m;g++)a.append(f[g],Un()),Ct.nextNode(),c.push({type:2,index:++i});a.append(f[m],Un())}}}else if(a.nodeType===8)if(a.data===yc)c.push({type:2,index:i});else{let f=-1;for(;(f=a.data.indexOf(ot,f+1))!==-1;)c.push({type:7,index:i}),f+=ot.length-1}i++}}static createElement(t,n){const s=Et.createElement("template");return s.innerHTML=t,s}}function nn(e,t,n=e,s){if(t===ut)return t;let a=s!==void 0?n._$Co?.[s]:n._$Cl;const i=zn(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),i===void 0?a=void 0:(a=new i(e),a._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=a:n._$Cl=a),a!==void 0&&(t=nn(e,a._$AS(e,t.values),a,s)),t}class Ip{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,a=(t?.creationScope??Et).importNode(n,!0);Ct.currentNode=a;let i=Ct.nextNode(),r=0,l=0,c=s[0];for(;c!==void 0;){if(r===c.index){let u;c.type===2?u=new Ys(i,i.nextSibling,this,t):c.type===1?u=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(u=new Op(i,this,t)),this._$AV.push(u),c=s[++l]}r!==c?.index&&(i=Ct.nextNode(),r++)}return Ct.currentNode=Et,a}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Ys=class $c{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,a){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=nn(this,t,n),zn(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ep(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&zn(this._$AH)?this._$AA.nextSibling.data=t:this.T(Et.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,a=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Kn.createElement(kc(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(n);else{const i=new Ip(a,this),r=i.u(this.options);i.p(n),this.T(r),this._$AH=i}}_$AC(t){let n=vo.get(t.strings);return n===void 0&&vo.set(t.strings,n=new Kn(t)),n}k(t){Ki(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,a=0;for(const i of t)a===n.length?n.push(s=new $c(this.O(Un()),this.O(Un()),this,this.options)):s=n[a],s._$AI(i),a++;a<n.length&&(this._$AR(s&&s._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=uo(t).nextSibling;uo(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Xs=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,a,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,n=this,s,a){const i=this.strings;let r=!1;if(i===void 0)t=nn(this,t,n,0),r=!zn(t)||t!==this._$AH&&t!==ut,r&&(this._$AH=t);else{const l=t;let c,u;for(t=i[0],c=0;c<i.length-1;c++)u=nn(this,l[s+c],n,c),u===ut&&(u=this._$AH[c]),r||=!zn(u)||u!==this._$AH[c],u===p?t=p:t!==p&&(t+=(u??"")+i[c+1]),this._$AH[c]=u}r&&!a&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Pp=class extends Xs{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},Mp=class extends Xs{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Dp=class extends Xs{constructor(t,n,s,a,i){super(t,n,s,a,i),this.type=5}_$AI(t,n=this){if((t=nn(this,t,n,0)??p)===ut)return;const s=this._$AH,a=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==p&&(s===p||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Op=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nn(this,t)}};const Np={I:Ys},Bp=zi.litHtmlPolyfillSupport;Bp?.(Kn,Ys),(zi.litHtmlVersions??=[]).push("3.3.2");const Fp=(e,t,n)=>{const s=n?.renderBefore??t;let a=s._$litPart$;if(a===void 0){const i=n?.renderBefore??null;s._$litPart$=a=new Ys(t.insertBefore(Un(),i),i,void 0,n??{})}return a._$AI(e),a};const Wi=globalThis;let en=class extends Yt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fp(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ut}};en._$litElement$=!0,en.finalized=!0,Wi.litElementHydrateSupport?.({LitElement:en});const Up=Wi.litElementPolyfillSupport;Up?.({LitElement:en});(Wi.litElementVersions??=[]).push("4.2.2");const Sc=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const zp={attribute:!0,type:String,converter:Es,reflect:!1,hasChanged:Ui},Kp=(e=zp,t,n)=>{const{kind:s,metadata:a}=n;let i=globalThis.litPropertyMetadata.get(a);if(i===void 0&&globalThis.litPropertyMetadata.set(a,i=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(n.name,e),s==="accessor"){const{name:r}=n;return{set(l){const c=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,c,e,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,e,l),l}}}if(s==="setter"){const{name:r}=n;return function(l){const c=this[r];t.call(this,l),this.requestUpdate(r,c,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function Js(e){return(t,n)=>typeof n=="object"?Kp(e,t,n):((s,a,i)=>{const r=a.hasOwnProperty(i);return a.constructor.createProperty(i,s),r?Object.getOwnPropertyDescriptor(a,i):void 0})(e,t,n)}function b(e){return Js({...e,state:!0,attribute:!1})}async function Pe(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function Wp(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function qp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Hp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Rt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function sn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Ac(e,t,n){if(t.length===0)return;let s=e;for(let i=0;i<t.length-1;i+=1){const r=t[i],l=t[i+1];if(typeof r=="number"){if(!Array.isArray(s))return;s[r]==null&&(s[r]=typeof l=="number"?[]:{}),s=s[r]}else{if(typeof s!="object"||s==null)return;const c=s;c[r]==null&&(c[r]=typeof l=="number"?[]:{}),s=c[r]}}const a=t[t.length-1];if(typeof a=="number"){Array.isArray(s)&&(s[a]=n);return}typeof s=="object"&&s!=null&&(s[a]=n)}function Tc(e,t){if(t.length===0)return;let n=e;for(let a=0;a<t.length-1;a+=1){const i=t[a];if(typeof i=="number"){if(!Array.isArray(n))return;n=n[i]}else{if(typeof n!="object"||n==null)return;n=n[i]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Qe(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Vp(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function xc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});jp(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function jp(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Vp(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?sn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=sn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Rt(t.config??{}),e.configFormOriginal=Rt(t.config??{}),e.configRawOriginal=n)}async function di(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?sn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Qe(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function Gp(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?sn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Qe(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function yo(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function us(e,t,n){const s=Rt(e.configForm??e.configSnapshot?.config??{});Ac(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=sn(s))}function bo(e,t){const n=Rt(e.configForm??e.configSnapshot?.config??{});Tc(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=sn(n))}function Qp(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Yp(e){const{state:t,callbacks:n,accountId:s}=e,a=Qp(t),i=(l,c,u={})=>{const{type:h="text",placeholder:f,maxLength:m,help:g}=u,w=t.values[l]??"",S=t.fieldErrors[l],T=`nostr-profile-${l}`;return h==="textarea"?o`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${T}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${c}
          </label>
          <textarea
            id="${T}"
            .value=${w}
            placeholder=${f??""}
            maxlength=${m??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${_=>{const d=_.target;n.onFieldChange(l,d.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${g?o`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${g}</div>`:p}
          ${S?o`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${S}</div>`:p}
        </div>
      `:o`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${T}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${c}
        </label>
        <input
          id="${T}"
          type=${h}
          .value=${w}
          placeholder=${f??""}
          maxlength=${m??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${_=>{const d=_.target;n.onFieldChange(l,d.value)}}
          ?disabled=${t.saving}
        />
        ${g?o`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${g}</div>`:p}
        ${S?o`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${S}</div>`:p}
      </div>
    `},r=()=>{const l=t.values.picture;return l?o`
      <div style="margin-bottom: 12px;">
        <img
          src=${l}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${c=>{const u=c.target;u.style.display="none"}}
          @load=${c=>{const u=c.target;u.style.display="block"}}
        />
      </div>
    `:p};return o`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?o`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:p}

      ${t.success?o`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:p}

      ${r()}

      ${i("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${i("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${i("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${i("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?o`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${i("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${i("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${i("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${i("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:p}

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

      ${a?o`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:p}
    </div>
  `}function Xp(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Jp(e,t){await Wp(e,t),await Pe(e,!0)}async function Zp(e){await qp(e),await Pe(e,!0)}async function eh(e){await Hp(e),await Pe(e,!0)}async function th(e){await di(e),await Qe(e),await Pe(e,!0)}async function nh(e){await Qe(e),await Pe(e,!0)}function sh(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...a]=n.split(":");if(!s||a.length===0)continue;const i=s.trim(),r=a.join(":").trim();i&&r&&(t[i]=r)}return t}function _c(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Cc(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function ah(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=Xp(n??void 0)}function ih(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function rh(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function oh(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function lh(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=_c(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Cc(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const i=a?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:i,success:null,fieldErrors:sh(a?.details)};return}if(!a.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Pe(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function ch(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=_c(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Cc(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const c=a?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const i=a.merged??a.imported??null,r=i?{...t.values,...i}:t.values,l=!!(r.banner||r.website||r.nip05||r.lud16);e.nostrProfileFormState={...t,importing:!1,values:r,error:null,success:a.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},a.saved&&await Pe(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Lc(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),a=n.slice(2).join(":");return!s||!a?null:{agentId:s,rest:a}}const dh=80;function an(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const a=getComputedStyle(s).overflowY;if(a==="auto"||a==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;s.scrollHeight-s.scrollTop-s.clientHeight;const a=t&&!e.chatHasAutoScrolled;if(!(a||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}a&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const r=a?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const l=n();!l||!(a||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,l.scrollTop=l.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},r)})})}function Ec(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function uh(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<dh?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function ph(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Rc(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function hh(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),a=document.createElement("a"),i=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");a.href=s,a.download=`godmode-logs-${t}-${i}.log`,a.click(),URL.revokeObjectURL(s)}function fh(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const gh=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,ps=/<\s*\/?\s*final\b[^>]*>/gi,wo=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function mh(e,t){return e.trimStart()}function vh(e,t){if(!e||!gh.test(e))return e;let n=e;ps.test(n)?(ps.lastIndex=0,n=n.replace(ps,"")):ps.lastIndex=0,wo.lastIndex=0;let s="",a=0,i=!1;for(const r of n.matchAll(wo)){const l=r.index??0,c=r[1]==="/";i?c&&(i=!1):(s+=n.slice(a,l),c||(i=!0)),a=l+r[0].length}return s+=n.slice(a),mh(s)}function Wn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function K(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const a=Math.round(s/60);return a<48?`${a}h ago`:`${Math.round(a/24)}d ago`}function yh(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const a=Math.round(s/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function qi(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function ui(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function qn(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Ic(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Is(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function te(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${a}`}function Ra(e){return vh(e)}const ko=50,bh=80,wh=12e4;function oe(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function re(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function $o(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${oe(re(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${oe(re(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${oe(re(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${oe(re(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${oe(re(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(re(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return oe(re(n.url||""),50)}case"memory_search":return n.query?`"${oe(re(n.query),45)}"`:"";case"browser":const s=re(n.action),a=n.ref?` #${re(n.ref)}`:"",i=n.targetUrl?` ${oe(re(n.targetUrl),30)}`:"";return`${s}${a}${i}`;case"message":return n.action?`${re(n.action)}${n.target?` → ${oe(re(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${oe(re(n.task),40)}"`:"";case"cron":return n.action?re(n.action):"";case"files_read":return n.fileId?`file:${oe(re(n.fileId),20)}`:"";case"image":return n.image?oe(re(n.image),40):"";default:const r=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(r.length===0)return"";const l=r[0],c=n[l];return typeof c=="string"?`${l}: ${oe(c,35)}`:""}}function So(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),a=s.length,i=t.length;if(["read","files_read"].includes(n))return`${i.toLocaleString()} chars${a>1?`, ${a} lines`:""}`;if(n==="exec")return a>1?`${a} lines`:oe(s[0],50);if(["web_search","memory_search"].includes(n))try{const r=JSON.parse(t),l=r.results?.length??r.count??0;return`${l} result${l!==1?"s":""}`}catch{return oe(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":oe(t,40):i>100?`${i.toLocaleString()} chars`:oe(t,50)}function Ao(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function kh(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(a=>{if(!a||typeof a!="object")return null;const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>!!a);return s.length===0?null:s.join(`
`)}function To(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=kh(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Ic(n,wh);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function $h(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Sh(e){if(e.toolStreamOrder.length<=ko)return;const t=e.toolStreamOrder.length-ko,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Ah(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function pi(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Ah(e)}function Th(e,t=!1){if(t){pi(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>pi(e),bh))}function Hi(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),pi(e)}const xh=5e3;function _h(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},xh))}function Ch(e,t){if(!t)return;if(t.stream==="compaction"){_h(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},a=typeof s.toolCallId=="string"?s.toolCallId:"";if(!a)return;const i=typeof s.name=="string"?s.name:"tool",r=typeof s.phase=="string"?s.phase:"",l=r==="start"?s.args:void 0,c=r==="update"?To(s.partialResult):r==="result"?To(s.result):void 0,u=Date.now();let h=e.toolStreamById.get(a);h?(h.name=i,l!==void 0&&(h.args=l,h.displayArgs=$o(i,l)),c!==void 0&&(h.output=c,h.resultSummary=So(i,c),h.success=Ao(c)),h.updatedAt=u):(h={toolCallId:a,runId:t.runId,sessionKey:n,name:i,args:l,output:c,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:l?$o(i,l):void 0},e.toolStreamById.set(a,h),e.toolStreamOrder.push(a)),r==="start"?(e.currentToolName=i,e.currentToolInfo={name:i,details:h.displayArgs||void 0,startedAt:h.startedAt}):r==="result"&&(e.currentToolName=null,e.currentToolInfo=null,h.completedAt=u,h.resultSummary=So(i,h.output),h.success=Ao(h.output)),h.message=$h(h),Sh(e),Th(e,r==="result")}const ji={CHILD:2},Vi=e=>(...t)=>({_$litDirective$:e,values:t});let Gi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class hi extends Gi{constructor(t){if(super(t),this.it=p,t.type!==ji.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===p||t==null)return this._t=void 0,this.it=t;if(t===ut)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}hi.directiveName="unsafeHTML",hi.resultType=1;const _e=Vi(hi);const{entries:Pc,setPrototypeOf:xo,isFrozen:Lh,getPrototypeOf:Eh,getOwnPropertyDescriptor:Rh}=Object;let{freeze:fe,seal:Ce,create:fi}=Object,{apply:gi,construct:mi}=typeof Reflect<"u"&&Reflect;fe||(fe=function(t){return t});Ce||(Ce=function(t){return t});gi||(gi=function(t,n){for(var s=arguments.length,a=new Array(s>2?s-2:0),i=2;i<s;i++)a[i-2]=arguments[i];return t.apply(n,a)});mi||(mi=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return new t(...s)});const hs=ge(Array.prototype.forEach),Ih=ge(Array.prototype.lastIndexOf),_o=ge(Array.prototype.pop),kn=ge(Array.prototype.push),Ph=ge(Array.prototype.splice),$s=ge(String.prototype.toLowerCase),Ia=ge(String.prototype.toString),Pa=ge(String.prototype.match),$n=ge(String.prototype.replace),Mh=ge(String.prototype.indexOf),Dh=ge(String.prototype.trim),Le=ge(Object.prototype.hasOwnProperty),ue=ge(RegExp.prototype.test),Sn=Oh(TypeError);function ge(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return gi(e,t,s)}}function Oh(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return mi(e,n)}}function U(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:$s;xo&&xo(e,null);let s=t.length;for(;s--;){let a=t[s];if(typeof a=="string"){const i=n(a);i!==a&&(Lh(t)||(t[s]=i),a=i)}e[a]=!0}return e}function Nh(e){for(let t=0;t<e.length;t++)Le(e,t)||(e[t]=null);return e}function Be(e){const t=fi(null);for(const[n,s]of Pc(e))Le(e,n)&&(Array.isArray(s)?t[n]=Nh(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=Be(s):t[n]=s);return t}function An(e,t){for(;e!==null;){const s=Rh(e,t);if(s){if(s.get)return ge(s.get);if(typeof s.value=="function")return ge(s.value)}e=Eh(e)}function n(){return null}return n}const Co=fe(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ma=fe(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Da=fe(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Bh=fe(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Oa=fe(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Fh=fe(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Lo=fe(["#text"]),Eo=fe(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Na=fe(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Ro=fe(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),fs=fe(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Uh=Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm),zh=Ce(/<%[\w\W]*|[\w\W]*%>/gm),Kh=Ce(/\$\{[\w\W]*/gm),Wh=Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/),qh=Ce(/^aria-[\-\w]+$/),Mc=Ce(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Hh=Ce(/^(?:\w+script|data):/i),jh=Ce(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Dc=Ce(/^html$/i),Vh=Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);var Io=Object.freeze({__proto__:null,ARIA_ATTR:qh,ATTR_WHITESPACE:jh,CUSTOM_ELEMENT:Vh,DATA_ATTR:Wh,DOCTYPE_NAME:Dc,ERB_EXPR:zh,IS_ALLOWED_URI:Mc,IS_SCRIPT_OR_DATA:Hh,MUSTACHE_EXPR:Uh,TMPLIT_EXPR:Kh});const Tn={element:1,text:3,progressingInstruction:7,comment:8,document:9},Gh=function(){return typeof window>"u"?null:window},Qh=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const a="data-tt-policy-suffix";n&&n.hasAttribute(a)&&(s=n.getAttribute(a));const i="dompurify"+(s?"#"+s:"");try{return t.createPolicy(i,{createHTML(r){return r},createScriptURL(r){return r}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Po=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Oc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Gh();const t=O=>Oc(O);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Tn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,a=s.currentScript,{DocumentFragment:i,HTMLTemplateElement:r,Node:l,Element:c,NodeFilter:u,NamedNodeMap:h=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:f,DOMParser:m,trustedTypes:g}=e,w=c.prototype,S=An(w,"cloneNode"),T=An(w,"remove"),_=An(w,"nextSibling"),d=An(w,"childNodes"),$=An(w,"parentNode");if(typeof r=="function"){const O=n.createElement("template");O.content&&O.content.ownerDocument&&(n=O.content.ownerDocument)}let A,x="";const{implementation:L,createNodeIterator:E,createDocumentFragment:z,getElementsByTagName:V}=n,{importNode:H}=s;let j=Po();t.isSupported=typeof Pc=="function"&&typeof $=="function"&&L&&L.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:ae,ERB_EXPR:me,TMPLIT_EXPR:D,DATA_ATTR:I,ARIA_ATTR:F,IS_SCRIPT_OR_DATA:X,ATTR_WHITESPACE:N,CUSTOM_ELEMENT:Me}=Io;let{IS_ALLOWED_URI:ke}=Io,B=null;const gn=U({},[...Co,...Ma,...Da,...Oa,...Lo]);let J=null;const mn=U({},[...Eo,...Na,...Ro,...fs]);let G=Object.seal(fi(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),tt=null,ft=null;const nt=Object.seal(fi(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let vn=!0,Ut=!0,ba=!1,zr=!0,zt=!1,ss=!0,gt=!1,wa=!1,ka=!1,Kt=!1,as=!1,is=!1,Kr=!0,Wr=!1;const lp="user-content-";let $a=!0,yn=!1,Wt={},De=null;const Sa=U({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let qr=null;const Hr=U({},["audio","video","img","source","image","track"]);let Aa=null;const jr=U({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),rs="http://www.w3.org/1998/Math/MathML",os="http://www.w3.org/2000/svg",qe="http://www.w3.org/1999/xhtml";let qt=qe,Ta=!1,xa=null;const cp=U({},[rs,os,qe],Ia);let ls=U({},["mi","mo","mn","ms","mtext"]),cs=U({},["annotation-xml"]);const dp=U({},["title","style","font","a","script"]);let bn=null;const up=["application/xhtml+xml","text/html"],pp="text/html";let ee=null,Ht=null;const hp=n.createElement("form"),Vr=function(k){return k instanceof RegExp||k instanceof Function},_a=function(){let k=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Ht&&Ht===k)){if((!k||typeof k!="object")&&(k={}),k=Be(k),bn=up.indexOf(k.PARSER_MEDIA_TYPE)===-1?pp:k.PARSER_MEDIA_TYPE,ee=bn==="application/xhtml+xml"?Ia:$s,B=Le(k,"ALLOWED_TAGS")?U({},k.ALLOWED_TAGS,ee):gn,J=Le(k,"ALLOWED_ATTR")?U({},k.ALLOWED_ATTR,ee):mn,xa=Le(k,"ALLOWED_NAMESPACES")?U({},k.ALLOWED_NAMESPACES,Ia):cp,Aa=Le(k,"ADD_URI_SAFE_ATTR")?U(Be(jr),k.ADD_URI_SAFE_ATTR,ee):jr,qr=Le(k,"ADD_DATA_URI_TAGS")?U(Be(Hr),k.ADD_DATA_URI_TAGS,ee):Hr,De=Le(k,"FORBID_CONTENTS")?U({},k.FORBID_CONTENTS,ee):Sa,tt=Le(k,"FORBID_TAGS")?U({},k.FORBID_TAGS,ee):Be({}),ft=Le(k,"FORBID_ATTR")?U({},k.FORBID_ATTR,ee):Be({}),Wt=Le(k,"USE_PROFILES")?k.USE_PROFILES:!1,vn=k.ALLOW_ARIA_ATTR!==!1,Ut=k.ALLOW_DATA_ATTR!==!1,ba=k.ALLOW_UNKNOWN_PROTOCOLS||!1,zr=k.ALLOW_SELF_CLOSE_IN_ATTR!==!1,zt=k.SAFE_FOR_TEMPLATES||!1,ss=k.SAFE_FOR_XML!==!1,gt=k.WHOLE_DOCUMENT||!1,Kt=k.RETURN_DOM||!1,as=k.RETURN_DOM_FRAGMENT||!1,is=k.RETURN_TRUSTED_TYPE||!1,ka=k.FORCE_BODY||!1,Kr=k.SANITIZE_DOM!==!1,Wr=k.SANITIZE_NAMED_PROPS||!1,$a=k.KEEP_CONTENT!==!1,yn=k.IN_PLACE||!1,ke=k.ALLOWED_URI_REGEXP||Mc,qt=k.NAMESPACE||qe,ls=k.MATHML_TEXT_INTEGRATION_POINTS||ls,cs=k.HTML_INTEGRATION_POINTS||cs,G=k.CUSTOM_ELEMENT_HANDLING||{},k.CUSTOM_ELEMENT_HANDLING&&Vr(k.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(G.tagNameCheck=k.CUSTOM_ELEMENT_HANDLING.tagNameCheck),k.CUSTOM_ELEMENT_HANDLING&&Vr(k.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(G.attributeNameCheck=k.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),k.CUSTOM_ELEMENT_HANDLING&&typeof k.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(G.allowCustomizedBuiltInElements=k.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),zt&&(Ut=!1),as&&(Kt=!0),Wt&&(B=U({},Lo),J=[],Wt.html===!0&&(U(B,Co),U(J,Eo)),Wt.svg===!0&&(U(B,Ma),U(J,Na),U(J,fs)),Wt.svgFilters===!0&&(U(B,Da),U(J,Na),U(J,fs)),Wt.mathMl===!0&&(U(B,Oa),U(J,Ro),U(J,fs))),k.ADD_TAGS&&(typeof k.ADD_TAGS=="function"?nt.tagCheck=k.ADD_TAGS:(B===gn&&(B=Be(B)),U(B,k.ADD_TAGS,ee))),k.ADD_ATTR&&(typeof k.ADD_ATTR=="function"?nt.attributeCheck=k.ADD_ATTR:(J===mn&&(J=Be(J)),U(J,k.ADD_ATTR,ee))),k.ADD_URI_SAFE_ATTR&&U(Aa,k.ADD_URI_SAFE_ATTR,ee),k.FORBID_CONTENTS&&(De===Sa&&(De=Be(De)),U(De,k.FORBID_CONTENTS,ee)),k.ADD_FORBID_CONTENTS&&(De===Sa&&(De=Be(De)),U(De,k.ADD_FORBID_CONTENTS,ee)),$a&&(B["#text"]=!0),gt&&U(B,["html","head","body"]),B.table&&(U(B,["tbody"]),delete tt.tbody),k.TRUSTED_TYPES_POLICY){if(typeof k.TRUSTED_TYPES_POLICY.createHTML!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof k.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');A=k.TRUSTED_TYPES_POLICY,x=A.createHTML("")}else A===void 0&&(A=Qh(g,a)),A!==null&&typeof x=="string"&&(x=A.createHTML(""));fe&&fe(k),Ht=k}},Gr=U({},[...Ma,...Da,...Bh]),Qr=U({},[...Oa,...Fh]),fp=function(k){let C=$(k);(!C||!C.tagName)&&(C={namespaceURI:qt,tagName:"template"});const M=$s(k.tagName),Q=$s(C.tagName);return xa[k.namespaceURI]?k.namespaceURI===os?C.namespaceURI===qe?M==="svg":C.namespaceURI===rs?M==="svg"&&(Q==="annotation-xml"||ls[Q]):!!Gr[M]:k.namespaceURI===rs?C.namespaceURI===qe?M==="math":C.namespaceURI===os?M==="math"&&cs[Q]:!!Qr[M]:k.namespaceURI===qe?C.namespaceURI===os&&!cs[Q]||C.namespaceURI===rs&&!ls[Q]?!1:!Qr[M]&&(dp[M]||!Gr[M]):!!(bn==="application/xhtml+xml"&&xa[k.namespaceURI]):!1},Oe=function(k){kn(t.removed,{element:k});try{$(k).removeChild(k)}catch{T(k)}},mt=function(k,C){try{kn(t.removed,{attribute:C.getAttributeNode(k),from:C})}catch{kn(t.removed,{attribute:null,from:C})}if(C.removeAttribute(k),k==="is")if(Kt||as)try{Oe(C)}catch{}else try{C.setAttribute(k,"")}catch{}},Yr=function(k){let C=null,M=null;if(ka)k="<remove></remove>"+k;else{const Z=Pa(k,/^[\r\n\t ]+/);M=Z&&Z[0]}bn==="application/xhtml+xml"&&qt===qe&&(k='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+k+"</body></html>");const Q=A?A.createHTML(k):k;if(qt===qe)try{C=new m().parseFromString(Q,bn)}catch{}if(!C||!C.documentElement){C=L.createDocument(qt,"template",null);try{C.documentElement.innerHTML=Ta?x:Q}catch{}}const ce=C.body||C.documentElement;return k&&M&&ce.insertBefore(n.createTextNode(M),ce.childNodes[0]||null),qt===qe?V.call(C,gt?"html":"body")[0]:gt?C.documentElement:ce},Xr=function(k){return E.call(k.ownerDocument||k,k,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Ca=function(k){return k instanceof f&&(typeof k.nodeName!="string"||typeof k.textContent!="string"||typeof k.removeChild!="function"||!(k.attributes instanceof h)||typeof k.removeAttribute!="function"||typeof k.setAttribute!="function"||typeof k.namespaceURI!="string"||typeof k.insertBefore!="function"||typeof k.hasChildNodes!="function")},Jr=function(k){return typeof l=="function"&&k instanceof l};function He(O,k,C){hs(O,M=>{M.call(t,k,C,Ht)})}const Zr=function(k){let C=null;if(He(j.beforeSanitizeElements,k,null),Ca(k))return Oe(k),!0;const M=ee(k.nodeName);if(He(j.uponSanitizeElement,k,{tagName:M,allowedTags:B}),ss&&k.hasChildNodes()&&!Jr(k.firstElementChild)&&ue(/<[/\w!]/g,k.innerHTML)&&ue(/<[/\w!]/g,k.textContent)||k.nodeType===Tn.progressingInstruction||ss&&k.nodeType===Tn.comment&&ue(/<[/\w]/g,k.data))return Oe(k),!0;if(!(nt.tagCheck instanceof Function&&nt.tagCheck(M))&&(!B[M]||tt[M])){if(!tt[M]&&to(M)&&(G.tagNameCheck instanceof RegExp&&ue(G.tagNameCheck,M)||G.tagNameCheck instanceof Function&&G.tagNameCheck(M)))return!1;if($a&&!De[M]){const Q=$(k)||k.parentNode,ce=d(k)||k.childNodes;if(ce&&Q){const Z=ce.length;for(let ve=Z-1;ve>=0;--ve){const je=S(ce[ve],!0);je.__removalCount=(k.__removalCount||0)+1,Q.insertBefore(je,_(k))}}}return Oe(k),!0}return k instanceof c&&!fp(k)||(M==="noscript"||M==="noembed"||M==="noframes")&&ue(/<\/no(script|embed|frames)/i,k.innerHTML)?(Oe(k),!0):(zt&&k.nodeType===Tn.text&&(C=k.textContent,hs([ae,me,D],Q=>{C=$n(C,Q," ")}),k.textContent!==C&&(kn(t.removed,{element:k.cloneNode()}),k.textContent=C)),He(j.afterSanitizeElements,k,null),!1)},eo=function(k,C,M){if(Kr&&(C==="id"||C==="name")&&(M in n||M in hp))return!1;if(!(Ut&&!ft[C]&&ue(I,C))){if(!(vn&&ue(F,C))){if(!(nt.attributeCheck instanceof Function&&nt.attributeCheck(C,k))){if(!J[C]||ft[C]){if(!(to(k)&&(G.tagNameCheck instanceof RegExp&&ue(G.tagNameCheck,k)||G.tagNameCheck instanceof Function&&G.tagNameCheck(k))&&(G.attributeNameCheck instanceof RegExp&&ue(G.attributeNameCheck,C)||G.attributeNameCheck instanceof Function&&G.attributeNameCheck(C,k))||C==="is"&&G.allowCustomizedBuiltInElements&&(G.tagNameCheck instanceof RegExp&&ue(G.tagNameCheck,M)||G.tagNameCheck instanceof Function&&G.tagNameCheck(M))))return!1}else if(!Aa[C]){if(!ue(ke,$n(M,N,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&k!=="script"&&Mh(M,"data:")===0&&qr[k])){if(!(ba&&!ue(X,$n(M,N,"")))){if(M)return!1}}}}}}}return!0},to=function(k){return k!=="annotation-xml"&&Pa(k,Me)},no=function(k){He(j.beforeSanitizeAttributes,k,null);const{attributes:C}=k;if(!C||Ca(k))return;const M={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:J,forceKeepAttr:void 0};let Q=C.length;for(;Q--;){const ce=C[Q],{name:Z,namespaceURI:ve,value:je}=ce,jt=ee(Z),La=je;let ie=Z==="value"?La:Dh(La);if(M.attrName=jt,M.attrValue=ie,M.keepAttr=!0,M.forceKeepAttr=void 0,He(j.uponSanitizeAttribute,k,M),ie=M.attrValue,Wr&&(jt==="id"||jt==="name")&&(mt(Z,k),ie=lp+ie),ss&&ue(/((--!?|])>)|<\/(style|title|textarea)/i,ie)){mt(Z,k);continue}if(jt==="attributename"&&Pa(ie,"href")){mt(Z,k);continue}if(M.forceKeepAttr)continue;if(!M.keepAttr){mt(Z,k);continue}if(!zr&&ue(/\/>/i,ie)){mt(Z,k);continue}zt&&hs([ae,me,D],ao=>{ie=$n(ie,ao," ")});const so=ee(k.nodeName);if(!eo(so,jt,ie)){mt(Z,k);continue}if(A&&typeof g=="object"&&typeof g.getAttributeType=="function"&&!ve)switch(g.getAttributeType(so,jt)){case"TrustedHTML":{ie=A.createHTML(ie);break}case"TrustedScriptURL":{ie=A.createScriptURL(ie);break}}if(ie!==La)try{ve?k.setAttributeNS(ve,Z,ie):k.setAttribute(Z,ie),Ca(k)?Oe(k):_o(t.removed)}catch{mt(Z,k)}}He(j.afterSanitizeAttributes,k,null)},gp=function O(k){let C=null;const M=Xr(k);for(He(j.beforeSanitizeShadowDOM,k,null);C=M.nextNode();)He(j.uponSanitizeShadowNode,C,null),Zr(C),no(C),C.content instanceof i&&O(C.content);He(j.afterSanitizeShadowDOM,k,null)};return t.sanitize=function(O){let k=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,M=null,Q=null,ce=null;if(Ta=!O,Ta&&(O="<!-->"),typeof O!="string"&&!Jr(O))if(typeof O.toString=="function"){if(O=O.toString(),typeof O!="string")throw Sn("dirty is not a string, aborting")}else throw Sn("toString is not a function");if(!t.isSupported)return O;if(wa||_a(k),t.removed=[],typeof O=="string"&&(yn=!1),yn){if(O.nodeName){const je=ee(O.nodeName);if(!B[je]||tt[je])throw Sn("root node is forbidden and cannot be sanitized in-place")}}else if(O instanceof l)C=Yr("<!---->"),M=C.ownerDocument.importNode(O,!0),M.nodeType===Tn.element&&M.nodeName==="BODY"||M.nodeName==="HTML"?C=M:C.appendChild(M);else{if(!Kt&&!zt&&!gt&&O.indexOf("<")===-1)return A&&is?A.createHTML(O):O;if(C=Yr(O),!C)return Kt?null:is?x:""}C&&ka&&Oe(C.firstChild);const Z=Xr(yn?O:C);for(;Q=Z.nextNode();)Zr(Q),no(Q),Q.content instanceof i&&gp(Q.content);if(yn)return O;if(Kt){if(as)for(ce=z.call(C.ownerDocument);C.firstChild;)ce.appendChild(C.firstChild);else ce=C;return(J.shadowroot||J.shadowrootmode)&&(ce=H.call(s,ce,!0)),ce}let ve=gt?C.outerHTML:C.innerHTML;return gt&&B["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&ue(Dc,C.ownerDocument.doctype.name)&&(ve="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+ve),zt&&hs([ae,me,D],je=>{ve=$n(ve,je," ")}),A&&is?A.createHTML(ve):ve},t.setConfig=function(){let O=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};_a(O),wa=!0},t.clearConfig=function(){Ht=null,wa=!1},t.isValidAttribute=function(O,k,C){Ht||_a({});const M=ee(O),Q=ee(k);return eo(M,Q,C)},t.addHook=function(O,k){typeof k=="function"&&kn(j[O],k)},t.removeHook=function(O,k){if(k!==void 0){const C=Ih(j[O],k);return C===-1?void 0:Ph(j[O],C,1)[0]}return _o(j[O])},t.removeHooks=function(O){j[O]=[]},t.removeAllHooks=function(){j=Po()},t}var rn=Oc();function Qi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Nt=Qi();function Nc(e){Nt=e}var _t={exec:()=>null};function W(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(a,i)=>{let r=typeof i=="string"?i:i.source;return r=r.replace(he.caret,"$1"),n=n.replace(a,r),s},getRegex:()=>new RegExp(n,t)};return s}var Yh=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),he={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Xh=/^(?:[ \t]*(?:\n|$))+/,Jh=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Zh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Yn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ef=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Yi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Bc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Fc=W(Bc).replace(/bull/g,Yi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),tf=W(Bc).replace(/bull/g,Yi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Xi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,nf=/^[^\n]+/,Ji=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,sf=W(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ji).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),af=W(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Yi).getRegex(),Zs="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Zi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,rf=W("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Zi).replace("tag",Zs).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Uc=W(Xi).replace("hr",Yn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex(),of=W(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Uc).getRegex(),er={blockquote:of,code:Jh,def:sf,fences:Zh,heading:ef,hr:Yn,html:rf,lheading:Fc,list:af,newline:Xh,paragraph:Uc,table:_t,text:nf},Mo=W("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Yn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex(),lf={...er,lheading:tf,table:Mo,paragraph:W(Xi).replace("hr",Yn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Mo).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zs).getRegex()},cf={...er,html:W(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Zi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:_t,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:W(Xi).replace("hr",Yn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Fc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},df=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,uf=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,zc=/^( {2,}|\\)\n(?!\s*$)/,pf=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ea=/[\p{P}\p{S}]/u,tr=/[\s\p{P}\p{S}]/u,Kc=/[^\s\p{P}\p{S}]/u,hf=W(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,tr).getRegex(),Wc=/(?!~)[\p{P}\p{S}]/u,ff=/(?!~)[\s\p{P}\p{S}]/u,gf=/(?:[^\s\p{P}\p{S}]|~)/u,qc=/(?![*_])[\p{P}\p{S}]/u,mf=/(?![*_])[\s\p{P}\p{S}]/u,vf=/(?:[^\s\p{P}\p{S}]|[*_])/u,yf=W(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Yh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Hc=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,bf=W(Hc,"u").replace(/punct/g,ea).getRegex(),wf=W(Hc,"u").replace(/punct/g,Wc).getRegex(),jc="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",kf=W(jc,"gu").replace(/notPunctSpace/g,Kc).replace(/punctSpace/g,tr).replace(/punct/g,ea).getRegex(),$f=W(jc,"gu").replace(/notPunctSpace/g,gf).replace(/punctSpace/g,ff).replace(/punct/g,Wc).getRegex(),Sf=W("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Kc).replace(/punctSpace/g,tr).replace(/punct/g,ea).getRegex(),Af=W(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,qc).getRegex(),Tf="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",xf=W(Tf,"gu").replace(/notPunctSpace/g,vf).replace(/punctSpace/g,mf).replace(/punct/g,qc).getRegex(),_f=W(/\\(punct)/,"gu").replace(/punct/g,ea).getRegex(),Cf=W(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Lf=W(Zi).replace("(?:-->|$)","-->").getRegex(),Ef=W("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Lf).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ps=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Rf=W(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ps).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Vc=W(/^!?\[(label)\]\[(ref)\]/).replace("label",Ps).replace("ref",Ji).getRegex(),Gc=W(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ji).getRegex(),If=W("reflink|nolink(?!\\()","g").replace("reflink",Vc).replace("nolink",Gc).getRegex(),Do=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,nr={_backpedal:_t,anyPunctuation:_f,autolink:Cf,blockSkip:yf,br:zc,code:uf,del:_t,delLDelim:_t,delRDelim:_t,emStrongLDelim:bf,emStrongRDelimAst:kf,emStrongRDelimUnd:Sf,escape:df,link:Rf,nolink:Gc,punctuation:hf,reflink:Vc,reflinkSearch:If,tag:Ef,text:pf,url:_t},Pf={...nr,link:W(/^!?\[(label)\]\((.*?)\)/).replace("label",Ps).getRegex(),reflink:W(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ps).getRegex()},vi={...nr,emStrongRDelimAst:$f,emStrongLDelim:wf,delLDelim:Af,delRDelim:xf,url:W(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Do).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:W(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Do).getRegex()},Mf={...vi,br:W(zc).replace("{2,}","*").getRegex(),text:W(vi.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},gs={normal:er,gfm:lf,pedantic:cf},xn={normal:nr,gfm:vi,breaks:Mf,pedantic:Pf},Df={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Oo=e=>Df[e];function Fe(e,t){if(t){if(he.escapeTest.test(e))return e.replace(he.escapeReplace,Oo)}else if(he.escapeTestNoEncode.test(e))return e.replace(he.escapeReplaceNoEncode,Oo);return e}function No(e){try{e=encodeURI(e).replace(he.percentDecode,"%")}catch{return null}return e}function Bo(e,t){let n=e.replace(he.findPipe,(i,r,l)=>{let c=!1,u=r;for(;--u>=0&&l[u]==="\\";)c=!c;return c?"|":" |"}),s=n.split(he.splitPipe),a=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;a<s.length;a++)s[a]=s[a].trim().replace(he.slashPipe,"|");return s}function _n(e,t,n){let s=e.length;if(s===0)return"";let a=0;for(;a<s&&e.charAt(s-a-1)===t;)a++;return e.slice(0,s-a)}function Of(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Nf(e,t=0){let n=t,s="";for(let a of e)if(a==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=a,n++;return s}function Fo(e,t,n,s,a){let i=t.href,r=t.title||null,l=e[1].replace(a.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:r,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,c}function Bf(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let a=s[1];return t.split(`
`).map(i=>{let r=i.match(n.other.beginningSpace);if(r===null)return i;let[l]=r;return l.length>=a.length?i.slice(a.length):i}).join(`
`)}var Ms=class{options;rules;lexer;constructor(e){this.options=e||Nt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:_n(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Bf(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=_n(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:_n(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=_n(t[0],`
`).split(`
`),s="",a="",i=[];for(;n.length>0;){let r=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),r=!0;else if(!r)l.push(n[c]);else break;n=n.slice(c);let u=l.join(`
`),h=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,a=a?`${a}
${h}`:h;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=f,n.length===0)break;let m=i.at(-1);if(m?.type==="code")break;if(m?.type==="blockquote"){let g=m,w=g.raw+`
`+n.join(`
`),S=this.blockquote(w);i[i.length-1]=S,s=s.substring(0,s.length-g.raw.length)+S.raw,a=a.substring(0,a.length-g.text.length)+S.text;break}else if(m?.type==="list"){let g=m,w=g.raw+`
`+n.join(`
`),S=this.list(w);i[i.length-1]=S,s=s.substring(0,s.length-m.raw.length)+S.raw,a=a.substring(0,a.length-g.raw.length)+S.raw,n=w.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:a}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,a={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),r=!1;for(;e;){let c=!1,u="",h="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let f=Nf(t[2].split(`
`,1)[0],t[1].length),m=e.split(`
`,1)[0],g=!f.trim(),w=0;if(this.options.pedantic?(w=2,h=f.trimStart()):g?w=t[1].length+1:(w=f.search(this.rules.other.nonSpaceChar),w=w>4?1:w,h=f.slice(w),w+=t[1].length),g&&this.rules.other.blankLine.test(m)&&(u+=m+`
`,e=e.substring(m.length+1),c=!0),!c){let S=this.rules.other.nextBulletRegex(w),T=this.rules.other.hrRegex(w),_=this.rules.other.fencesBeginRegex(w),d=this.rules.other.headingBeginRegex(w),$=this.rules.other.htmlBeginRegex(w),A=this.rules.other.blockquoteBeginRegex(w);for(;e;){let x=e.split(`
`,1)[0],L;if(m=x,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),L=m):L=m.replace(this.rules.other.tabCharGlobal,"    "),_.test(m)||d.test(m)||$.test(m)||A.test(m)||S.test(m)||T.test(m))break;if(L.search(this.rules.other.nonSpaceChar)>=w||!m.trim())h+=`
`+L.slice(w);else{if(g||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||_.test(f)||d.test(f)||T.test(f))break;h+=`
`+m}g=!m.trim(),u+=x+`
`,e=e.substring(x.length+1),f=L.slice(w)}}a.loose||(r?a.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(r=!0)),a.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),a.raw+=u}let l=a.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let c of a.items){if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),c.task){if(c.text=c.text.replace(this.rules.other.listReplaceTask,""),c.tokens[0]?.type==="text"||c.tokens[0]?.type==="paragraph"){c.tokens[0].raw=c.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),c.tokens[0].text=c.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let h=this.lexer.inlineQueue.length-1;h>=0;h--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)){this.lexer.inlineQueue[h].src=this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(c.raw);if(u){let h={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};c.checked=h.checked,a.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=h.raw+c.tokens[0].raw,c.tokens[0].text=h.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(h)):c.tokens.unshift({type:"paragraph",raw:h.raw,text:h.raw,tokens:[h]}):c.tokens.unshift(h)}}if(!a.loose){let u=c.tokens.filter(f=>f.type==="space"),h=u.length>0&&u.some(f=>this.rules.other.anyLine.test(f.raw));a.loose=h}}if(a.loose)for(let c of a.items){c.loose=!0;for(let u of c.tokens)u.type==="text"&&(u.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:a}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Bo(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),a=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let r of s)this.rules.other.tableAlignRight.test(r)?i.align.push("right"):this.rules.other.tableAlignCenter.test(r)?i.align.push("center"):this.rules.other.tableAlignLeft.test(r)?i.align.push("left"):i.align.push(null);for(let r=0;r<n.length;r++)i.header.push({text:n[r],tokens:this.lexer.inline(n[r]),header:!0,align:i.align[r]});for(let r of a)i.rows.push(Bo(r,i.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[c]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=_n(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Of(t[2],"()");if(i===-2)return;if(i>-1){let r=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,r).trim(),t[3]=""}}let s=t[2],a="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],a=i[3])}else a=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Fo(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=t[s.toLowerCase()];if(!a){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Fo(n,a,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,r,l=a,c=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+a);(s=u.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(r=[...i].length,s[3]||s[4]){l+=r;continue}else if((s[5]||s[6])&&a%3&&!((a+r)%3)){c+=r;continue}if(l-=r,l>0)continue;r=Math.min(r,r+l+c);let h=[...s[0]][0].length,f=e.slice(0,a+s.index+h+r);if(Math.min(a,r)%2){let g=f.slice(1,-1);return{type:"em",raw:f,text:g,tokens:this.lexer.inlineTokens(g)}}let m=f.slice(2,-2);return{type:"strong",raw:f,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),a=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&a&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,r,l=a,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+a);(s=c.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(r=[...i].length,r!==a))continue;if(s[3]||s[4]){l+=r;continue}if(l-=r,l>0)continue;r=Math.min(r,r+l);let u=[...s[0]][0].length,h=e.slice(0,a+s.index+u+r),f=h.slice(a,-a);return{type:"del",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(a!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Ee=class yi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Nt,this.options.tokenizer=this.options.tokenizer||new Ms,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:he,block:gs.normal,inline:xn.normal};this.options.pedantic?(n.block=gs.pedantic,n.inline=xn.pedantic):this.options.gfm&&(n.block=gs.gfm,this.options.breaks?n.inline=xn.breaks:n.inline=xn.gfm),this.tokenizer.rules=n}static get rules(){return{block:gs,inline:xn}}static lex(t,n){return new yi(n).lex(t)}static lexInline(t,n){return new yi(n).inlineTokens(t)}lex(t){t=t.replace(he.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(he.tabCharGlobal,"    ").replace(he.spaceLine,""));t;){let a;if(this.options.extensions?.block?.some(r=>(a=r.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let r=n.at(-1);a.raw.length===1&&r!==void 0?r.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let r=n.at(-1);r?.type==="paragraph"||r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+a.raw,r.text+=`
`+a.text,this.inlineQueue.at(-1).src=r.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let r=n.at(-1);r?.type==="paragraph"||r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+a.raw,r.text+=`
`+a.raw,this.inlineQueue.at(-1).src=r.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let i=t;if(this.options.extensions?.startBlock){let r=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(r=Math.min(r,c))}),r<1/0&&r>=0&&(i=t.substring(0,r+1))}if(this.state.top&&(a=this.tokenizer.paragraph(i))){let r=n.at(-1);s&&r?.type==="paragraph"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+a.raw,r.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):n.push(a),s=i.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let r=n.at(-1);r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+a.raw,r.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):n.push(a);continue}if(t){let r="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(r);break}else throw new Error(r)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,a=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,a.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(a=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=a[2]?a[2].length:0,s=s.slice(0,a.index+i)+"["+"a".repeat(a[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let r=!1,l="";for(;t;){r||(l=""),r=!1;let c;if(this.options.extensions?.inline?.some(h=>(c=h.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let h=n.at(-1);c.type==="text"&&h?.type==="text"?(h.raw+=c.raw,h.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let u=t;if(this.options.extensions?.startInline){let h=1/0,f=t.slice(1),m;this.options.extensions.startInline.forEach(g=>{m=g.call({lexer:this},f),typeof m=="number"&&m>=0&&(h=Math.min(h,m))}),h<1/0&&h>=0&&(u=t.substring(0,h+1))}if(c=this.tokenizer.inlineText(u)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(l=c.raw.slice(-1)),r=!0;let h=n.at(-1);h?.type==="text"?(h.raw+=c.raw,h.text+=c.text):n.push(c);continue}if(t){let h="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(h);break}else throw new Error(h)}}return n}},Ds=class{options;parser;constructor(e){this.options=e||Nt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(he.notSpaceStart)?.[0],a=e.replace(he.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Fe(s)+'">'+(n?a:Fe(a,!0))+`</code></pre>
`:"<pre><code>"+(n?a:Fe(a,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let r=0;r<e.items.length;r++){let l=e.items[r];s+=this.listitem(l)}let a=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return"<"+a+i+`>
`+s+"</"+a+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let a=0;a<e.header.length;a++)n+=this.tablecell(e.header[a]);t+=this.tablerow({text:n});let s="";for(let a=0;a<e.rows.length;a++){let i=e.rows[a];n="";for(let r=0;r<i.length;r++)n+=this.tablecell(i[r]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Fe(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),a=No(e);if(a===null)return s;e=a;let i='<a href="'+e+'"';return t&&(i+=' title="'+Fe(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let a=No(e);if(a===null)return Fe(n);e=a;let i=`<img src="${e}" alt="${Fe(n)}"`;return t&&(i+=` title="${Fe(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Fe(e.text)}},sr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Re=class bi{options;renderer;textRenderer;constructor(t){this.options=t||Nt,this.options.renderer=this.options.renderer||new Ds,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new sr}static parse(t,n){return new bi(n).parse(t)}static parseInline(t,n){return new bi(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let a=t[s];if(this.options.extensions?.renderers?.[a.type]){let r=a,l=this.options.extensions.renderers[r.type].call({parser:this},r);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(r.type)){n+=l||"";continue}}let i=a;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let r='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(t,n=this.renderer){let s="";for(let a=0;a<t.length;a++){let i=t[a];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let r=i;switch(r.type){case"escape":{s+=n.text(r);break}case"html":{s+=n.html(r);break}case"link":{s+=n.link(r);break}case"image":{s+=n.image(r);break}case"checkbox":{s+=n.checkbox(r);break}case"strong":{s+=n.strong(r);break}case"em":{s+=n.em(r);break}case"codespan":{s+=n.codespan(r);break}case"br":{s+=n.br(r);break}case"del":{s+=n.del(r);break}case"text":{s+=n.text(r);break}default:{let l='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},En=class{options;block;constructor(t){this.options=t||Nt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ee.lex:Ee.lexInline}provideParser(){return this.block?Re.parse:Re.parseInline}},Ff=class{defaults=Qi();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Re;Renderer=Ds;TextRenderer=sr;Lexer=Ee;Tokenizer=Ms;Hooks=En;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let a=s;for(let i of a.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of a.rows)for(let r of i)n=n.concat(this.walkTokens(r.tokens,t));break}case"list":{let a=s;n=n.concat(this.walkTokens(a.items,t));break}default:{let a=s;this.defaults.extensions?.childTokens?.[a.type]?this.defaults.extensions.childTokens[a.type].forEach(i=>{let r=a[i].flat(1/0);n=n.concat(this.walkTokens(r,t))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){let i=t.renderers[a.name];i?t.renderers[a.name]=function(...r){let l=a.renderer.apply(this,r);return l===!1&&(l=i.apply(this,r)),l}:t.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[a.level];i?i.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level==="block"?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level==="inline"&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),s.extensions=t),n.renderer){let a=this.defaults.renderer||new Ds(this.defaults);for(let i in n.renderer){if(!(i in a))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let r=i,l=n.renderer[r],c=a[r];a[r]=(...u)=>{let h=l.apply(a,u);return h===!1&&(h=c.apply(a,u)),h||""}}s.renderer=a}if(n.tokenizer){let a=this.defaults.tokenizer||new Ms(this.defaults);for(let i in n.tokenizer){if(!(i in a))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let r=i,l=n.tokenizer[r],c=a[r];a[r]=(...u)=>{let h=l.apply(a,u);return h===!1&&(h=c.apply(a,u)),h}}s.tokenizer=a}if(n.hooks){let a=this.defaults.hooks||new En;for(let i in n.hooks){if(!(i in a))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let r=i,l=n.hooks[r],c=a[r];En.passThroughHooks.has(i)?a[r]=u=>{if(this.defaults.async&&En.passThroughHooksRespectAsync.has(i))return(async()=>{let f=await l.call(a,u);return c.call(a,f)})();let h=l.call(a,u);return c.call(a,h)}:a[r]=(...u)=>{if(this.defaults.async)return(async()=>{let f=await l.apply(a,u);return f===!1&&(f=await c.apply(a,u)),f})();let h=l.apply(a,u);return h===!1&&(h=c.apply(a,u)),h}}s.hooks=a}if(n.walkTokens){let a=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(r){let l=[];return l.push(i.call(this,r)),a&&(l=l.concat(a.call(this,r))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Ee.lex(e,t??this.defaults)}parser(e,t){return Re.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},a={...this.defaults,...s},i=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(a.hooks&&(a.hooks.options=a,a.hooks.block=e),a.async)return(async()=>{let r=a.hooks?await a.hooks.preprocess(t):t,l=await(a.hooks?await a.hooks.provideLexer():e?Ee.lex:Ee.lexInline)(r,a),c=a.hooks?await a.hooks.processAllTokens(l):l;a.walkTokens&&await Promise.all(this.walkTokens(c,a.walkTokens));let u=await(a.hooks?await a.hooks.provideParser():e?Re.parse:Re.parseInline)(c,a);return a.hooks?await a.hooks.postprocess(u):u})().catch(i);try{a.hooks&&(t=a.hooks.preprocess(t));let r=(a.hooks?a.hooks.provideLexer():e?Ee.lex:Ee.lexInline)(t,a);a.hooks&&(r=a.hooks.processAllTokens(r)),a.walkTokens&&this.walkTokens(r,a.walkTokens);let l=(a.hooks?a.hooks.provideParser():e?Re.parse:Re.parseInline)(r,a);return a.hooks&&(l=a.hooks.postprocess(l)),l}catch(r){return i(r)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Fe(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},It=new Ff;function q(e,t){return It.parse(e,t)}q.options=q.setOptions=function(e){return It.setOptions(e),q.defaults=It.defaults,Nc(q.defaults),q};q.getDefaults=Qi;q.defaults=Nt;q.use=function(...e){return It.use(...e),q.defaults=It.defaults,Nc(q.defaults),q};q.walkTokens=function(e,t){return It.walkTokens(e,t)};q.parseInline=It.parseInline;q.Parser=Re;q.parser=Re.parse;q.Renderer=Ds;q.TextRenderer=sr;q.Lexer=Ee;q.lexer=Ee.lex;q.Tokenizer=Ms;q.Hooks=En;q.parse=q;q.options;q.setOptions;q.use;q.walkTokens;q.parseInline;Re.parse;Ee.lex;q.setOptions({gfm:!0,breaks:!0,mangle:!1});const Uf=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log)$/i,zf=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+\\.\\w+","g");function Kf(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(zf,s=>{if(!Uf.test(s))return s;const a=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`;return`[${s.split("/").pop()??s}](${a})`}));return t.join("")}const Hn=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],jn=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],Uo=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let zo=!1;const Wf=14e4,qf=14e4,Hf=200,Ba=5e4,Lt=new Map;function jf(e){const t=Lt.get(e);return t===void 0?null:(Lt.delete(e),Lt.set(e,t),t)}function Ko(e,t){if(Lt.set(e,t),Lt.size<=Hf)return;const n=Lt.keys().next().value;n&&Lt.delete(n)}function ta(){zo||(zo=!0,rn.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function we(e){const t=e.trim();if(!t)return"";if(ta(),t.length<=Ba){const r=jf(t);if(r!==null)return r}const n=Ic(t,Wf),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>qf){const l=`<pre class="code-block">${eg(`${n.text}${s}`)}</pre>`,c=rn.sanitize(l,{ALLOWED_TAGS:Hn,ALLOWED_ATTR:jn,ALLOWED_URI_REGEXP:Uo});return t.length<=Ba&&Ko(t,c),c}const a=q.parse(`${n.text}${s}`),i=rn.sanitize(a,{ALLOWED_TAGS:Hn,ALLOWED_ATTR:jn,ALLOWED_URI_REGEXP:Uo});return t.length<=Ba&&Ko(t,i),i}function Vf(e){const t=e.trim();if(!t)return"";ta();const n=q.parse(t);return rn.sanitize(n,{ALLOWED_TAGS:Hn,ALLOWED_ATTR:jn}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}function na(e){const t=e.trim();return t?(ta(),rn.sanitize(t,{ALLOWED_TAGS:Hn,ALLOWED_ATTR:jn,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}const Gf=[...Hn,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],Qf=[...jn,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function Yf(e){const t=e.trim();if(!t)return"";ta();const{styles:n,html:s}=Xf(t),a=rn.sanitize(s,{ALLOWED_TAGS:Gf,ALLOWED_ATTR:Qf,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),i=".dashboard-render";return n.map(l=>`<style>${Zf(l,i)}</style>`).join(`
`)+a}function Xf(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(r,l)=>(t.push(l),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),i=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:i}}function Jf(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function Zf(e,t){const n=e.replace(/@import\b[^;]*;/gi,""),s=[];let a=0;for(;a<n.length;){if(/\s/.test(n[a])){s.push(n[a]),a++;continue}if(n[a]==="/"&&n[a+1]==="*"){const h=n.indexOf("*/",a+2),f=h===-1?n.length:h+2;s.push(n.slice(a,f)),a=f;continue}if(n[a]==="}"){s.push("}"),a++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(a,a+30))){const h=Jf(n,a);s.push(n.slice(a,h)),a=h;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(a,a+20))){const h=n.indexOf("{",a);if(h===-1){s.push(n.slice(a));break}s.push(n.slice(a,h+1)),a=h+1;continue}const i=n.indexOf("{",a);if(i===-1){s.push(n.slice(a));break}const r=n.slice(a,i).trim(),l=n.indexOf("}",i);if(l===-1){s.push(n.slice(a));break}const c=n.slice(i+1,l),u=r.split(",").map(h=>{const f=h.trim();if(!f)return h;if(f==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(f))return t;const m=f.replace(/^(html|body|:root)\s+/i,"");return`${t} ${m}`}).join(", ");s.push(`${u} {${c}}`),a=l+1}return s.join("")}function eg(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const tg=500;let kt="",$t="";function ng(e){const t=e.trim();if(!t)return"";if(t.length<tg)return we(t);const n=ag(t);if(n<0)return we(t);const s=t.slice(0,n),a=t.slice(n);if(s===kt)return $t+we(a);if(s.startsWith(kt)&&kt.length>0){const i=s.slice(kt.length);return $t=$t+we(i),kt=s,$t+we(a)}return $t=we(s),kt=s,$t+we(a)}function sg(){kt="",$t=""}function ag(e){let t=!1,n="";const s=[];let a=0;for(;a<e.length;){const i=e.indexOf(`
`,a),r=i===-1?e.length:i,l=e.slice(a,r),c=l.trimStart(),u=c.match(/^(`{3,}|~{3,})/);if(u){const h=u[1];t?h.charAt(0)===n.charAt(0)&&h.length>=n.length&&c.slice(h.length).trim()===""&&(t=!1,n=""):(t=!0,n=h)}if(!t&&l.trim()===""){let h=r+1;for(;h<e.length&&e[h]===`
`;)h++;h<e.length&&(s.length===0||s[s.length-1]!==h)&&s.push(h)}a=i===-1?e.length:i+1}return s.length<2?-1:s[s.length-2]}const Y={messageSquare:o`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:o`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:o`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:o`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:o`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:o`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,monitor:o`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:o`
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
  `,scrollText:o`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,folderOpen:o`
    <svg viewBox="0 0 24 24">
      <path
        d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  `,file:o`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  `,chevronRight:o`
    <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
  `,chevronDown:o`
    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  `,panelLeft:o`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  `,panelLeftClose:o`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,menu:o`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:o`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:o`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,copy:o`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:o`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:o`
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
  `,book:o`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:o`
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
  `,arrowUp:o`
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  `,calendar:o`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  `,heart:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  `,pieChart:o`
    <svg viewBox="0 0 24 24">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  `,star:o`
    <svg viewBox="0 0 24 24">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,headphones:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      />
    </svg>
  `,helpCircle:o`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,messageCircle:o`
    <svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  `,wrench:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:o`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:o`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:o`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:o`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:o`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:o`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:o`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:o`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:o`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:o`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,minimize:o`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,users:o`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,briefcase:o`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  `,shield:o`
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  `,lock:o`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  `,flask:o`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `},ig=1500,rg=2e3,Qc="Copy as markdown",og="Copied",lg="Copy failed";async function cg(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function ms(e,t){e.title=t,e.setAttribute("aria-label",t)}function dg(e){const t=e.label??Qc;return o`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const a=await cg(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!a){s.dataset.error="1",ms(s,lg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,ms(s,t))},rg);return}s.dataset.copied="1",ms(s,og),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,ms(s,t))},ig)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${Y.copy}</span>
        <span class="chat-copy-btn__icon-check">${Y.check}</span>
      </span>
    </button>
  `}function ug(e){return dg({text:()=>e,label:Qc})}const Wo="NO_REPLY",pg=/<system-context\b[^>]*>[\s\S]*?<\/system-context>/gi;function Fa(e){return e.replace(pg,"").trim()}const hg=/^\[([^\]]+)\]\s*/,fg=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Ua=new WeakMap,za=new WeakMap;function gg(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:fg.some(t=>e.startsWith(`${t} `))}function Ka(e){const t=e.match(hg);if(!t)return e;const n=t[1]??"";return gg(n)?e.slice(t[0].length):e}function Wa(e){const t=e.trim();return t===Wo||t.startsWith(`${Wo}
`)}function wi(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const a=Fa(s);if(!a)return null;const i=n==="assistant"?Ra(a):Ka(a);return Wa(i)?null:i}if(Array.isArray(s)){const a=s.map(i=>{const r=i;return r.type==="text"&&typeof r.text=="string"?Fa(r.text):null}).filter(i=>typeof i=="string"&&i.length>0);if(a.length>0){const i=a.join(`
`),r=n==="assistant"?Ra(i):Ka(i);return Wa(r)?null:r}}if(typeof t.text=="string"){const a=Fa(t.text);if(!a)return null;const i=n==="assistant"?Ra(a):Ka(a);return Wa(i)?null:i}return null}function Yc(e){if(!e||typeof e!="object")return wi(e);const t=e;if(Ua.has(t))return Ua.get(t)??null;const n=wi(e);return Ua.set(t,n),n}function qo(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const c=l;if(c.type==="thinking"&&typeof c.thinking=="string"){const u=c.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const a=vg(e);if(!a)return null;const r=[...a.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return r.length>0?r.join(`
`):null}function mg(e){if(!e||typeof e!="object")return qo(e);const t=e;if(za.has(t))return za.get(t)??null;const n=qo(e);return za.set(t,n),n}function vg(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(a=>{const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>typeof a=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function yg(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}function Xc(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",a=t.content,i=Array.isArray(a)?a:null,r=Array.isArray(i)&&i.some(f=>{const m=f,g=(typeof m.type=="string"?m.type:"").toLowerCase();return g==="toolresult"||g==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||r||l)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(f=>({type:f.type||"text",text:f.text,name:f.name,args:f.args||f.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),h=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:u,id:h}}function ar(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function Jc(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const bg={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},wg={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},kg={fallback:bg,tools:wg},Zc=kg,Ho=Zc.fallback??{icon:"puzzle"},$g=Zc.tools??{};function Sg(e){return(e??"tool").trim()}function Ag(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Tg(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function ed(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>ed(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function xg(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function _g(e,t){for(const n of t){const s=xg(e,n),a=ed(s);if(a)return a}}function Cg(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,a=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&a!==void 0?`${n}:${s}-${s+a}`:n}function Lg(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Eg(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Rg(e){const t=Sg(e.name),n=t.toLowerCase(),s=$g[n],a=s?.icon??Ho.icon??"puzzle",i=s?.title??Ag(t),r=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof l=="string"?l.trim():void 0,u=Eg(s,c),h=Tg(u?.label??c);let f;n==="read"&&(f=Cg(e.args)),!f&&(n==="write"||n==="edit"||n==="attach")&&(f=Lg(e.args));const m=u?.detailKeys??s?.detailKeys??Ho.detailKeys??[];return!f&&m.length>0&&(f=_g(e.args,m)),!f&&e.meta&&(f=e.meta),f&&(f=Pg(f)),{name:t,icon:a,title:i,label:r,verb:h,detail:f}}function Ig(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Pg(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Mg=80,Dg=2,jo=100,Og=3;function Ng(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function Bg(e){const t=e.split(`
`),n=t.slice(0,Dg),s=n.join(`
`);return s.length>jo?s.slice(0,jo)+"…":n.length<t.length?s+"…":s}function Fg(e){const t=e,n=Ug(t.content),s=[];for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(i)||typeof a.name=="string"&&a.arguments!=null)&&s.push({kind:"call",name:a.name??"tool",args:zg(a.arguments??a.args)})}for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();if(i!=="toolresult"&&i!=="tool_result")continue;const r=Kg(a);if(Go(r))continue;const l=typeof a.name=="string"?a.name:"tool";s.push({kind:"result",name:l,text:r})}if(Jc(e)&&!s.some(a=>a.kind==="result")){const a=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",i=Yc(e)??void 0;Go(i)||s.push({kind:"result",name:a,text:i})}return s}function Vo(e,t){const n=Rg({name:e.name,args:e.args}),s=Ig(n),a=!!e.text?.trim(),i=!!t,r=i?g=>{if(g.stopPropagation(),a){t(Ng(e.text));return}const w=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(w)}:void 0,l=e.text?e.text.split(`
`).length:0,c=a&&(e.text?.length??0)<=Mg,u=a&&!c&&l>Og,h=a&&!u,f=!a,m=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return o`
    <div
      class="chat-tool-card ${m} ${i?"chat-tool-card--clickable":""}"
      @click=${r}
      role=${i?"button":p}
      tabindex=${i?"0":p}
      @keydown=${i?g=>{g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),g.stopPropagation(),r?.(g))}:p}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${Y[n.icon]}</span>
          <span>${n.label}</span>
        </div>
        ${i?o`<span class="chat-tool-card__action">${a?"View":""} ${Y.check}</span>`:p}
        ${f&&!i?o`<span class="chat-tool-card__status">${Y.check}</span>`:p}
      </div>
      ${s?o`<div class="chat-tool-card__detail">${s}</div>`:p}
      ${f?o`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:p}
      ${u?o`<details class="chat-tool-card__expandable" @click=${g=>g.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${Bg(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:p}
      ${h?o`<div class="chat-tool-card__inline mono">${e.text}</div>`:p}
    </div>
  `}function Ug(e){return Array.isArray(e)?e.filter(Boolean):[]}function zg(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Kg(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Go(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}const Qo={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function td(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=Qo[t]??Qo.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}const Yo={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function Wg(e){const t=e.split(".").pop()?.toLowerCase()||"";return Yo[t]??Yo.default}function qg(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File"}[n]||e.split("/")[1]?.toUpperCase()||"File"}function Hg(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],a=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let i;for(;(i=a.exec(n))!==null;)s.push({fileName:i[1].trim(),fileId:i[2].trim(),size:i[3].trim(),mimeType:i[4].trim()});return s.length>0?s:null}function jg(e){return o`
    <div class="chat-file-uploads">
      ${e.map(t=>o`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${Wg(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${qg(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function Vg(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}function Gg(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")){const i=e.indexOf(`

`);return i!==-1?e.slice(i+2).trim():""}let a=e.split(`
`).filter(i=>{const r=i.trim();return!r.startsWith("System:")&&!r.startsWith("GatewayRestart:")}).join(`
`);for(;a.startsWith(`
`);)a=a.slice(1);return a.trim()}function Qg(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function ki(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const r=i;if(r.type==="image"){const l=r.source;if(l?.type==="base64"&&typeof l.data=="string"){const c=l.data,u=l.media_type||"image/png",h=c.startsWith("data:")?c:`data:${u};base64,${c}`;s.push({url:h})}else if(typeof r.data=="string"&&typeof r.mimeType=="string"){const c=r.data.startsWith("data:")?r.data:`data:${r.mimeType};base64,${r.data}`;s.push({url:c})}else typeof r.url=="string"?s.push({url:r.url}):r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}else if(r.type==="image_url"){const l=r.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else r.type==="attachment"&&typeof r.content=="string"&&(r.mimeType||"").startsWith("image/")&&s.push({url:r.content,alt:r.fileName||void 0});if(r.type==="text"&&typeof r.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,c=r.text.match(l);if(c)for(const u of c)s.push({url:u})}if(Array.isArray(r.content))for(const l of r.content){if(typeof l!="object"||l===null)continue;const c=l;if(c.type==="image"){const u=c.source;if(u?.type==="base64"&&typeof u.data=="string"){const h=u.media_type||"image/png",f=u.data.startsWith("data:")?u.data:`data:${h};base64,${u.data}`;s.push({url:f})}else if(typeof c.data=="string"&&typeof c.mimeType=="string"){const h=c.data.startsWith("data:")?c.data:`data:${c.mimeType};base64,${c.data}`;s.push({url:h})}else c.omitted===!0&&s.push({omitted:!0,bytes:typeof c.bytes=="number"?c.bytes:void 0,mimeType:typeof c.mimeType=="string"?c.mimeType:void 0,alt:typeof c.fileName=="string"?c.fileName:void 0})}}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const r=i;if(r.type==="image"&&typeof r.content=="string"){const l=r.mimeType||"image/png",c=r.content.startsWith("data:")?r.content:`data:${l};base64,${r.content}`;s.push({url:c,alt:r.fileName||void 0})}else r.type==="image"&&r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}return s}function Yg(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const r=i;if(r.type==="attachment"&&typeof r.content=="string"){const l=r.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:r.fileName||"file",mimeType:l,content:r.content})}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const r=i;r.type==="file"&&typeof r.content=="string"&&s.push({fileName:r.fileName||"file",mimeType:r.mimeType||"application/octet-stream",content:r.content})}return s}function Xg(e,t){return o`
    <div class="chat-group assistant">
      ${ir("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?o`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${td(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?o`<span class="chat-working-indicator__details">${t.details}</span>`:p}
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
  `}function Jg(e,t,n,s,a){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),r=s?.name??"Assistant";return o`
    <div class="chat-group assistant">
      ${ir("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${a?o`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${td(a.name)}</span>
                    <strong>${a.name}</strong>
                  </span>
                </div>
                ${a.details?o`<span class="chat-working-indicator__details">${a.details}</span>`:p}
              </div>
            `:p}
        ${nd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${r}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function Zg(e,t){const n=ar(e.role),s=t.assistantName??"Assistant",a=t.userName??"You",i=n==="user"?a:n==="assistant"?s:n,r=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o`
    <div class="chat-group ${r}">
      ${ir(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:a,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,u)=>nd(c.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onImageClick,t.resolveImageUrl))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function ir(e,t){const n=ar(e),s=t?.assistantName?.trim()||"Assistant",a=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",i=t?.userName?.trim()||"You",r=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?r&&Xo(r)?o`<img
        class="chat-avatar ${l}"
        src="${r}"
        alt="${i}"
      />`:r?o`<div class="chat-avatar ${l}">${r}</div>`:o`<div class="chat-avatar ${l}">${i.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?a&&Xo(a)?o`<img
        class="chat-avatar ${l}"
        src="${a}"
        alt="${s}"
      />`:a?o`<div class="chat-avatar ${l}" style="color: var(--accent);">${a}</div>`:o`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?o`<div class="chat-avatar ${l}">⚙</div>`:o`<div class="chat-avatar ${l}">?</div>`}function Xo(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Jo(e,t,n){if(e.length===0)return p;const s=e.map((i,r)=>{if((i.omitted||!i.url)&&n){const l=n(r);if(l)return{...i,resolvedUrl:l}}return i}),a=s.filter(i=>(i.resolvedUrl||i.url)&&!i.omitted||i.resolvedUrl).map(i=>({url:i.resolvedUrl||i.url,alt:i.alt}));return o`
    <div class="chat-message-images">
      ${s.map(i=>{const r=i.resolvedUrl||i.url;if(!r){const c=Qg(i.bytes),h=[i.mimeType?i.mimeType.replace("image/","").toUpperCase():null,c,"preview omitted"].filter(Boolean).join(" - ");return o`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${i.alt??"Attached image"}
              aria-label="Attached image preview omitted"
            >
              <span class="chat-message-image__omitted-label">Image attached</span>
              <span class="chat-message-image__omitted-meta">${h}</span>
            </div>
          `}const l=a.findIndex(c=>c.url===r);return o`
          <img
            src=${r}
            alt=${i.alt??"Attached image"}
            class="chat-message-image"
            @error=${c=>{const u=c.target;u.style.display="none"}}
            @click=${()=>{t&&t(r,a,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function em(e){return e.length===0?p:o`
    <div class="chat-message-files">
      ${e.map(t=>{const n=t.fileName.length>30?t.fileName.slice(0,27)+"...":t.fileName;return o`
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
  `}function nd(e,t,n,s,a){try{return tm(e,t,n,s,a)}catch(i){return console.error("[chat] message render error:",i),o`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function tm(e,t,n,s,a){const i=e,r=typeof i.role=="string"?i.role:"unknown",l=Jc(e)||r.toLowerCase()==="toolresult"||r.toLowerCase()==="tool_result"||typeof i.toolCallId=="string"||typeof i.tool_call_id=="string",c=Fg(e),u=c.length>0,h=ki(e),f=h.length>0,m=typeof i._chatIdx=="number"?i._chatIdx:-1,g=a&&m>=0?H=>a(m,H):void 0,w=Yg(e),S=w.length>0,T=Yc(e),_=t.showReasoning&&r==="assistant"?mg(e):null,d=r==="user"&&T?Hg(T):null,$=d&&d.length>0;let A=T;r==="user"&&A&&(A=Gg(A)),A&&(A=A.replace(/<system-context\b[^>]*>[\s\S]*?<\/system-context>/gi,"").trim()||null),$&&A&&(A=Vg(A));const x=A?.trim()?A:null,L=_?yg(_):null,E=x,z=r==="assistant"&&!!E?.trim(),V=["chat-bubble",z?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(u&&l)return o`
      ${f?Jo(h,s,g):p}
      ${c.map(H=>Vo(H,n))}
    `;if(!E&&!u&&!f&&!S&&!$&&!L){const H=typeof i.errorMessage=="string"?i.errorMessage:null;if(i.stopReason==="error"&&H){let j=H;const ae=H.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(ae){const me=parseInt(ae[1]).toLocaleString(),D=parseInt(ae[2]).toLocaleString();j=`Context overflow: ${me} tokens exceeded the ${D} token limit. The conversation needs to be compacted.`}else H.includes("prompt is too long")&&(j="Context overflow: The conversation is too long for the model.");return o`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${j}</div>
        </div>
      `}return p}return o`
    <div class="${V}">
      ${z?ug(E):p}
      ${$?jg(d):p}
      ${Jo(h,s,g)}
      ${em(w)}
      ${L?o`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${_e(we(L))}</div>
            </details>`:p}
      ${E?o`<div class="chat-text">${_e(t.isStreaming?ng(E):we(E))}</div>`:p}
      ${c.map(H=>Vo(H,n))}
    </div>
  `}function nm(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,a=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return o`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?o`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:p}
      </div>
      <div class="chat-compaction-summary__content">
        ${_e(we(n))}
      </div>
      ${a?o`<div class="chat-compaction-summary__timestamp">${a}</div>`:p}
    </div>
  `}function sm(e){return e.isCompactionSummary===!0}async function am(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}const sd=50,ad=200,im="Assistant";function Os(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function $i(e){const t=Os(e?.name,sd)??im,n=Os(e?.avatar??void 0,ad)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function rm(){return $i(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const om="You";function Zo(e){const t=Os(e?.name,sd)??om,n=Os(e?.avatar??void 0,ad)??null;return{name:t,avatar:n}}function lm(){return Zo(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function id(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const a=await e.client.request("agent.identity.get",s);if(!a)return;const i=$i(a);e.assistantName=i.name,e.assistantAvatar=i.avatar,e.assistantAgentId=i.agentId??null}catch{}}let el=!1;function tl(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function cm(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function dm(){el||(el=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function sa(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),tl(t)}return dm(),tl(cm())}let St=null,Ss=null;function rd(){return Ss}const Ns=new Map,Ke=new Map;function Si(e,t){const n=t.filter(s=>s?.role==="user").length;Ns.set(e,n)}async function rr(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return Ke.set(t,s),Si(t,s),s}catch{return Ke.get(t)??[]}}let Vt=0;async function le(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Vt;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Vt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Si(t,e.chatMessages),Ke.set(t,e.chatMessages)}catch{if(n!==Vt||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Vt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Si(t,e.chatMessages),Ke.set(t,e.chatMessages)}catch(s){if(n!==Vt||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Vt&&(e.chatLoading=!1)}}async function od(e,t){const n=[...e.chatMessages],s=n.length;await le(e),!t?.allowShrink&&s>0&&e.chatMessages.length<s&&(e.chatMessages=n,setTimeout(()=>{le(e)},2e3))}function um(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function or(e,t,n,s){if(!e.client||!e.connected)return!1;let a=t.trim();const i=n&&n.length>0;if(!a&&!i)return!1;!a&&i&&(a=n.some(h=>h.mimeType.startsWith("image/"))?"What's in this image?":"See attached file.");const r=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(a&&u.push({type:"text",text:a}),i)for(const h of n)h.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:h.mimeType,data:h.dataUrl}}):u.push({type:"attachment",mimeType:h.mimeType,fileName:h.fileName,content:h.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:r}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=sa();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=r,St={message:a,attachments:i?n:void 0};let c;if(i){const u=[],h=[];for(const f of n){const m=um(f.dataUrl);if(m)if(m.mimeType.startsWith("image/"))u.push({type:"image",mimeType:m.mimeType,content:m.content,fileName:f.fileName});else{const g=f.fileName||"file";h.push(`<document>
<source>${g}</source>
<mime_type>${m.mimeType}</mime_type>
<content encoding="base64">
${m.content}
</content>
</document>`)}}if(u.length>0&&(c=u),h.length>0&&(a=`${h.join(`

`)}

${a}`),u.length>0){const f=e.chatMessages.length-1,m=e.sessionKey,g=e.client.request("images.cache",{images:u.map(w=>({data:w.content,mimeType:w.mimeType,fileName:w.fileName})),sessionKey:m}).then(w=>{if(w?.cached&&w.cached.length>0){const S=w.cached.map((T,_)=>({messageIndex:f,imageIndex:_,hash:T.hash,mimeType:T.mimeType,bytes:T.bytes,role:"user",timestamp:r}));return e.client.request("images.updateIndex",{sessionKey:m,images:S}).catch(()=>{})}}).catch(()=>{});Ss=g,g.finally(()=>{Ss===g&&(Ss=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:a,deliver:!1,idempotencyKey:l,attachments:c}),!0}catch(u){const h=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=h,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+h}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function ld(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,or(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function pm(e){e.pendingRetry=null}async function lr(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function cd(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&sg(),t.state==="delta"){const n=wi(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatStream&&e.chatStream.trim()&&(e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:e.chatStream}],timestamp:Date.now()}]),e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,St=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,St=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&St&&(e.pendingRetry={message:St.message,attachments:St.attachments,timestamp:Date.now()}),St=null;let a=n;if(s){const i=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(i){const r=parseInt(i[1]).toLocaleString(),l=parseInt(i[2]).toLocaleString();a=`⚠️ Context overflow: ${r} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else a='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:a}],timestamp:Date.now(),isError:!0}]}return t.state}const at=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:lr,clearPendingRetry:pm,getPendingImageCache:rd,handleChatEvent:cd,laneMessageCache:Ke,loadChatHistory:le,loadChatHistoryAfterFinal:od,loadLaneHistory:rr,retryPendingMessage:ld,sendChatMessage:or,sessionTurnCounts:Ns},Symbol.toStringTag,{value:"Module"})),dd="godmode.device.auth.v1";function cr(e){return e.trim()}function hm(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function dr(){try{const e=window.localStorage.getItem(dd);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function ud(e){try{window.localStorage.setItem(dd,JSON.stringify(e))}catch{}}function fm(e){const t=dr();if(!t||t.deviceId!==e.deviceId)return null;const n=cr(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function pd(e){const t=cr(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=dr();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const a={token:e.token,role:t,scopes:hm(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=a,ud(n),a}function hd(e){const t=dr();if(!t||t.deviceId!==e.deviceId)return;const n=cr(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],ud(s)}const fd={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:de,n:As,Gx:nl,Gy:sl,a:qa,d:Ha,h:gm}=fd,Pt=32,ur=64,mm=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},se=(e="")=>{const t=new Error(e);throw mm(t,se),t},vm=e=>typeof e=="bigint",ym=e=>typeof e=="string",bm=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",pt=(e,t,n="")=>{const s=bm(e),a=e?.length,i=t!==void 0;if(!s||i&&a!==t){const r=n&&`"${n}" `,l=i?` of length ${t}`:"",c=s?`length=${a}`:`type=${typeof e}`;se(r+"expected Uint8Array"+l+", got "+c)}return e},aa=e=>new Uint8Array(e),gd=e=>Uint8Array.from(e),md=(e,t)=>e.toString(16).padStart(t,"0"),vd=e=>Array.from(pt(e)).map(t=>md(t,2)).join(""),Ve={_0:48,_9:57,A:65,F:70,a:97,f:102},al=e=>{if(e>=Ve._0&&e<=Ve._9)return e-Ve._0;if(e>=Ve.A&&e<=Ve.F)return e-(Ve.A-10);if(e>=Ve.a&&e<=Ve.f)return e-(Ve.a-10)},yd=e=>{const t="hex invalid";if(!ym(e))return se(t);const n=e.length,s=n/2;if(n%2)return se(t);const a=aa(s);for(let i=0,r=0;i<s;i++,r+=2){const l=al(e.charCodeAt(r)),c=al(e.charCodeAt(r+1));if(l===void 0||c===void 0)return se(t);a[i]=l*16+c}return a},bd=()=>globalThis?.crypto,wm=()=>bd()?.subtle??se("crypto.subtle must be defined, consider polyfill"),Vn=(...e)=>{const t=aa(e.reduce((s,a)=>s+pt(a).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},km=(e=Pt)=>bd().getRandomValues(aa(e)),Bs=BigInt,At=(e,t,n,s="bad number: out of range")=>vm(e)&&t<=e&&e<n?e:se(s),P=(e,t=de)=>{const n=e%t;return n>=0n?n:t+n},wd=e=>P(e,As),$m=(e,t)=>{(e===0n||t<=0n)&&se("no inverse n="+e+" mod="+t);let n=P(e,t),s=t,a=0n,i=1n;for(;n!==0n;){const r=s/n,l=s%n,c=a-i*r;s=n,n=l,a=i,i=c}return s===1n?P(a,t):se("no inverse")},Sm=e=>{const t=Ad[e];return typeof t!="function"&&se("hashes."+e+" not set"),t},ja=e=>e instanceof Ae?e:se("Point expected"),Ai=2n**256n;class Ae{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,a){const i=Ai;this.X=At(t,0n,i),this.Y=At(n,0n,i),this.Z=At(s,1n,i),this.T=At(a,0n,i),Object.freeze(this)}static CURVE(){return fd}static fromAffine(t){return new Ae(t.x,t.y,1n,P(t.x*t.y))}static fromBytes(t,n=!1){const s=Ha,a=gd(pt(t,Pt)),i=t[31];a[31]=i&-129;const r=$d(a);At(r,0n,n?Ai:de);const c=P(r*r),u=P(c-1n),h=P(s*c+1n);let{isValid:f,value:m}=Tm(u,h);f||se("bad point: y not sqrt");const g=(m&1n)===1n,w=(i&128)!==0;return!n&&m===0n&&w&&se("bad point: x==0, isLastByteOdd"),w!==g&&(m=P(-m)),new Ae(m,r,1n,P(m*r))}static fromHex(t,n){return Ae.fromBytes(yd(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=qa,n=Ha,s=this;if(s.is0())return se("bad point: ZERO");const{X:a,Y:i,Z:r,T:l}=s,c=P(a*a),u=P(i*i),h=P(r*r),f=P(h*h),m=P(c*t),g=P(h*P(m+u)),w=P(f+P(n*P(c*u)));if(g!==w)return se("bad point: equation left != right (1)");const S=P(a*i),T=P(r*l);return S!==T?se("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:a}=this,{X:i,Y:r,Z:l}=ja(t),c=P(n*l),u=P(i*a),h=P(s*l),f=P(r*a);return c===u&&h===f}is0(){return this.equals(Jt)}negate(){return new Ae(P(-this.X),this.Y,this.Z,P(-this.T))}double(){const{X:t,Y:n,Z:s}=this,a=qa,i=P(t*t),r=P(n*n),l=P(2n*P(s*s)),c=P(a*i),u=t+n,h=P(P(u*u)-i-r),f=c+r,m=f-l,g=c-r,w=P(h*m),S=P(f*g),T=P(h*g),_=P(m*f);return new Ae(w,S,_,T)}add(t){const{X:n,Y:s,Z:a,T:i}=this,{X:r,Y:l,Z:c,T:u}=ja(t),h=qa,f=Ha,m=P(n*r),g=P(s*l),w=P(i*f*u),S=P(a*c),T=P((n+s)*(r+l)-m-g),_=P(S-w),d=P(S+w),$=P(g-h*m),A=P(T*_),x=P(d*$),L=P(T*$),E=P(_*d);return new Ae(A,x,E,L)}subtract(t){return this.add(ja(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return Jt;if(At(t,1n,As),t===1n)return this;if(this.equals(Mt))return Om(t).p;let s=Jt,a=Mt;for(let i=this;t>0n;i=i.double(),t>>=1n)t&1n?s=s.add(i):n&&(a=a.add(i));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(Jt))return{x:0n,y:1n};const a=$m(s,de);P(s*a)!==1n&&se("invalid inverse");const i=P(t*a),r=P(n*a);return{x:i,y:r}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=kd(n);return s[31]|=t&1n?128:0,s}toHex(){return vd(this.toBytes())}clearCofactor(){return this.multiply(Bs(gm),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(As/2n,!1).double();return As%2n&&(t=t.add(this)),t.is0()}}const Mt=new Ae(nl,sl,1n,P(nl*sl)),Jt=new Ae(0n,1n,1n,0n);Ae.BASE=Mt;Ae.ZERO=Jt;const kd=e=>yd(md(At(e,0n,Ai),ur)).reverse(),$d=e=>Bs("0x"+vd(gd(pt(e)).reverse())),Ne=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=de;return n},Am=e=>{const n=e*e%de*e%de,s=Ne(n,2n)*n%de,a=Ne(s,1n)*e%de,i=Ne(a,5n)*a%de,r=Ne(i,10n)*i%de,l=Ne(r,20n)*r%de,c=Ne(l,40n)*l%de,u=Ne(c,80n)*c%de,h=Ne(u,80n)*c%de,f=Ne(h,10n)*i%de;return{pow_p_5_8:Ne(f,2n)*e%de,b2:n}},il=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Tm=(e,t)=>{const n=P(t*t*t),s=P(n*n*t),a=Am(e*s).pow_p_5_8;let i=P(e*n*a);const r=P(t*i*i),l=i,c=P(i*il),u=r===e,h=r===P(-e),f=r===P(-e*il);return u&&(i=l),(h||f)&&(i=c),(P(i)&1n)===1n&&(i=P(-i)),{isValid:u||h,value:i}},Ti=e=>wd($d(e)),pr=(...e)=>Ad.sha512Async(Vn(...e)),xm=(...e)=>Sm("sha512")(Vn(...e)),Sd=e=>{const t=e.slice(0,Pt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Pt,ur),s=Ti(t),a=Mt.multiply(s),i=a.toBytes();return{head:t,prefix:n,scalar:s,point:a,pointBytes:i}},hr=e=>pr(pt(e,Pt)).then(Sd),_m=e=>Sd(xm(pt(e,Pt))),Cm=e=>hr(e).then(t=>t.pointBytes),Lm=e=>pr(e.hashable).then(e.finish),Em=(e,t,n)=>{const{pointBytes:s,scalar:a}=e,i=Ti(t),r=Mt.multiply(i).toBytes();return{hashable:Vn(r,s,n),finish:u=>{const h=wd(i+Ti(u)*a);return pt(Vn(r,kd(h)),ur)}}},Rm=async(e,t)=>{const n=pt(e),s=await hr(t),a=await pr(s.prefix,n);return Lm(Em(s,a,n))},Ad={sha512Async:async e=>{const t=wm(),n=Vn(e);return aa(await t.digest("SHA-512",n.buffer))},sha512:void 0},Im=(e=km(Pt))=>e,Pm={getExtendedPublicKeyAsync:hr,getExtendedPublicKey:_m,randomSecretKey:Im},Fs=8,Mm=256,Td=Math.ceil(Mm/Fs)+1,xi=2**(Fs-1),Dm=()=>{const e=[];let t=Mt,n=t;for(let s=0;s<Td;s++){n=t,e.push(n);for(let a=1;a<xi;a++)n=n.add(t),e.push(n);t=n.double()}return e};let rl;const ol=(e,t)=>{const n=t.negate();return e?n:t},Om=e=>{const t=rl||(rl=Dm());let n=Jt,s=Mt;const a=2**Fs,i=a,r=Bs(a-1),l=Bs(Fs);for(let c=0;c<Td;c++){let u=Number(e&r);e>>=l,u>xi&&(u-=i,e+=1n);const h=c*xi,f=h,m=h+Math.abs(u)-1,g=c%2!==0,w=u<0;u===0?s=s.add(ol(g,t[f])):n=n.add(ol(w,t[m]))}return e!==0n&&se("invalid wnaf"),{p:n,f:s}},Va="godmode-device-identity-v1";function _i(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function xd(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),a=new Uint8Array(s.length);for(let i=0;i<s.length;i+=1)a[i]=s.charCodeAt(i);return a}function Nm(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function _d(e){const t=await crypto.subtle.digest("SHA-256",e);return Nm(new Uint8Array(t))}async function Bm(){const e=Pm.randomSecretKey(),t=await Cm(e);return{deviceId:await _d(t),publicKey:_i(t),privateKey:_i(e)}}async function fr(){try{const n=localStorage.getItem(Va);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const a=await _d(xd(s.publicKey));if(a!==s.deviceId){const i={...s,deviceId:a};return localStorage.setItem(Va,JSON.stringify(i)),{deviceId:a,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Bm(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(Va,JSON.stringify(t)),e}async function Fm(e,t){const n=xd(e),s=new TextEncoder().encode(t),a=await Rm(s,n);return _i(a)}async function ht(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function Um(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await ht(e)}catch(n){e.devicesError=String(n)}}async function zm(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await ht(e)}catch(s){e.devicesError=String(s)}}async function Km(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await fr(),a=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&pd({deviceId:s.deviceId,role:a,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await ht(e)}catch(n){e.devicesError=String(n)}}async function Wm(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await fr();t.deviceId===s.deviceId&&hd({deviceId:s.deviceId,role:t.role}),await ht(e)}catch(s){e.devicesError=String(s)}}function Ci(e){return typeof e=="object"&&e!==null}function qm(e){if(!Ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Ci(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const a=typeof e.createdAtMs=="number"?e.createdAtMs:0,i=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!a||!i?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:a,expiresAtMs:i}}function Hm(e){if(!Ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Cd(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function jm(e,t){const n=Cd(e).filter(s=>s.id!==t.id);return n.push(t),n}function ll(e,t){return Cd(e).filter(n=>n.id!==t)}async function ia(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const Te=new Map;async function ne(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,a=t?.activeMinutes??Is(e.sessionsFilterActive,0),i=t?.limit??Is(e.sessionsFilterLimit,50),r={includeGlobal:n,includeUnknown:s};a>0&&(r.activeMinutes=a),i>0&&(r.limit=i);const l=await e.client.request("sessions.list",r);if(l){if(l.sessions){const c=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&c.set(u.key,u.displayName);l.sessions=l.sessions.map(u=>{if(u.displayName)return u;const h=Te.get(u.key);if(h)return{...u,displayName:h};const f=c.get(u.key);return f?{...u,displayName:f}:u})}e.sessionsResult=l}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Ts(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:a}=await R(async()=>{const{safeRequest:r}=await Promise.resolve().then(()=>iv);return{safeRequest:r}},void 0,import.meta.url),i=await a(e.client,"sessions.patch",s);return i.ok?{ok:!0,canonicalKey:i.data?.key??t}:(e.sessionsError=i.error,{ok:!1})}catch(a){return e.sessionsError=String(a),{ok:!1}}}async function Ld(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await ne(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Dt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function Ed(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Dt(e),await ne(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function Rd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Dt(e),await ne(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function Id(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Dt(e),await ne(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const vs=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:Ed,autoTitleCache:Te,deleteSession:Ld,loadArchivedSessions:Dt,loadSessions:ne,patchSession:Ts,triggerAutoArchive:Id,unarchiveSession:Rd},Symbol.toStringTag,{value:"Module"})),Vm=1800*1e3;function Pd(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,fetchOk:e.fetchOk}}function Md(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,fetchOk:e.fetchOk}}async function Gm(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Pd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=Md(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function cl(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Pd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=Md(t),e.updateLastChecked=Date.now()}catch{}}}function Qm(e){e.updatePollInterval==null&&(cl(e),e.updatePollInterval=window.setInterval(()=>{cl(e)},Vm))}function Ym(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}const Dd={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},dl=Dd,Li={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(Dd));new Set(Object.values(Li));function Xm(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",a=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&a.push(e.nonce??""),a.join("|")}const Jm=4008;class Zm{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let a=null,i=!1,r=this.opts.token;if(t){a=await fr();const h=fm({deviceId:a.deviceId,role:s})?.token;r=h??this.opts.token,i=!!(h&&this.opts.token)}const l=r||this.opts.password?{token:r,password:this.opts.password}:void 0;let c;if(t&&a){const h=Date.now(),f=this.connectNonce??void 0,m=Xm({deviceId:a.deviceId,clientId:this.opts.clientName??dl.CONTROL_UI,clientMode:this.opts.mode??Li.WEBCHAT,role:s,scopes:n,signedAtMs:h,token:r??null,nonce:f}),g=await Fm(a.privateKey,m);c={id:a.deviceId,publicKey:a.publicKey,signature:g,signedAt:h,nonce:f}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??dl.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Li.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(h=>{h?.auth?.deviceToken&&a&&pd({deviceId:a.deviceId,role:h.auth.role??s,token:h.auth.deviceToken,scopes:h.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(h)}).catch(()=>{i&&a&&hd({deviceId:a.deviceId,role:s}),this.ws?.close(Jm,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const a=n;if(a.event==="connect.challenge"){const r=a.payload,l=r&&typeof r.nonce=="string"?r.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const i=typeof a.seq=="number"?a.seq:null;i!==null&&(this.lastSeq!==null&&i>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:i}),this.lastSeq=i);try{this.opts.onEvent?.(a)}catch(r){console.error("[gateway] event handler error:",r)}return}if(s.type==="res"){const a=n,i=this.pending.get(a.id);if(!i)return;this.pending.delete(a.id),a.ok?i.resolve(a.payload):i.reject(new Error(a.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=sa(),a={type:"req",id:s,method:t,params:n},i=new Promise((r,l)=>{this.pending.set(s,{resolve:c=>r(c),reject:l})});return this.ws.send(JSON.stringify(a)),i}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const Od={displayName:"label",sessionKey:"conversationId"},Nd={};for(const[e,t]of Object.entries(Od))Nd[t]=e;const ev={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},Ot=new Map;function tv(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))Ot.set(n,s)}}catch{}}function ul(){try{const e={};for(const[t,n]of Ot)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}tv();function nv(e,t){const n=Ot.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const a={...t};for(const[i,r]of Object.entries(n.fieldRenames))i in a&&!(r in a)&&(a[r]=a[i],delete a[i]);return{method:s,params:a}}return{method:s,params:t}}function sv(e,t,n){const s=n.toLowerCase(),a=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(a){const i=a[1],r=Od[i];if(r&&t&&typeof t=="object"){const l={...t};if(i in l)return l[r]=l[i],delete l[i],console.log(`[safe-request] Self-heal: ${e} — rewrote "${i}" → "${r}"`),{method:e,params:l,renames:{[i]:r}}}}if(s.includes("unknown method")||s.includes("method not found")){const i=ev[e];if(i&&i.length>0){const r=i[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${r}`),{method:r,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const i={...t};let r=!1;const l={};for(const[c,u]of Object.entries(Nd))c in i&&(i[u]=i[c],delete i[c],l[c]=u,r=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${c}" → "${u}"`));if(r)return{method:e,params:i,renames:l}}return null}async function Us(e,t,n,s){const a=s?.timeout??3e4;let{method:i,params:r}=s?.raw?{method:t,params:n}:nv(t,n);const l=async(c,u)=>Promise.race([e.request(c,u),new Promise((h,f)=>setTimeout(()=>f(new Error(`Request timeout (${a}ms): ${c}`)),a))]);try{return{ok:!0,data:await l(i,r),method:i,healed:i!==t}}catch(c){const u=String(c instanceof Error?c.message:c);if(s?.raw)return{ok:!1,error:u,method:t};const h=sv(i,r,u);if(h)try{const f=await l(h.method,h.params);return Ot.set(t,{resolvedMethod:h.method,fieldRenames:h.renames,ts:Date.now()}),ul(),{ok:!0,data:f,method:h.method,healed:!0}}catch(f){return{ok:!1,error:String(f instanceof Error?f.message:f),method:h.method,healed:!0}}if(s?.fallbacks)for(const f of s.fallbacks)try{const m=await l(f,r);return Ot.set(t,{resolvedMethod:f,fieldRenames:{},ts:Date.now()}),ul(),{ok:!0,data:m,method:f,healed:!0}}catch{continue}return{ok:!1,error:u,method:i}}}function Bd(){Ot.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function av(){const e={};for(const[t,n]of Ot)e[t]=n;return e}const iv=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:Bd,getHealingEntries:av,safeRequest:Us},Symbol.toStringTag,{value:"Module"}));let be=null;function Fd(e,t){Bd();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;be={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const a=sessionStorage.getItem("godmode:host-compat");if(a){const i=JSON.parse(a);if(i.hostVersion===n&&i.methods)return be.methods=i.methods,be.probing=!1,be}}catch{}return rv(t).catch(()=>{}),be}async function rv(e){if(!be)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(a){const i=String(a instanceof Error?a.message:a),r=i.toLowerCase(),l=r.includes("unknown method")||r.includes("not found")&&r.includes("method");s.available=!l,l&&(s.error="method not available");const c=i.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);c&&(s.fields=c[1].split(",").map(u=>u.trim().replace(/['"]/g,"")))}be.methods[n.method]=s}be.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(be))}catch{}}function Ud(e){if(!be)return;const t=be.methods[e];if(t)return t.available}function ov(){return be?.hostVersion??"unknown"}function lv(){return be}function cv(){return be?.probing??!1}async function zd(e,t,n){const s=await Us(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await Us(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function dv(e,t,n){if(Ud("sessions.autoTitle")!==!1){const l=await Us(e,"sessions.autoTitle",{sessionKey:t});if(l.ok)return{ok:!0,title:l.data?.title}}const a=n.find(l=>l.role==="user");if(!a)return{ok:!1,error:"No user message to derive title from"};const i=uv(a.content),r=await zd(e,t,i);return r.ok?{ok:!0,title:i}:{ok:!1,error:r.error}}function uv(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),a=s.lastIndexOf(" ");t=(a>30?s.slice(0,a):s)+"..."}return t}function pv(e){return String(e.label??e.displayName??e.key??"Untitled")}const hv=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:lv,getHostVersion:ov,hasMethod:Ud,hostAutoTitle:dv,hostPatchSession:zd,initHostCompat:Fd,isProbing:cv,readSessionName:pv},Symbol.toStringTag,{value:"Module"})),Ei=new Map;let pl=null,Ga=!1;function fv(e,t,n){return Ei.get(`${e}:${t}:${n}`)??null}async function Kd(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const a=e.chatMessages[s],i=ki(a);for(let r=0;r<i.length;r++)if(i[r].url&&!i[r].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(i[r].url);l&&n.push({data:l[2],mimeType:l[1],messageIndex:s,imageIndex:r,role:a.role||"unknown",timestamp:typeof a.timestamp=="number"?a.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(a=>({data:a.data,mimeType:a.mimeType})),sessionKey:t});if(s?.cached){const a=n.map((i,r)=>({messageIndex:i.messageIndex,imageIndex:i.imageIndex,hash:s.cached[r]?.hash,mimeType:i.mimeType,bytes:s.cached[r]?.bytes??0,role:i.role,timestamp:i.timestamp})).filter(i=>!!i.hash);a.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:a})}}catch{}if(!Ga){Ga=!0;try{const s=rd();s&&await s.catch(()=>{});const a=async()=>{const r=await e.client.request("images.resolve",{sessionKey:t});if(r?.images&&Object.keys(r.images).length>0){pl!==t&&Ei.clear();for(const[l,c]of Object.entries(r.images))Ei.set(`${t}:${l}`,c);return pl=t,e.chatMessages=[...e.chatMessages],!0}return!1};!await a()&&e.chatMessages?.some(r=>ki(r).some(c=>c.omitted||!c.url))&&(await new Promise(r=>setTimeout(r,500)),await a())}catch{}finally{Ga=!1}}}function Wd(e){Kd(e)}const Rn=[];function gv(){return[...Rn]}let lt=null;const mv=10,vv=1e3,Zt=new Map;function Qa(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const a=t.mainKey?.trim()||"main",i=t.defaultAgentId?.trim();return n==="main"||n===a||i&&(n===`agent:${i}:main`||n===`agent:${i}:${a}`)?s:n}function yv(e,t){if(!t?.mainSessionKey)return;const n=Qa(e.sessionKey,t),s=Qa(e.settings.sessionKey,t),a=Qa(e.settings.lastActiveSessionKey,t),i=n||s||e.sessionKey,r={...e.settings,sessionKey:s||i,lastActiveSessionKey:a||i},l=r.sessionKey!==e.settings.sessionKey||r.lastActiveSessionKey!==e.settings.lastActiveSessionKey;i!==e.sessionKey&&(e.sessionKey=i),l&&Ye(e,r)}function bv(e){lt&&(clearTimeout(lt),lt=null);const t=(e.reconnectAttempt??0)+1;if(t>mv){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(vv*Math.pow(2,t-1),3e4);lt=setTimeout(()=>{lt=null,e.connected||gr(e)},n)}async function wv(e){if(e.client)try{const t=await e.client.request("projects.list",{}),n=e;n.workspaceNeedsSetup=!t?.projects||t.projects.length===0}catch{}}async function kv(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const a=e;a.showSetupTab=!0,n.identity?.name&&(a.setupQuickDone=!0)}else{s.onboardingActive=!1,s.onboardingData=n??null;const a=e;a.showSetupTab=!1}}catch{}}function $v(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const hl=new Set;function Sv(e){const t=e.find(a=>a.role==="user");if(!t)return null;let n="";typeof t.content=="string"?n=t.content:Array.isArray(t.content)&&(n=t.content.find(i=>i.type==="text")?.text??"");let s=n.split(`
`)[0]?.trim()??"";return s=s.replace(/^#+\s*/,"").replace(/[*_`~[\]]/g,"").trim(),s?(s.length>60&&(s=s.slice(0,57).replace(/\s+\S*$/,"")+"..."),s):null}async function Av(e,t){if(!t.includes("webchat")||e.privateSessions?.has(t)||hl.has(t))return;const n=e.sessionsResult?.sessions?.find(s=>s.key===t);if(!(n?.label?.trim()||n?.displayName?.trim())){if(hl.add(t),!e.client||!e.connected){console.warn("[auto-title] skipped: not connected");return}try{const a=Sv(e.chatMessages??[]);if(!a){console.warn("[auto-title] no user message found to derive title");return}const{hostPatchSession:i}=await R(async()=>{const{hostPatchSession:l}=await Promise.resolve().then(()=>hv);return{hostPatchSession:l}},void 0,import.meta.url),r=await i(e.client,t,a);if(!r.ok){console.error("[auto-title] patch failed:",r.error);return}Te.set(t,a),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(l=>l.key===t?{...l,label:a,displayName:a}:l)}),e.requestUpdate?.()}catch(s){console.error("[auto-title] RPC call failed:",s)}}}function gr(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null;const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),lt&&(clearTimeout(lt),lt=null),e.client?.stop(),e.client=new Zm({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const i=e;"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null),e.workingSessions.clear(),e.requestUpdate?.();for(const r of Zt.values())clearTimeout(r);Zt.clear()}Fd(n,e.client),Ev(e,n),id(e),am(e),ia(e,{quiet:!0}),ht(e,{quiet:!0}),ne(e),Zn(e),wv(e).then(()=>kv(e)),_v(e),Cv(e),Qm(e),Lv(e)},onClose:({code:n,reason:s})=>{e.connected=!1,Ym(e);const a=e;"chatSending"in a&&(a.chatSending=!1),"chatSendingSessionKey"in a&&(a.chatSendingSessionKey=null),"chatRunId"in a&&(a.chatRunId=null),"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const i=e;"sessionsLoading"in i&&(i.sessionsLoading=!1),"agentsLoading"in i&&(i.agentsLoading=!1),"nodesLoading"in i&&(i.nodesLoading=!1),"devicesLoading"in i&&(i.devicesLoading=!1),"channelsLoading"in i&&(i.channelsLoading=!1),"presenceLoading"in i&&(i.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),bv(e)},onEvent:n=>Tv(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function Tv(e,t){try{xv(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function xv(e,t){if(Rn.unshift({ts:Date.now(),event:t.event,payload:t.payload}),Rn.length>250&&(Rn.length=250),e.tab==="debug"&&(e.eventLog=[...Rn]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),Ch(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Cr(e,n.sessionKey),n.state==="delta"){const a=Zt.get(n.sessionKey);a&&(clearTimeout(a),Zt.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.())}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=Zt.get(n.sessionKey);a&&(clearTimeout(a),Zt.delete(n.sessionKey)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&$v(e,n.sessionKey);const s=cd(e,n);if(n.state==="final"&&(async()=>{try{await ne(e,{activeMinutes:0})}catch(a){console.error("[auto-title] loadSessions failed, proceeding anyway:",a)}Av(e,n.sessionKey)})(),(s==="final"||s==="error"||s==="aborted")&&(Hi(e),Su(e),s==="final"&&e.compactionStatus?.active&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()}),(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1),s==="final"){const a=!!e.compactionStatus?.completedAt;od(e,{allowShrink:a}).then(()=>{Kd(e)});const i=e;i.tab==="dashboards"&&i.activeDashboardManifest?.sessionId&&i.activeDashboardManifest.sessionId===n.sessionKey&&R(async()=>{const{loadDashboard:r}=await import("./dashboards-BWn_hwxU.js");return{loadDashboard:r}},[],import.meta.url).then(({loadDashboard:r})=>{r(e,i.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&ha(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&ht(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=qm(t.payload);if(n){e.execApprovalQueue=jm(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=ll(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,a=n.status==="completed"?"✓":"✗",i=n.status==="completed"?"success":"warning",r=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${a} Process ${r} ${n.status} (${s})`,i,5e3)}return}if(t.event==="exec.approval.resolved"){const n=Hm(t.payload);n&&(e.execApprovalQueue=ll(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const i={...e.dynamicSlots};delete i[n.tabId],e.dynamicSlots=i}e.requestUpdate?.()}return}if(t.event==="focusPulse:update"){const n=t.payload;if(n){const s=e;s.focusPulseData=n,s.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="proactiveIntel:insight"){const n=e;typeof n.handleIntelLoad=="function"&&n.handleIntelLoad();const s=t.payload;s?.newInsights&&typeof n.showToast=="function"&&n.showToast(`${s.newInsights} new intelligence insight${s.newInsights>1?"s":""} available`,"info",6e3);return}if(t.event==="proactiveIntel:update"){const n=e,s=n.secondBrainSubtab;typeof n.handleIntelLoad=="function"&&e.tab==="second-brain"&&s==="intel"&&n.handleIntelLoad();return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),s.requestUpdate?.()}return}}async function _v(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Cv(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function Lv(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const a=await e.client.request("tasks.openSession",{taskId:n});if(a?.sessionKey){e.sessionKey=a.sessionKey,e.tab="chat";const{loadChatHistory:i}=await R(async()=>{const{loadChatHistory:r}=await Promise.resolve().then(()=>at);return{loadChatHistory:r}},void 0,import.meta.url);await i(e,a.sessionKey)}}catch(a){console.error("[GodMode] Failed to open task session:",a)}}function Ev(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&yv(e,n.sessionDefaults)}async function ra(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,a]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const i=s;e.debugModels=Array.isArray(i?.models)?i?.models:[],e.debugHeartbeat=a}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Rv(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Iv=2e3,Pv=new Set(["trace","debug","info","warn","error","fatal"]);function Mv(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function Dv(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Pv.has(t)?t:null}function Ov(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,a=Dv(n?.logLevelName??n?.level),i=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,r=Mv(i);let l=null;r&&(typeof r.subsystem=="string"?l=r.subsystem:typeof r.module=="string"&&(l=r.module)),!l&&i&&i.length<120&&(l=i);let c=null;return typeof t[1]=="string"?c=t[1]:!r&&typeof t[0]=="string"?c=t[0]:typeof t.message=="string"&&(c=t.message),{raw:e,time:s,level:a,subsystem:l,message:c??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function mr(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),i=(Array.isArray(s.lines)?s.lines.filter(l=>typeof l=="string"):[]).map(Ov),r=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=r?i:[...e.logsEntries,...i].slice(-Iv),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const qd={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Swarm"};function Ya(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):qd[t??e]??e}function Hd(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const a=Math.floor(s/60),i=s%60;if(a<60)return`${a}m ${i}s`;const r=Math.floor(a/60),l=a%60;return`${r}h ${l}m`}function Nv(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function Bv(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function Fv(e,t){const n=[],s=new Set;for(const a of t){a.childSessionKey&&s.add(a.childSessionKey);const i=a.swarm?.enabled===!0,r=a.status==="review";n.push({id:a.id,type:i?"swarm":"coding",task:a.description,status:Bv(a.status),model:a.model??null,startedAt:a.startedAt??a.createdAt,endedAt:a.completedAt??null,branch:a.branch,prUrl:a.prUrl,swarmStage:i?a.swarm.currentStage:void 0,swarmStages:i?a.swarm.stages:void 0,error:a.error,canCancel:a.status==="running"||a.status==="validating"||a.status==="queued",roleName:i?"Swarm":"Builder",childSessionKey:a.childSessionKey,isReview:r})}for(const a of e)s.has(a.childSessionKey)||n.push({id:a.runId,type:"subagent",task:a.task,status:a.endedAt?a.outcome?.status==="error"?"failed":"done":"active",model:a.model,startedAt:a.startedAt??a.createdAt,endedAt:a.endedAt,label:a.label,error:a.outcome?.error??void 0,roleName:a.label??"Sub-Agent",childSessionKey:a.childSessionKey});return n.sort((a,i)=>{const r={active:0,queued:1,failed:2,done:3},l=r[a.status]-r[i.status];return l!==0?l:(i.startedAt??0)-(a.startedAt??0)}),n}function Uv(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function zv(e,t=0,n=0){const s=Nv();let a=0,i=0,r=0,l=0;for(const u of e)u.status==="active"&&a++,u.status==="done"&&u.endedAt&&u.endedAt>=s&&i++,u.status==="failed"&&u.endedAt&&u.endedAt>=s&&r++,u.type==="swarm"&&(u.status==="active"||u.status==="queued")&&l++;const c=e.filter(u=>u.isReview&&(u.type==="coding"||u.type==="swarm")).length;return{activeNow:a,completedToday:i,failed:r,swarmPipelines:l,queueDepth:t,queueReview:n+c}}async function pn(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}const[a,i]=await Promise.all([e.client.request("subagents.list",{limit:200}),e.client.request("coding.list",{})]),r=Fv(a.runs??[],i.tasks??[]),l=s?.items??[],c=[];let u=0;for(const g of l)g.status==="processing"?r.push({id:g.id,type:"queue",task:g.title,status:"active",model:null,startedAt:g.startedAt??g.createdAt,endedAt:null,error:g.error,roleName:Ya(g.type,void 0,g.personaHint),queueItemType:g.type,outputPath:g.result?.outputPath,sourceTaskId:g.sourceTaskId,retryCount:g.retryCount,prUrl:g.result?.prUrl}):g.status==="review"?(u++,r.push({id:g.id,type:"queue",task:g.title,status:"done",model:null,startedAt:g.startedAt??g.createdAt,endedAt:g.completedAt??null,roleName:Ya(g.type,void 0,g.personaHint),queueItemType:g.type,outputPath:g.result?.outputPath,sourceTaskId:g.sourceTaskId,retryCount:g.retryCount,prUrl:g.result?.prUrl,isReview:!0})):g.status==="failed"?r.push({id:g.id,type:"queue",task:g.title,status:"failed",model:null,startedAt:g.startedAt??g.createdAt,endedAt:g.completedAt??null,error:g.error,roleName:Ya(g.type,void 0,g.personaHint),queueItemType:g.type,outputPath:g.result?.outputPath,sourceTaskId:g.sourceTaskId,retryCount:g.retryCount}):g.status==="pending"&&c.push(g);r.sort((g,w)=>{const S={active:0,queued:1,failed:2,done:3},T=S[g.status]-S[w.status];return T!==0?T:(w.startedAt??0)-(g.startedAt??0)});const h=c.length,f=zv(r,h,u),m=Uv(r);n.missionControlData={agents:r,stats:f,activityFeed:m,lastRefreshedAt:Date.now(),queueItems:c}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function Kv(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await pn(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function Wv(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,a=n?.item?.title??"task";if(s){const i=s.replace(/-/g," ").replace(/\b\w/g,r=>r.toUpperCase());e.showToast(`Approved! How did ${i} do on "${a}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await pn(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function qv(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await pn(e),!0):!1}catch{return!1}}async function Hv(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.update",{id:t,status:"pending"}),await e.client.request("queue.process",{id:t}),e.showToast("Retrying...","success",2e3),await pn(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function jv(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}const Gt=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:qd,approveCodingTask:qv,approveQueueItem:Wv,cancelCodingTask:Kv,formatDuration:Hd,loadAgentDetail:jv,loadMissionControl:pn,retryQueueItem:Hv},Symbol.toStringTag,{value:"Module"}));function vr(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ia(e,{quiet:!0})},5e3))}function yr(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function br(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&mr(e,{quiet:!0})},2e3))}function wr(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function kr(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&ra(e)},3e3))}function $r(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function jd(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&pn(e,{quiet:!0})},5e3))}function Vd(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function Xn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function oa(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function Vv(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Is(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function Gv(e){if(e.payloadKind==="systemEvent"){const a=e.payloadText.trim();if(!a)throw new Error("System event text required.");return{kind:"systemEvent",text:a}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Is(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function Qv(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Vv(e.cronForm),n=Gv(e.cronForm),s=e.cronForm.agentId.trim(),a={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!a.name)throw new Error("Name required.");await e.client.request("cron.add",a),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await oa(e),await Xn(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function Yv(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await oa(e),await Xn(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function Xv(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await Gd(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Jv(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await oa(e),await Xn(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Gd(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Bt(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function Zv(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const a=e.guardrailsData?.gates.find(i=>i.id===t)?.name??t;e.showToast(`${a} ${n?"enabled":"disabled"}`,"success",2e3),await Bt(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function ey(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Bt(e)}catch(a){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",a)}}async function ty(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Bt(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function ny(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Bt(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function sy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Bt(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const Qt=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:sy,deleteCustomGuardrail:ny,loadGuardrails:Bt,toggleCustomGuardrail:ty,toggleGuardrail:Zv,updateGuardrailThreshold:ey},Symbol.toStringTag,{value:"Module"}));function ay(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function iy(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function Sr(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=ay(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);ry(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function ry(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Rt(t.file??{}))}async function oy(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},a=iy(t,{file:s,baseHash:n});if(!a){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(a.method,a.params),e.execApprovalsDirty=!1,await Sr(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function ly(e,t,n){const s=Rt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Ac(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function cy(e,t){const n=Rt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Tc(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function Qd(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("lifetracks.config.get",{});t&&(e.lifetracksConfig=t)}catch(t){console.error("Failed to load lifetracks config:",t)}}async function zs(e){if(!e.client||!e.connected){e.lifetracksError="Not connected to gateway";return}e.lifetracksLoading=!0,e.lifetracksError=null;try{await Qd(e);const t=await e.client.request("lifetracks.list",{});if(t?.lifetracks)if(e.lifetracksData=t.lifetracks,t.lifetracks.length>0){const n=te(),s=t.lifetracks.find(a=>a.date===n);e.lifetracksCurrentTrack=s||t.lifetracks[0]}else e.lifetracksCurrentTrack=null;else e.lifetracksData=[],e.lifetracksCurrentTrack=null}catch(t){e.lifetracksError=t instanceof Error?t.message:"Failed to load lifetracks"}finally{e.lifetracksLoading=!1}}function dy(e,t){e.lifetracksCurrentTrack=t}async function uy(e){if(!e.client||!e.connected)return e.lifetracksError="Not connected to gateway",!1;try{const t=await e.client.request("lifetracks.config.update",{enabled:!0});return t?.updated?(e.lifetracksConfig=t.config,await zs(e),!0):!1}catch(t){return e.lifetracksError=t instanceof Error?t.message:"Failed to enable lifetracks",!1}}async function py(e,t){if(!e.client||!e.connected)return e.lifetracksGenerationError="Not connected to gateway",!1;e.lifetracksGenerating=!0,e.lifetracksGenerationError=null;try{const n=await e.client.request("lifetracks.generate",t||{});return n?.generated&&n.track?(e.lifetracksData=[n.track,...e.lifetracksData||[]],e.lifetracksCurrentTrack=n.track,await Qd(e),!0):n?.alreadyExists&&n.track?(e.lifetracksCurrentTrack=n.track,!0):(e.lifetracksGenerationError=n?.error||"Generation failed",!1)}catch(n){return e.lifetracksGenerationError=n instanceof Error?n.message:"Failed to generate lifetrack",!1}finally{e.lifetracksGenerating=!1}}const hy=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function fy(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...hy]}function gy(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function Yd(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function Xd(e,t,n){const s=t||te(),a="agentLog.get";try{const i=await e.request(a,{date:s});if(i?.content?.trim()&&i?.sourcePath)return{date:i.date||s,content:i.content,updatedAt:i.updatedAt||new Date().toISOString(),sourcePath:i.sourcePath}}catch(i){console.warn(`[MyDay] ${a} unavailable, falling back to files.read:`,i)}return my(e,s)}async function my(e,t){const n=fy(t),s=a=>a.includes("AGENT-DAY.md");for(const a of n)try{const i=await e.request("files.read",{path:a,maxSize:1e6});if(!i?.content?.trim()||!gy(i.content)||s(a)&&typeof i.modifiedAt=="number"&&te(new Date(i.modifiedAt))!==t)continue;return{date:t,content:i.content,updatedAt:typeof i.modifiedAt=="number"?new Date(i.modifiedAt).toISOString():new Date().toISOString(),sourcePath:a}}catch{}return null}function ys(e,t,n){return new Promise((s,a)=>{const i=setTimeout(()=>a(new Error(`${n} timed out after ${t}ms`)),t);e.then(r=>{clearTimeout(i),s(r)},r=>{clearTimeout(i),a(r)})})}const vy={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function Jd(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??te(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),a=new Map;for(const r of s.items)r.sourceTaskId&&(r.status==="processing"||r.status==="review"||r.status==="failed")&&a.set(r.sourceTaskId,{status:r.status,type:r.type,roleName:vy[r.type]??r.type,queueItemId:r.id});const i=(n.tasks??[]).map(r=>({id:r.id,title:r.title,status:r.status,project:r.project,dueDate:r.dueDate,priority:r.priority,createdAt:r.createdAt,completedAt:r.completedAt,queueStatus:a.get(r.id)??null}));return e.todayTasks=i,i}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}function Zd(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function xs(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await Yd(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function Tt(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await Xd(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function eu(e){const t=e||te(),n="VAULT",s=`01-Daily/${t}`,a=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(a,"_blank")}async function Ks(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?ys(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([ys(Yd(e.client,t),1e4,"Daily Brief"),n,ys(Xd(e.client,t),1e4,"Agent Log"),ys(Jd(e),8e3,"Today Tasks")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null,Zd(e.client,e.todaySelectedDate);const a=["Brief","Brief Notes","Agent Log","Today Tasks"],i=s.map((r,l)=>r.status==="rejected"?{section:a[l],reason:r.reason}:null).filter(Boolean);if(i.length>0){for(const r of i)console.warn(`[MyDay] ${r.section} failed:`,r.reason);i.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}function yy(e,t){const n=s=>{t(s)};return e.on("daily-brief:update",n),()=>{e.off("daily-brief:update",n)}}function tu(e,t){const n=()=>{t()};return e.on("agent-log:update",n),()=>{e.off("agent-log:update",n)}}const Xa=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:Tt,loadBriefOnly:xs,loadMyDay:Ks,loadTodayTasksWithQueueStatus:Jd,openBriefInObsidian:eu,subscribeToAgentLogUpdates:tu,subscribeToBriefUpdates:yy,syncTodayTasks:Zd},Symbol.toStringTag,{value:"Module"}));async function nu(e){if(!(!e.client||!e.connected)){e.peopleLoading=!0,e.peopleError=null;try{const t=await e.client.request("people.list",{});e.peopleList=t.people??[]}catch(t){console.error("[People] Failed to load contacts:",t),e.peopleError=t instanceof Error?t.message:"Failed to load contacts"}finally{e.peopleLoading=!1}}}async function Ar(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function on(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function la(e){return e instanceof Error?e.message:String(e)}async function Jn(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=la(n)}finally{e.skillsLoading=!1}}}function by(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function wy(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await Jn(e),on(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const a=la(s);e.skillsError=a,on(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function ky(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await Jn(e),on(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=la(n);e.skillsError=s,on(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function $y(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const a=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await Jn(e),on(e,t,{kind:"success",message:a?.message??"Installed"})}catch(a){const i=la(a);e.skillsError=i,on(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function Ri(e){if(!e.client||!e.connected){e.visionBoardError="Not connected to gateway";return}e.visionBoardLoading=!0,e.visionBoardError=null;try{const[t,n]=await Promise.all([e.client.request("visionBoard.get",{}),e.client.request("visionBoard.identityToday",{})]);t?e.visionBoardData=t:e.visionBoardError="No data returned",n&&(e.visionBoardIdentityToday=n.identity)}catch(t){e.visionBoardError=t instanceof Error?t.message:"Failed to load vision board"}finally{e.visionBoardLoading=!1}}async function Ws(e){if(!e.client||!e.connected){e.wheelOfLifeError="Not connected to gateway";return}e.wheelOfLifeLoading=!0,e.wheelOfLifeError=null;try{const t=await e.client.request("wheelOfLife.get",{});t?e.wheelOfLifeData=t:e.wheelOfLifeError="No data returned"}catch(t){e.wheelOfLifeError=t instanceof Error?t.message:"Failed to load wheel data"}finally{e.wheelOfLifeLoading=!1}}async function Sy(e,t){if(!e.client||!e.connected)return e.wheelOfLifeError="Not connected to gateway",!1;try{return(await e.client.request("wheelOfLife.update",{updates:t}))?.updated?(await Ws(e),!0):!1}catch(n){return e.wheelOfLifeError=n instanceof Error?n.message:"Failed to update wheel",!1}}function Ay(e){e.wheelOfLifeEditMode=!0}function fl(e){e.wheelOfLifeEditMode=!1}async function su(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function Ty(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const a=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:a}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}function ca(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Tr(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ca(e.lastUpdated,e.lastScanned)}}function gl(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ca(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function ml(e){return{id:e.id,key:e.key,title:e.title,created:ca(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function Ft(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function au(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ca(t.modified):void 0,children:t.children?au(t.children):void 0}))}function xy(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function da(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Tr),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=xy(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function ua(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Tr(n.workspace),pinned:(n.pinned??[]).map(gl),pinnedSessions:(n.pinnedSessions??[]).map(ml),outputs:(n.outputs??[]).map(gl),folderTree:n.folderTree?au(n.folderTree):void 0,sessions:(n.sessions??[]).map(ml),tasks:(n.tasks??[]).map(Ft)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function _y(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function Cy(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await da(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function Ly(e,t){if(!t){e.selectedWorkspace=null;return}const n=await ua(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Ey(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const a=await ua(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] pin toggle failed:",a),!1}}async function Ry(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const a=await ua(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] session pin toggle failed:",a),!1}}async function Iy(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",a=String(t.path??"").trim();try{const i=await e.client.request("workspaces.create",{name:n,type:s,...a?{path:a}:{}});if(!i.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const r=Tr(i.workspace),l=e.workspaces??[],c=new Map(l.map(u=>[u.id,u]));return c.set(r.id,r),e.workspaces=Array.from(c.values()).toSorted((u,h)=>h.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,r}catch(i){return console.error("[Workspaces] create failed:",i),e.workspacesError=i instanceof Error?i.message:"Failed to create workspace",null}}async function Py(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function My(e,t){e.workspacesSearchQuery=t}function Dy(e){e.selectedWorkspace=null}async function Oy(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function Ny(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function By(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(Ft)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function Fy(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(Ft)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const Uy={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function zy(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const a of n.items)a.sourceTaskId&&(a.status==="processing"||a.status==="review"||a.status==="failed")&&s.set(a.sourceTaskId,{status:a.status,type:a.type,roleName:Uy[a.type]??a.type,queueItemId:a.id});return(t.tasks??[]).map(a=>({...Ft(a),queueStatus:s.get(a.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function Ky(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const a=await e.client.request("tasks.update",{id:t,status:s});return Ft(a)}catch(a){return console.error("[Workspaces] toggleTaskComplete failed:",a),null}}async function Wy(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return Ft(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function qy(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function Hy(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return Ft(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function jy(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function Vy(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(a){return console.error("[Workspaces] search failed:",a),[]}}async function Gy(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function Qy(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(a){return console.error("[Workspaces] moveFile failed:",a),!1}}async function Yy(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(a){return console.error("[Workspaces] renameFile failed:",a),!1}}const pe=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:jy,clearWorkspaceSelection:Dy,createTask:Hy,createWorkspace:Iy,createWorkspaceFolder:Gy,deleteWorkspace:Py,getWorkspace:ua,loadAllTasks:Fy,loadAllTasksWithQueueStatus:zy,loadWorkspaceTasks:By,loadWorkspaces:da,moveWorkspaceFile:Qy,readWorkspaceFile:_y,renameWorkspaceFile:Yy,scanWorkspaces:Cy,searchWorkspaceFiles:Vy,selectWorkspace:Ly,setWorkspacesSearchQuery:My,startTask:qy,startTeamSetup:Oy,toggleTaskComplete:Ky,toggleWorkspaceFolder:Ny,toggleWorkspacePin:Ey,toggleWorkspaceSessionPin:Ry,updateTask:Wy},Symbol.toStringTag,{value:"Module"})),Xy=[{label:"",tabs:["chat","today","mission-control","workspaces","second-brain","dashboards"]},{label:"Toolkit",tabs:["skills","trust","guardrails","options"]},{label:"Settings",tabs:["config","debug","logs"]},{label:"System",tabs:["overview","channels","instances","sessions","cron","nodes"]}],iu={setup:"/setup",options:"/options",overview:"/overview",workspaces:"/workspaces",today:"/today",work:"/work",people:"/people",life:"/life",data:"/data","my-day":"/today","wheel-of-life":"/wheel-of-life","vision-board":"/vision-board",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain",intel:"/intel","mission-control":"/mission-control",dashboards:"/dashboards"},ln=new Map(Object.entries(iu).map(([e,t])=>[t,e]));ln.set("/today","today");ln.set("/my-day","today");ln.set("/work","workspaces");function pa(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Gn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function xr(e,t=""){const n=pa(t),s=iu[e];return n?`${n}${s}`:s}function ru(e,t=""){const n=pa(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let a=Gn(s).toLowerCase();return a.endsWith("/index.html")&&(a="/"),a==="/"?"chat":ln.get(a)??null}function Jy(e){let t=Gn(e);if(t.endsWith("/index.html")&&(t=Gn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const a=`/${n.slice(s).join("/")}`.toLowerCase();if(ln.has(a)){const i=n.slice(0,s);return!i.length||i.some(l=>ln.has(`/${l.toLowerCase()}`))?"":`/${i.join("/")}`}}return`/${n.join("/")}`}function qs(e){switch(e){case"setup":return"Setup";case"chat":return"Chat";case"today":case"my-day":return"Today";case"work":return"Work";case"people":return"People";case"life":return"Life";case"data":return"Data";case"overview":return"Overview";case"workspaces":return"Work";case"wheel-of-life":return"Wheel of Life";case"vision-board":return"Vision Board";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"nodes":return"Nodes";case"options":return"Lab";case"trust":return"Trust";case"guardrails":return"Guardrails";case"second-brain":return"Second Brain";case"intel":return"Intel";case"mission-control":return"Mission Control";case"dashboards":return"Dashboards";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function Zy(e){switch(e){case"setup":return"🚀";case"chat":return"💬";case"today":case"my-day":return"☀️";case"work":return"💼";case"people":return"👥";case"life":return"✨";case"data":return"📊";case"overview":return"🎯";case"workspaces":return"📂";case"wheel-of-life":return"🎡";case"vision-board":return"🌠";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"intel":return"📡";case"mission-control":return"🛰️";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function eb(e){switch(e){case"setup":return"Get GodMode configured and running.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":case"my-day":return"Calendar, brief, tasks, and schedule for the day.";case"work":return"Your projects, files, tasks, and team — organized by workspace.";case"people":return"Contacts, relationships, and follow-up suggestions.";case"life":return"Vision board, goals, life scores, and LifeTracks.";case"data":return"Connected integrations, data sources, and query interface.";case"overview":return"Gateway status, entry points, and a fast health read.";case"workspaces":return"Projects, clients, and personal operating context.";case"wheel-of-life":return"Track balance across 8 life dimensions with scores, targets, and trends.";case"vision-board":return"Your Chief Definite Aim, annual themes, values, and identity statements.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"options":return"Toggle experimental features and modules on and off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Safety gates that prevent runaway loops, bad searches, and lazy responses.";case"second-brain":return"Your Obsidian-powered second brain — identity, knowledge, and live AI context.";case"intel":return"Proactive intelligence — discoveries, insights, and pattern analysis.";case"mission-control":return"Live command center — active agents, pipelines, and activity feed.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Edit ~/.openclaw/config.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const ou="godmode.ui.settings.v1";function tb(){const e=new URLSearchParams(location.search),t=(()=>{const a=e.get("gatewayUrl");return a||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0},openTabs:["agent:main:main"],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const a=localStorage.getItem(ou);if(!a)return s;const i=JSON.parse(a);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof i.gatewayUrl=="string"&&i.gatewayUrl.trim()?i.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof i.token=="string"?i.token:""),sessionKey:typeof i.sessionKey=="string"&&i.sessionKey.trim()?i.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof i.lastActiveSessionKey=="string"&&i.lastActiveSessionKey.trim()?i.lastActiveSessionKey.trim():typeof i.sessionKey=="string"&&i.sessionKey.trim()||s.lastActiveSessionKey,theme:i.theme==="light"||i.theme==="dark"||i.theme==="system"||i.theme==="lifetrack"?i.theme:s.theme,chatFocusMode:typeof i.chatFocusMode=="boolean"?i.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof i.chatShowThinking=="boolean"?i.chatShowThinking:s.chatShowThinking,splitRatio:typeof i.splitRatio=="number"&&i.splitRatio>=.4&&i.splitRatio<=.7?i.splitRatio:s.splitRatio,navCollapsed:typeof i.navCollapsed=="boolean"?i.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof i.navGroupsCollapsed=="object"&&i.navGroupsCollapsed!==null?i.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(i.openTabs)&&i.openTabs.every(r=>typeof r=="string")?i.openTabs:s.openTabs,tabLastViewed:typeof i.tabLastViewed=="object"&&i.tabLastViewed!==null?i.tabLastViewed:s.tabLastViewed,userName:typeof i.userName=="string"?i.userName.trim().slice(0,50):s.userName,userAvatar:typeof i.userAvatar=="string"?i.userAvatar.trim():s.userAvatar,chatParallelView:typeof i.chatParallelView=="boolean"?i.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(i.parallelLanes)&&i.parallelLanes.length===4?i.parallelLanes.map(r=>typeof r=="string"?r:null):s.parallelLanes}}catch{return s}}function nb(e){localStorage.setItem(ou,JSON.stringify(e))}const sb=56,ab="quantum-particles",ib="quantum-particle";let ct=null,Dn=null;function $e(e,t){return Math.random()*(t-e)+e}function lu(){if(cu(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Dn=requestAnimationFrame(()=>{Dn=null,lu()});return}ct=document.createElement("div"),ct.className=ab,Object.assign(ct.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<sb;t++){const n=document.createElement("div");n.className=ib;const s=$e(2,5),a=$e(.3,.65),i=$e(15,35),r=$e(0,12),l=$e(5,95),c=$e(5,95),u=$e(-150,150),h=$e(-200,200),f=$e(-250,250),m=$e(-350,350),g=$e(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${l}%`,top:`${c}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${$e(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${a*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${i}s ${r}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(a)),n.style.setProperty("--drift-x",`${u}px`),n.style.setProperty("--drift-y",`${h}px`),n.style.setProperty("--drift-end-x",`${f}px`),n.style.setProperty("--drift-end-y",`${m}px`),n.style.setProperty("--particle-scale-mid",String(g)),ct.appendChild(n)}e.prepend(ct)}function cu(){Dn!==null&&(cancelAnimationFrame(Dn),Dn=null),ct&&(ct.remove(),ct=null)}function rb(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function _r(e){return e==="system"?rb():e==="light"?"lifetrack":e}const bs=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,ob=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Cn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},lb=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const a=globalThis.document??null;if(!a){t();return}const i=a.documentElement,r=a,l=ob();if(!!r.startViewTransition&&!l){let u=.5,h=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=bs(n.pointerClientX/window.innerWidth),h=bs(n.pointerClientY/window.innerHeight);else if(n?.element){const m=n.element.getBoundingClientRect();m.width>0&&m.height>0&&typeof window<"u"&&(u=bs((m.left+m.width/2)/window.innerWidth),h=bs((m.top+m.height/2)/window.innerHeight))}i.style.setProperty("--theme-switch-x",`${u*100}%`),i.style.setProperty("--theme-switch-y",`${h*100}%`),i.classList.add("theme-transition");const f=setTimeout(()=>{Cn(i)},1e3);try{const m=r.startViewTransition?.(()=>{t()});m?.finished?m.finished.finally(()=>{clearTimeout(f),Cn(i)}):(clearTimeout(f),Cn(i))}catch{clearTimeout(f),Cn(i),t()}return}t(),Cn(i)};function cb(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];return n.length===0&&n.push(t),n}function db(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const a=n.trim();!a||typeof s!="number"||!Number.isFinite(s)||(t[a]=Math.max(t[a]??0,s))}return t}function Ye(e,t){const n=t.sessionKey.trim()||"main",s=cb(t.openTabs,n),a=db(t.tabLastViewed),i={...t,sessionKey:n,openTabs:s,tabLastViewed:a,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=i,nb(i),i.theme!==e.theme&&(e.theme=i.theme,es(e,_r(i.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Cr(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&Ye(e,{...e.settings,lastActiveSessionKey:n})}function du(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),a=t.get("session"),i=t.get("gatewayUrl");let r=!1;if(n!=null){const c=n.trim();c&&c!==e.settings.token&&Ye(e,{...e.settings,token:c}),t.delete("token"),r=!0}if(s!=null){const c=s.trim();c&&(e.password=c),t.delete("password"),r=!0}if(a!=null){const c=a.trim();if(c){e.sessionKey=c;const u=e.settings.openTabs.includes(c)?e.settings.openTabs:[...e.settings.openTabs,c];Ye(e,{...e.settings,sessionKey:c,lastActiveSessionKey:c,openTabs:u})}}if(i!=null){const c=i.trim();c&&c!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=c),t.delete("gatewayUrl"),r=!0}if(!r)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function Lr(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const a=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=a}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?vr(e):yr(e),t==="logs"?br(e):wr(e),t==="debug"?kr(e):$r(e),t==="mission-control"?jd(e):Vd(e),Zn(e),Rr(e,t,!1)}function uu(e,t,n){lb({nextTheme:t,applyTheme:()=>{e.theme=t,Ye(e,{...e.settings,theme:t}),es(e,_r(t))},context:n,currentTheme:e.theme})}async function Zn(e){if(e.tab==="overview"&&await Ir(e),(e.tab==="today"||e.tab==="my-day")&&await Ks(e),e.tab==="work"&&await su(e),e.tab==="people"&&await nu(e),e.tab==="workspaces"&&(await da(e),R(()=>Promise.resolve().then(()=>pe),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="wheel-of-life"&&await Ws(e),e.tab==="vision-board"&&await Ri(e),e.tab==="lifetracks"&&await zs(e),e.tab==="life"&&await Promise.all([Ws(e),Ri(e),zs(e)]),e.tab==="data"&&e.handleDataRefresh(),e.tab==="channels"&&await yu(e),e.tab==="instances"&&await Ar(e),e.tab==="sessions"&&(await ne(e),await Dt(e)),e.tab==="cron"&&await ha(e),e.tab==="skills"&&await Jn(e),e.tab==="nodes"&&(await ia(e),await ht(e),await Qe(e),await Sr(e)),e.tab==="chat"&&(await Dr(e),an(e,!e.chatHasAutoScrolled)),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Bt(t)),n.push(ne(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadSetupChecklist=="function"&&t.handleLoadSetupChecklist()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e,n=t.secondBrainSubtab;n==="intel"?typeof t.handleIntelLoad=="function"&&await t.handleIntelLoad():n==="files"?typeof t.handleSecondBrainFileTreeRefresh=="function"&&await t.handleSecondBrainFileTreeRefresh():typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await xc(e),await Qe(e)),e.tab==="debug"&&(await ra(e),e.eventLog=gv()),e.tab==="logs"&&(e.logsAtBottom=!0,await mr(e,{reset:!0}),Ec(e,!0))}function pu(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?pa(e):Jy(window.location.pathname)}function hu(e){e.theme=e.settings.theme??"system",es(e,_r(e.theme))}function es(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?lu():cu()}function fu(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&es(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function gu(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function mu(e,t){if(typeof window>"u")return;const n=ru(window.location.pathname,e.basePath)??"chat";Er(e,n),Rr(e,n,t)}function vu(e){if(typeof window>"u")return;const t=ru(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const a=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];Ye(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:a})}Er(e,t)}function Er(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?vr(e):yr(e),t==="logs"?br(e):wr(e),t==="debug"?kr(e):$r(e),t==="mission-control"?jd(e):Vd(e),e.connected&&Zn(e)}function Rr(e,t,n){if(typeof window>"u")return;const s=Gn(xr(t,e.basePath)),a=Gn(window.location.pathname),i=new URL(window.location.href);t==="chat"&&e.sessionKey?i.searchParams.set("session",e.sessionKey):i.searchParams.delete("session"),a!==s&&(i.pathname=s),n?window.history.replaceState({},"",i.toString()):window.history.pushState({},"",i.toString())}function ye(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function Ir(e){await Promise.all([Pe(e,!1),Ar(e),ne(e),Xn(e),ra(e)])}async function yu(e){await Promise.all([Pe(e,!0),xc(e),Qe(e)])}async function ha(e){await Promise.all([Pe(e,!1),Xn(e),oa(e)])}const ub=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:es,applySettings:Ye,applySettingsFromUrl:du,attachThemeListener:fu,detachThemeListener:gu,inferBasePath:pu,loadChannelsTab:yu,loadCron:ha,loadOverview:Ir,onPopState:vu,refreshActiveTab:Zn,setLastActiveSessionKey:Cr,setTab:Lr,setTabFromRoute:Er,setTheme:uu,syncTabWithLocation:mu,syncThemeWithSettings:hu,syncUrlWithSessionKey:ye,syncUrlWithTab:Rr},Symbol.toStringTag,{value:"Module"}));function Hs(e){return e.chatSending||!!e.chatRunId}function Se(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:a,...i}=e.chatDrafts;e.chatDrafts=i}}function ze(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function bu(e,t){const n=t??e.sessionKey,{[n]:s,...a}=e.chatDrafts;e.chatDrafts=a,n===e.sessionKey&&(e.chatMessage="")}function wu(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function pb(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function Pr(e){e.connected&&(e.chatMessage="",await lr(e))}function hb(e,t,n){const s=t.trim(),a=!!(n&&n.length>0);if(!s&&!a)return;const i=Date.now();e.chatQueue=[...e.chatQueue,{id:sa(),text:s,createdAt:i,attachments:a?n?.map(l=>({...l})):void 0}];const r=[];if(s&&r.push({type:"text",text:s}),a&&n)for(const l of n)r.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:r,timestamp:i}],an(e,!0)}async function Ii(e,t,n){Hi(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{an(e,!0)});const a=await or(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!a&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!a&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),a&&(Cr(e,e.sessionKey),e.chatAttachments=[]),a&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),a&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),an(e,!0),a&&!e.chatRunId&&Mr(e),a&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),a}async function Mr(e){if(!e.connected||Hs(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Ii(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function ku(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function $u(e,t,n){if(!e.connected)return;const s=e.chatMessage,a=(t??e.chatMessage).trim(),i=e.chatAttachments??[],r=t==null?i:[],l=r.length>0;if(!a&&!l)return;if(wu(a)){await Pr(e);return}const c=pb(a);if(t==null&&(e.chatMessage="",bu(e)),n?.queue){hb(e,a,r),Hs(e)||await Mr(e);return}if(Hs(e)){await lr(e),await new Promise(u=>setTimeout(u,50)),await Ii(e,a,{attachments:l?r:void 0,refreshSessions:c});return}await Ii(e,a,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?r:void 0,previousAttachments:t==null?i:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function Dr(e){await Promise.all([le(e),ne(e,{activeMinutes:0}),js(e)]),an(e,!0)}const Su=Mr;function fb(e){const t=Lc(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function gb(e,t){const n=pa(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function js(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=fb(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=gb(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const a=await s.json(),i=typeof a.avatarUrl=="string"?a.avatarUrl.trim():"";e.chatAvatarUrl=i||null}catch{e.chatAvatarUrl=null}}const Ja=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:bu,flushChatQueueForEvent:Su,handleAbortChat:Pr,handleSendChat:$u,isChatBusy:Hs,isChatStopCommand:wu,refreshChat:Dr,refreshChatAvatar:js,removeQueuedMessage:ku,restoreDraft:ze,saveDraft:Se},Symbol.toStringTag,{value:"Module"})),mb={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},vb={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:yb}=Np,vl=e=>e,bb=e=>e.strings===void 0,yl=()=>document.createComment(""),Ln=(e,t,n)=>{const s=e._$AA.parentNode,a=t===void 0?e._$AB:t._$AA;if(n===void 0){const i=s.insertBefore(yl(),a),r=s.insertBefore(yl(),a);n=new yb(i,r,e,e.options)}else{const i=n._$AB.nextSibling,r=n._$AM,l=r!==e;if(l){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==r._$AU&&n._$AP(c)}if(i!==a||l){let c=n._$AA;for(;c!==i;){const u=vl(c).nextSibling;vl(s).insertBefore(c,a),c=u}}}return n},yt=(e,t,n=e)=>(e._$AI(t,n),e),wb={},kb=(e,t=wb)=>e._$AH=t,$b=e=>e._$AH,Za=e=>{e._$AR(),e._$AA.remove()};const bl=(e,t,n)=>{const s=new Map;for(let a=t;a<=n;a++)s.set(e[a],a);return s},fa=Vi(class extends Gi{constructor(e){if(super(e),e.type!==ji.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const a=[],i=[];let r=0;for(const l of e)a[r]=s?s(l,r):r,i[r]=n(l,r),r++;return{values:i,keys:a}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const a=$b(e),{values:i,keys:r}=this.dt(t,n,s);if(!Array.isArray(a))return this.ut=r,i;const l=this.ut??=[],c=[];let u,h,f=0,m=a.length-1,g=0,w=i.length-1;for(;f<=m&&g<=w;)if(a[f]===null)f++;else if(a[m]===null)m--;else if(l[f]===r[g])c[g]=yt(a[f],i[g]),f++,g++;else if(l[m]===r[w])c[w]=yt(a[m],i[w]),m--,w--;else if(l[f]===r[w])c[w]=yt(a[f],i[w]),Ln(e,c[w+1],a[f]),f++,w--;else if(l[m]===r[g])c[g]=yt(a[m],i[g]),Ln(e,a[f],a[m]),m--,g++;else if(u===void 0&&(u=bl(r,g,w),h=bl(l,f,m)),u.has(l[f]))if(u.has(l[m])){const S=h.get(r[g]),T=S!==void 0?a[S]:null;if(T===null){const _=Ln(e,a[f]);yt(_,i[g]),c[g]=_}else c[g]=yt(T,i[g]),Ln(e,a[f],T),a[S]=null;g++}else Za(a[m]),m--;else Za(a[f]),f++;for(;g<=w;){const S=Ln(e,c[w+1]);yt(S,i[g]),c[g++]=S}for(;f<=m;){const S=a[f++];S!==null&&Za(S)}return this.ut=r,kb(e,c),ut}});function ga(e){Se(e);const n=`agent:main:webchat-${sa().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,n,!0),le(e)}function Au(e,t){const n=xr(t,e.basePath);return o`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${qs(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${Zy(t)}</span>
      <span class="nav-item__text">${qs(t)}</span>
    </a>
  `}function Tu(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,a=e.onboarding?!0:e.settings.chatFocusMode,i=o`
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
  `,r=o`
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
  `,l=o`
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
  `,c=o`
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
  `;return o`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>ga(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${u=>{const f=u.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:f.bottom+8,right:window.innerWidth-f.right},e.sessionPickerOpen||ne(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${Y.folderOpen}
        </button>
        ${e.sessionPickerOpen?Tb(e):p}
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
        ${e.sessionSearchOpen?Ab(e):p}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Dr(e)}}
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
        ${Y.brain}
      </button>
      <!-- Focus mode toggle -->
      <button
        class="chat-toolbar__btn ${a?"active":""}"
        ?disabled=${n}
        @click=${()=>{n||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${a}
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
        ${Y.lock}
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
        ${Y.minimize}
      </button>
    </div>
  `}function Sb(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=n),yesterday:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=s&&new Date(a.updatedAt)<n),older:e.filter(a=>!a.updatedAt||new Date(a.updatedAt)<s)}}let ei=null;function Ab(e){if(!e.client||!e.connected)return o`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=a=>{const i=a.target.value;e.sessionSearchQuery=i,ei&&clearTimeout(ei),ei=setTimeout(()=>{e.handleSessionSearchQuery(i)},300)},n=a=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Se(e),e.settings.openTabs.includes(a)?(e.sessionKey=a,e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,a],sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.sessionKey=a),ze(e,a),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,a,!0),le(e)},s=a=>{const i=a.label??a.displayName??a.key,r=a.matches.length>0;return o`
      <div class="session-search-result" @click=${()=>n(a.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${i}</span>
        </div>
        ${r?o`
              <div class="session-search-result__matches">
                ${a.matches.slice(0,2).map(l=>o`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${l.role}:</span>
                      <span class="session-search-result__text">${l.text}</span>
                    </div>
                  `)}
              </div>
            `:p}
      </div>
    `};return o`
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
        ${e.sessionSearchLoading?o`
                <div class="session-search-empty">Searching...</div>
              `:e.sessionSearchQuery.trim()===""?o`
                  <div class="session-search-empty">Type to search session contents</div>
                `:e.sessionSearchResults.length===0?o`
                    <div class="session-search-empty">No results found</div>
                  `:e.sessionSearchResults.map(s)}
      </div>
    </div>
  `}function Tb(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return o`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;if(e.sessionsLoading)return o`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;let n=(e.sessionsResult?.sessions??[]).filter(m=>!e.settings.openTabs.includes(m.key));t&&(n=n.filter(m=>[m.label,m.displayName,m.key].filter(Boolean).some(w=>w.toLowerCase().includes(t))));const s=50,a=n.length,i=n.slice(0,s),r=Sb(i),l=m=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Se(e),e.settings.openTabs.includes(m)?(e.sessionKey=m,e.applySettings({...e.settings,sessionKey:m,lastActiveSessionKey:m,tabLastViewed:{...e.settings.tabLastViewed,[m]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,m],sessionKey:m,lastActiveSessionKey:m,tabLastViewed:{...e.settings.tabLastViewed,[m]:Date.now()}}),e.sessionKey=m),ze(e,m),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,m,!0),le(e)},c=async(m,g)=>{if(m.stopPropagation(),!!window.confirm(`Delete session "${g}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(S=>S.key!==g)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:g,deleteTranscript:!0}),ne(e)}catch(S){console.error("Failed to delete session:",S),ne(e)}},u=m=>o`
    <div class="session-picker-item" @click=${()=>l(m.key)}>
      <span class="session-picker-item__status ${m.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${m.label??m.displayName??m.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${m.updatedAt?o`<span class="session-picker-item__time">${yh(m.updatedAt)}</span>`:p}
        <button
          class="session-picker-item__close"
          @click=${g=>c(g,m.key)}
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
  `,h=(m,g)=>g.length===0?p:o`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${m}</div>
        ${fa(g,w=>w.key,u)}
      </div>
    `,f=r.today.length+r.yesterday.length+r.older.length;return o`
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
          @input=${m=>{e.sessionPickerSearch=m.target.value}}
          @click=${m=>m.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${f===0?o`
                <div class="session-picker-empty">No other sessions</div>
              `:o`
              ${h("Today",r.today)}
              ${h("Yesterday",r.yesterday)}
              ${h("Older",r.older)}
              ${a>s?o`<div class="session-picker-overflow">
                    Showing ${s} of ${a} sessions. Use search to find more.
                  </div>`:p}
            `}
      </div>
    </div>
  `}const xb=["system","light","dark","lifetrack"];function xu(e){const t=Math.max(0,xb.indexOf(e.theme)),n=s=>a=>{const r={element:a.currentTarget};(a.clientX||a.clientY)&&(r.pointerClientX=a.clientX,r.pointerClientY=a.clientY),e.setTheme(s,r)};return o`
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
          ${Lb()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${_b()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Cb()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${Eb()}
        </button>
      </div>
    </div>
  `}function _b(){return o`
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
  `}function Cb(){return o`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Lb(){return o`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Eb(){return o`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const bt=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:ga,renderChatControls:Tu,renderTab:Au,renderThemeToggle:xu},Symbol.toStringTag,{value:"Module"})),ti=new Set;function wl(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const a=Ie(e.sessionsResult?.sessions,n)?.key??n;if(Ke.has(n)||Ke.has(a)||ti.has(a))continue;ti.add(a);const r=e.client;rr(r,a).then(l=>{a!==n&&l.length>0&&Ke.set(n,l)}).finally(()=>{ti.delete(a),e.applySettings({...e.settings})})}}function Rb(e){e.basePath=pu(),e._urlSettingsApplied||(du(e),e._urlSettingsApplied=!0),mu(e,!0),hu(e),fu(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),ga(e);return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="h"){t.preventDefault(),e.handleConsciousnessFlush();return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const a=s[n];a!==e.sessionKey&&(t.preventDefault(),Se(e),e.sessionKey=a,ze(e,a),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.loadAssistantIdentity(),ye(e,a,!0),le(e).then(()=>{Wd(e)}))},window.addEventListener("keydown",e.keydownHandler),gr(e),e.tab==="nodes"&&vr(e),e.tab==="logs"&&br(e),e.tab==="debug"&&kr(e)}function Ib(e){fh(e)}function Pb(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),yr(e),wr(e),$r(e),gu(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Ie(e,t){if(!e||!t)return;const n=e.find(r=>r.key===t);if(n)return n;const s=t.split(":"),a=s[s.length-1];if(a&&a.length>=4){const r=e.find(l=>l.key.includes(a));if(r)return r}const i=t.replace(/^webchat:/,"");if(i!==t){const r=e.find(l=>l.key.endsWith(i)||l.key.includes(i));if(r)return r}}function Mb(e,t){if(!t||t.length===0)return;const n=(l,c)=>{const u=l?.sessionId?.trim();if(u)return`session:${u}`;if(l){const f=[l.kind,l.surface,l.subject,l.room,l.space,l.label,l.displayName].map(m=>String(m??"").trim().toLowerCase()).join("|");if(f.replace(/\|/g,"").length>0)return`meta:${f}`}return`key:${c}`};let s=!1;const a=new Map,i=[];for(const l of e.settings.openTabs){const c=l.trim();if(!c){s=!0;continue}const u=Ie(t,c),h=u?.key??c;h!==l&&(s=!0);const f=n(u,h);if(a.has(f)){s=!0;continue}a.set(f,h),i.push(h)}const r=i.length!==e.settings.openTabs.length;if(s||r){i.length===0&&i.push(e.sessionKey.trim()||"main");const l={};for(const[m,g]of Object.entries(e.settings.tabLastViewed)){const w=m.trim();if(!w||typeof g!="number"||!Number.isFinite(g))continue;const S=Ie(t,w),T=n(S,S?.key??w),_=a.get(T)??S?.key??w;l[_]=Math.max(l[_]??0,g)}const c=Ie(t,e.sessionKey),u=n(c,c?.key??e.sessionKey.trim()),h=a.get(u)??c?.key??(e.sessionKey.trim()||i[0]),f=i.includes(h)?h:i[0];e.applySettings({...e.settings,openTabs:i,sessionKey:f,lastActiveSessionKey:f,tabLastViewed:l}),e.sessionKey!==f&&(e.sessionKey=f)}}function Db(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&Mb(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&wl(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,a=!n||n.parallelLanes.some((i,r)=>i!==e.settings.parallelLanes[r]);(s||a)&&wl(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-picker-container"),i=s.closest(".session-picker-dropdown");!a&&!i&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-search-container"),i=s.closest(".session-search-dropdown");!a&&!i&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&le(e).then(()=>{Wd(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&Zn(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const i=e.chatMessages;i[i.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s)&&Rc(e),an(e,n||s||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Ec(e,t.has("tab")||t.has("logsAutoFollow"))}function ma(e){return e instanceof Error?e.message:String(e)}async function Ob(e,t){if(!(!e.client||!e.connected)){if(!t.trim()){e.clawhubResults=null;return}e.clawhubLoading=!0,e.clawhubError=null,e.clawhubMessage=null;try{const n=await e.client.request("clawhub.search",{query:t.trim(),limit:25});n?.results&&(e.clawhubResults=n.results)}catch(n){e.clawhubError=ma(n)}finally{e.clawhubLoading=!1}}}async function kl(e,t){if(!(!e.client||!e.connected)){e.clawhubLoading=!0,e.clawhubError=null,e.clawhubMessage=null,t&&(e.clawhubExploreSort=t);try{const n=await e.client.request("clawhub.explore",{sort:e.clawhubExploreSort,limit:30});n?.items&&(e.clawhubExploreItems=n.items)}catch(n){e.clawhubError=ma(n)}finally{e.clawhubLoading=!1}}}async function Nb(e,t){if(!(!e.client||!e.connected)){e.clawhubDetailSlug=t,e.clawhubDetail=null,e.clawhubLoading=!0,e.clawhubError=null;try{const n=await e.client.request("clawhub.detail",{slug:t});n&&(e.clawhubDetail=n)}catch(n){e.clawhubError=ma(n)}finally{e.clawhubLoading=!1}}}async function $l(e,t,n){if(!e.client||!e.connected)return!1;e.clawhubImporting=t,e.clawhubError=null,e.clawhubMessage=null;try{const s=await e.client.request("clawhub.import",{slug:t,version:n}),a=s?.displayName??t;return e.clawhubMessage={kind:"success",message:`Imported "${a}" v${s?.version??"latest"}`},s?.suspicious&&(e.clawhubMessage={kind:"success",message:`Imported "${a}" — review before use (flagged as suspicious)`}),!0}catch(s){return e.clawhubMessage={kind:"error",message:ma(s)},!1}finally{e.clawhubImporting=null}}async function Bb(e,t){if(!e.client||!e.connected)return null;try{return(await e.client.request("clawhub.personalizeContext",{slug:t}))?.personalizePrompt??null}catch{return null}}function Fb(e){e.clawhubDetailSlug=null,e.clawhubDetail=null}function We(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function _u(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(We(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function va(e){return e.filter(t=>typeof t=="string").join(".")}function xe(e,t){const n=va(e),s=t[n];if(s)return s;const a=n.split(".");for(const[i,r]of Object.entries(t)){if(!i.includes("*"))continue;const l=i.split(".");if(l.length!==a.length)continue;let c=!0;for(let u=0;u<a.length;u+=1)if(l[u]!=="*"&&l[u]!==a[u]){c=!1;break}if(c)return r}}function Ze(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function Ub(e){const t=va(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function tn(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const zb=new Set(["title","description","default","nullable"]);function Kb(e){return Object.keys(e??{}).filter(n=>!zb.has(n)).length===0}function Wb(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Qn={chevronDown:o`
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
  `,plus:o`
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
  `,minus:o`
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
  `,trash:o`
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
  `,edit:o`
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
  `};function Xe(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:r,onPatch:l}=e,c=e.showLabel??!0,u=We(t),h=xe(s,a),f=h?.label??t.title??Ze(String(s.at(-1))),m=h?.help??t.description,g=va(s);if(i.has(g))return o`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const S=(t.anyOf??t.oneOf??[]).filter(x=>!(x.type==="null"||Array.isArray(x.type)&&x.type.includes("null")));if(S.length===1)return Xe({...e,schema:S[0]});const T=x=>{if(x.const!==void 0)return x.const;if(x.enum&&x.enum.length===1)return x.enum[0]},_=S.map(T),d=_.every(x=>x!==void 0);if(d&&_.length>0&&_.length<=5){const x=n??t.default;return o`
        <div class="cfg-field">
          ${c?o`<label class="cfg-field__label">${f}</label>`:p}
          ${m?o`<div class="cfg-field__help">${m}</div>`:p}
          <div class="cfg-segmented">
            ${_.map((L,E)=>o`
              <button
                type="button"
                class="cfg-segmented__btn ${L===x||tn(L)===tn(x)?"active":""}"
                ?disabled=${r}
                @click=${()=>l(s,L)}
              >
                ${tn(L)}
              </button>
            `)}
          </div>
        </div>
      `}if(d&&_.length>5)return Al({...e,options:_,value:n??t.default});const $=new Set(S.map(x=>We(x)).filter(Boolean)),A=new Set([...$].map(x=>x==="integer"?"number":x));if([...A].every(x=>["string","number","boolean"].includes(x))){const x=A.has("string"),L=A.has("number");if(A.has("boolean")&&A.size===1)return Xe({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(x||L)return Sl({...e,inputType:L&&!x?"number":"text"})}}if(t.enum){const w=t.enum;if(w.length<=5){const S=n??t.default;return o`
        <div class="cfg-field">
          ${c?o`<label class="cfg-field__label">${f}</label>`:p}
          ${m?o`<div class="cfg-field__help">${m}</div>`:p}
          <div class="cfg-segmented">
            ${w.map(T=>o`
              <button
                type="button"
                class="cfg-segmented__btn ${T===S||String(T)===String(S)?"active":""}"
                ?disabled=${r}
                @click=${()=>l(s,T)}
              >
                ${String(T)}
              </button>
            `)}
          </div>
        </div>
      `}return Al({...e,options:w,value:n??t.default})}if(u==="object")return Hb(e);if(u==="array")return jb(e);if(u==="boolean"){const w=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return o`
      <label class="cfg-toggle-row ${r?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${f}</span>
          ${m?o`<span class="cfg-toggle-row__help">${m}</span>`:p}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${w}
            ?disabled=${r}
            @change=${S=>l(s,S.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?qb(e):u==="string"?Sl({...e,inputType:"text"}):o`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function Sl(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:r,inputType:l}=e,c=e.showLabel??!0,u=xe(s,a),h=u?.label??t.title??Ze(String(s.at(-1))),f=u?.help??t.description,m=u?.sensitive??Ub(s),g=u?.placeholder??(m?"••••":t.default!==void 0?`Default: ${tn(t.default)}`:""),w=n??"";return o`
    <div class="cfg-field">
      ${c?o`<label class="cfg-field__label">${h}</label>`:p}
      ${f?o`<div class="cfg-field__help">${f}</div>`:p}
      <div class="cfg-input-wrap">
        <input
          type=${m?"password":l}
          class="cfg-input"
          placeholder=${g}
          .value=${tn(w)}
          ?disabled=${i}
          @input=${S=>{const T=S.target.value;if(l==="number"){if(T.trim()===""){r(s,void 0);return}const _=Number(T);r(s,Number.isNaN(_)?T:_);return}r(s,T)}}
          @change=${S=>{if(l==="number")return;const T=S.target.value;r(s,T.trim())}}
        />
        ${t.default!==void 0?o`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${i}
            @click=${()=>r(s,t.default)}
          >↺</button>
        `:p}
      </div>
    </div>
  `}function qb(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:r}=e,l=e.showLabel??!0,c=xe(s,a),u=c?.label??t.title??Ze(String(s.at(-1))),h=c?.help??t.description,f=n??t.default??"",m=typeof f=="number"?f:0;return o`
    <div class="cfg-field">
      ${l?o`<label class="cfg-field__label">${u}</label>`:p}
      ${h?o`<div class="cfg-field__help">${h}</div>`:p}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>r(s,m-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${tn(f)}
          ?disabled=${i}
          @input=${g=>{const w=g.target.value,S=w===""?void 0:Number(w);r(s,S)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>r(s,m+1)}
        >+</button>
      </div>
    </div>
  `}function Al(e){const{schema:t,value:n,path:s,hints:a,disabled:i,options:r,onPatch:l}=e,c=e.showLabel??!0,u=xe(s,a),h=u?.label??t.title??Ze(String(s.at(-1))),f=u?.help??t.description,m=n??t.default,g=r.findIndex(S=>S===m||String(S)===String(m)),w="__unset__";return o`
    <div class="cfg-field">
      ${c?o`<label class="cfg-field__label">${h}</label>`:p}
      ${f?o`<div class="cfg-field__help">${f}</div>`:p}
      <select
        class="cfg-select"
        ?disabled=${i}
        .value=${g>=0?String(g):w}
        @change=${S=>{const T=S.target.value;l(s,T===w?void 0:r[Number(T)])}}
      >
        <option value=${w}>Select...</option>
        ${r.map((S,T)=>o`
          <option value=${String(T)}>${String(S)}</option>
        `)}
      </select>
    </div>
  `}function Hb(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:r,onPatch:l}=e;e.showLabel;const c=xe(s,a),u=c?.label??t.title??Ze(String(s.at(-1))),h=c?.help??t.description,f=n??t.default,m=f&&typeof f=="object"&&!Array.isArray(f)?f:{},g=t.properties??{},S=Object.entries(g).toSorted(($,A)=>{const x=xe([...s,$[0]],a)?.order??0,L=xe([...s,A[0]],a)?.order??0;return x!==L?x-L:$[0].localeCompare(A[0])}),T=new Set(Object.keys(g)),_=t.additionalProperties,d=!!_&&typeof _=="object";return s.length===1?o`
      <div class="cfg-fields">
        ${S.map(([$,A])=>Xe({schema:A,value:m[$],path:[...s,$],hints:a,unsupported:i,disabled:r,onPatch:l}))}
        ${d?Tl({schema:_,value:m,path:s,hints:a,unsupported:i,disabled:r,reservedKeys:T,onPatch:l}):p}
      </div>
    `:o`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${Qn.chevronDown}</span>
      </summary>
      ${h?o`<div class="cfg-object__help">${h}</div>`:p}
      <div class="cfg-object__content">
        ${S.map(([$,A])=>Xe({schema:A,value:m[$],path:[...s,$],hints:a,unsupported:i,disabled:r,onPatch:l}))}
        ${d?Tl({schema:_,value:m,path:s,hints:a,unsupported:i,disabled:r,reservedKeys:T,onPatch:l}):p}
      </div>
    </details>
  `}function jb(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:r,onPatch:l}=e,c=e.showLabel??!0,u=xe(s,a),h=u?.label??t.title??Ze(String(s.at(-1))),f=u?.help??t.description,m=Array.isArray(t.items)?t.items[0]:t.items;if(!m)return o`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${h}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const g=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return o`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${c?o`<span class="cfg-array__label">${h}</span>`:p}
        <span class="cfg-array__count">${g.length} item${g.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${r}
          @click=${()=>{const w=[...g,_u(m)];l(s,w)}}
        >
          <span class="cfg-array__add-icon">${Qn.plus}</span>
          Add
        </button>
      </div>
      ${f?o`<div class="cfg-array__help">${f}</div>`:p}

      ${g.length===0?o`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:o`
        <div class="cfg-array__items">
          ${g.map((w,S)=>o`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${S+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${r}
                  @click=${()=>{const T=[...g];T.splice(S,1),l(s,T)}}
                >
                  ${Qn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${Xe({schema:m,value:w,path:[...s,S],hints:a,unsupported:i,disabled:r,showLabel:!1,onPatch:l})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Tl(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:r,reservedKeys:l,onPatch:c}=e,u=Kb(t),h=Object.entries(n??{}).filter(([f])=>!l.has(f));return o`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${r}
          @click=${()=>{const f={...n};let m=1,g=`custom-${m}`;for(;g in f;)m+=1,g=`custom-${m}`;f[g]=u?{}:_u(t),c(s,f)}}
        >
          <span class="cfg-map__add-icon">${Qn.plus}</span>
          Add Entry
        </button>
      </div>

      ${h.length===0?o`
              <div class="cfg-map__empty">No custom entries.</div>
            `:o`
        <div class="cfg-map__items">
          ${h.map(([f,m])=>{const g=[...s,f],w=Wb(m);return o`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${f}
                    ?disabled=${r}
                    @change=${S=>{const T=S.target.value.trim();if(!T||T===f)return;const _={...n};T in _||(_[T]=_[f],delete _[f],c(s,_))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?o`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${w}
                          ?disabled=${r}
                          @change=${S=>{const T=S.target,_=T.value.trim();if(!_){c(g,void 0);return}try{c(g,JSON.parse(_))}catch{T.value=w}}}
                        ></textarea>
                      `:Xe({schema:t,value:m,path:g,hints:a,unsupported:i,disabled:r,showLabel:!1,onPatch:c})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${r}
                  @click=${()=>{const S={...n};delete S[f],c(s,S)}}
                >
                  ${Qn.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const xl={env:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:o`
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
  `,meta:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:o`
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
  `,default:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Or={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function _l(e){return xl[e]??xl.default}function Vb(e,t,n){if(!n)return!0;const s=n.toLowerCase(),a=Or[e];return e.toLowerCase().includes(s)||a&&(a.label.toLowerCase().includes(s)||a.description.toLowerCase().includes(s))?!0:In(t,s)}function In(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,a]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||In(a,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const a of s)if(a&&In(a,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&In(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&In(s,t))return!0}return!1}function Gb(e){if(!e.schema)return o`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(We(t)!=="object"||!t.properties)return o`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),a=t.properties,i=e.searchQuery??"",r=e.activeSection,l=e.activeSubsection??null,u=Object.entries(a).toSorted((f,m)=>{const g=xe([f[0]],e.uiHints)?.order??50,w=xe([m[0]],e.uiHints)?.order??50;return g!==w?g-w:f[0].localeCompare(m[0])}).filter(([f,m])=>!(r&&f!==r||i&&!Vb(f,m,i)));let h=null;if(r&&l&&u.length===1){const f=u[0]?.[1];f&&We(f)==="object"&&f.properties&&f.properties[l]&&(h={sectionKey:r,subsectionKey:l,schema:f.properties[l]})}return u.length===0?o`
      <div class="config-empty">
        <div class="config-empty__icon">${Y.search}</div>
        <div class="config-empty__text">
          ${i?`No settings match "${i}"`:"No settings in this section"}
        </div>
      </div>
    `:o`
    <div class="config-form config-form--modern">
      ${h?(()=>{const{sectionKey:f,subsectionKey:m,schema:g}=h,w=xe([f,m],e.uiHints),S=w?.label??g.title??Ze(m),T=w?.help??g.description??"",_=n[f],d=_&&typeof _=="object"?_[m]:void 0,$=`config-section-${f}-${m}`;return o`
              <section class="config-section-card" id=${$}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${_l(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${S}</h3>
                    ${T?o`<p class="config-section-card__desc">${T}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Xe({schema:g,value:d,path:[f,m],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([f,m])=>{const g=Or[f]??{label:f.charAt(0).toUpperCase()+f.slice(1),description:m.description??""};return o`
              <section class="config-section-card" id="config-section-${f}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${_l(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${g.label}</h3>
                    ${g.description?o`<p class="config-section-card__desc">${g.description}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Xe({schema:m,value:n[f],path:[f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Qb=new Set(["title","description","default","nullable"]);function Yb(e){return Object.keys(e??{}).filter(n=>!Qb.has(n)).length===0}function Cu(e){const t=e.filter(a=>a!=null),n=t.length!==e.length,s=[];for(const a of t)s.some(i=>Object.is(i,a))||s.push(a);return{enumValues:s,nullable:n}}function Lu(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:On(e,[])}function On(e,t){const n=new Set,s={...e},a=va(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const l=Xb(e,t);return l||{schema:e,unsupportedPaths:[a]}}const i=Array.isArray(e.type)&&e.type.includes("null"),r=We(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=r??e.type,s.nullable=i||e.nullable,s.enum){const{enumValues:l,nullable:c}=Cu(s.enum);s.enum=l,c&&(s.nullable=!0),l.length===0&&n.add(a)}if(r==="object"){const l=e.properties??{},c={};for(const[u,h]of Object.entries(l)){const f=On(h,[...t,u]);f.schema&&(c[u]=f.schema);for(const m of f.unsupportedPaths)n.add(m)}if(s.properties=c,e.additionalProperties===!0)n.add(a);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Yb(e.additionalProperties)){const u=On(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(a)}}else if(r==="array"){const l=Array.isArray(e.items)?e.items[0]:e.items;if(!l)n.add(a);else{const c=On(l,[...t,"*"]);s.items=c.schema??l,c.unsupportedPaths.length>0&&n.add(a)}}else r!=="string"&&r!=="number"&&r!=="integer"&&r!=="boolean"&&!s.enum&&n.add(a);return{schema:s,unsupportedPaths:Array.from(n)}}function Xb(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],a=[];let i=!1;for(const l of n){if(!l||typeof l!="object")return null;if(Array.isArray(l.enum)){const{enumValues:c,nullable:u}=Cu(l.enum);s.push(...c),u&&(i=!0);continue}if("const"in l){if(l.const==null){i=!0;continue}s.push(l.const);continue}if(We(l)==="null"){i=!0;continue}a.push(l)}if(s.length>0&&a.length===0){const l=[];for(const c of s)l.some(u=>Object.is(u,c))||l.push(c);return{schema:{...e,enum:l,nullable:i,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(a.length===1){const l=On(a[0],t);return l.schema&&(l.schema.nullable=i||l.schema.nullable),l}const r=new Set(["string","number","integer","boolean"]);return a.length>0&&s.length===0&&a.every(l=>l.type&&r.has(String(l.type)))?{schema:{...e,nullable:i},unsupportedPaths:[]}:null}function Jb(e,t){let n=e;for(const s of t){if(!n)return null;const a=We(n);if(a==="object"){const i=n.properties??{};if(typeof s=="string"&&i[s]){n=i[s];continue}const r=n.additionalProperties;if(typeof s=="string"&&r&&typeof r=="object"){n=r;continue}return null}if(a==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Zb(e,t){const s=(e.channels??{})[t],a=e[t];return(s&&typeof s=="object"?s:null)??(a&&typeof a=="object"?a:null)??{}}function ew(e){const t=Lu(e.schema),n=t.schema;if(!n)return o`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Jb(n,["channels",e.channelId]);if(!s)return o`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const a=e.configValue??{},i=Zb(a,e.channelId);return o`
    <div class="config-form">
      ${Xe({schema:s,value:i,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function et(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return o`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?o`
              <div class="muted">Loading config schema…</div>
            `:ew({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function tw(e){const{props:t,discord:n,accountCountLabel:s}=e;return o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function nw(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function sw(e){const{props:t,imessage:n,accountCountLabel:s}=e;return o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Cl(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function aw(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:a,profileFormState:i,profileFormCallbacks:r,onEditProfile:l}=e,c=s[0],u=n?.configured??c?.configured??!1,h=n?.running??c?.running??!1,f=n?.publicKey??c?.publicKey,m=n?.lastStartAt??c?.lastStartAt??null,g=n?.lastError??c?.lastError??null,w=s.length>1,S=i!=null,T=d=>{const $=d.publicKey,A=d.profile,x=A?.displayName??A?.name??d.name??d.accountId;return o`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${x}</div>
          <div class="account-card-id">${d.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${d.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${d.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${$??""}">${Cl($)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${d.lastInboundAt?K(d.lastInboundAt):"n/a"}</span>
          </div>
          ${d.lastError?o`
                <div class="account-card-error">${d.lastError}</div>
              `:p}
        </div>
      </div>
    `},_=()=>{if(S&&r)return Yp({state:i,callbacks:r,accountId:s[0]?.accountId??"default"});const d=c?.profile??n?.profile,{name:$,displayName:A,about:x,picture:L,nip05:E}=d??{},z=$||A||x||L||E;return o`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${u?o`
                <button
                  class="btn btn-sm"
                  @click=${l}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:p}
        </div>
        ${z?o`
              <div class="status-list">
                ${L?o`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${L}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${V=>{V.target.style.display="none"}}
                        />
                      </div>
                    `:p}
                ${$?o`<div><span class="label">Name</span><span>${$}</span></div>`:p}
                ${A?o`<div><span class="label">Display Name</span><span>${A}</span></div>`:p}
                ${x?o`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${x}</span></div>`:p}
                ${E?o`<div><span class="label">NIP-05</span><span>${E}</span></div>`:p}
              </div>
            `:o`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return o`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${a}

      ${w?o`
            <div class="account-card-list">
              ${s.map(d=>T(d))}
            </div>
          `:o`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${u?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${h?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${f??""}"
                  >${Cl(f)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${m?K(m):"n/a"}</span>
              </div>
            </div>
          `}

      ${g?o`<div class="callout danger" style="margin-top: 12px;">${g}</div>`:p}

      ${_()}

      ${et({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function iw(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function rw(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const a=s[e],i=typeof a?.configured=="boolean"&&a.configured,r=typeof a?.running=="boolean"&&a.running,l=typeof a?.connected=="boolean"&&a.connected,u=(n.channelAccounts?.[e]??[]).some(h=>h.configured||h.running||h.connected);return i||r||l||u}function ow(e,t){return t?.[e]?.length??0}function Eu(e,t){const n=ow(e,t);return n<2?p:o`<div class="account-count">Accounts (${n})</div>`}function lw(e){const{props:t,signal:n,accountCountLabel:s}=e;return o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function cw(e){const{props:t,slack:n,accountCountLabel:s}=e;return o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function dw(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:a}=e,i=s.length>1,r=l=>{const u=l.probe?.bot?.username,h=l.name||l.accountId;return o`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${u?`@${u}`:h}
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
          ${l.lastError?o`
                <div class="account-card-error">
                  ${l.lastError}
                </div>
              `:p}
        </div>
      </div>
    `};return o`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${a}

      ${i?o`
            <div class="account-card-list">
              ${s.map(l=>r(l))}
            </div>
          `:o`
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

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?o`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${et({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function uw(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return o`
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
            ${n?.authAgeMs!=null?iw(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${t.whatsappMessage?o`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:p}

      ${t.whatsappQrDataUrl?o`<div class="qr-wrap">
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

      ${et({channelId:"whatsapp",props:t})}
    </div>
  `}function pw(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,a=t?.discord??null;t?.googlechat;const i=t?.slack??null,r=t?.signal??null,l=t?.imessage??null,c=t?.nostr??null,h=hw(e.snapshot).map((f,m)=>({key:f,enabled:rw(f,e),order:m})).toSorted((f,m)=>f.enabled!==m.enabled?f.enabled?-1:1:f.order-m.order);return o`
    <section class="grid grid-cols-2">
      ${h.map(f=>fw(f.key,e,{whatsapp:n,telegram:s,discord:a,slack:i,signal:r,imessage:l,nostr:c,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?K(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:p}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function hw(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function fw(e,t,n){const s=Eu(e,n.channelAccounts);switch(e){case"whatsapp":return uw({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return dw({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return tw({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return nw({props:t,accountCountLabel:s});case"slack":return cw({props:t,slack:n.slack,accountCountLabel:s});case"signal":return lw({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return sw({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const a=n.channelAccounts?.nostr??[],i=a[0],r=i?.accountId??"default",l=i?.profile??null,c=t.nostrProfileAccountId===r?t.nostrProfileFormState:null,u=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return aw({props:t,nostr:n.nostr,nostrAccounts:a,accountCountLabel:s,profileFormState:c,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(r,l)})}default:return gw(e,t,n.channelAccounts??{})}}function gw(e,t,n){const s=vw(t.snapshot,e),a=t.snapshot?.channels?.[e],i=typeof a?.configured=="boolean"?a.configured:void 0,r=typeof a?.running=="boolean"?a.running:void 0,l=typeof a?.connected=="boolean"?a.connected:void 0,c=typeof a?.lastError=="string"?a.lastError:void 0,u=n[e]??[],h=Eu(e,n);return o`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${h}

      ${u.length>0?o`
            <div class="account-card-list">
              ${u.map(f=>kw(f))}
            </div>
          `:o`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${i==null?"n/a":i?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${l==null?"n/a":l?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${c?o`<div class="callout danger" style="margin-top: 12px;">
            ${c}
          </div>`:p}

      ${et({channelId:e,props:t})}
    </div>
  `}function mw(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function vw(e,t){return mw(e)[t]?.label??e?.channelLabels?.[t]??t}const yw=600*1e3;function Ru(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<yw:!1}function bw(e){return e.running?"Yes":Ru(e)?"Active":"No"}function ww(e){return e.connected===!0?"Yes":e.connected===!1?"No":Ru(e)?"Active":"n/a"}function kw(e){const t=bw(e),n=ww(e);return o`
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
        ${e.lastError?o`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:p}
      </div>
    </div>
  `}const Nn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),Nn(s,t);return!0},Vs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Iu=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Aw(t)}};function $w(e){this._$AN!==void 0?(Vs(this),this._$AM=e,Iu(this)):this._$AM=e}function Sw(e,t=!1,n=0){const s=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(s))for(let i=n;i<s.length;i++)Nn(s[i],!1),Vs(s[i]);else s!=null&&(Nn(s,!1),Vs(s));else Nn(this,e)}const Aw=e=>{e.type==ji.CHILD&&(e._$AP??=Sw,e._$AQ??=$w)};class Tw extends Gi{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Iu(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(Nn(this,t),Vs(this))}setValue(t){if(bb(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const ni=new WeakMap,xw=Vi(class extends Tw{render(e){return p}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),p}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=ni.get(t);n===void 0&&(n=new WeakMap,ni.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?ni.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Ll=25*1024*1024,El=50*1024*1024,Rl=20;function si(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function Nr(e,t=0){const n=[],s=[];let a=t;const i=Array.from(e);for(const r of i){if(n.length>=Rl){s.push(`Maximum ${Rl} files allowed per upload`);break}if(r.size>Ll){s.push(`"${r.name}" is too large (${si(r.size)}). Max ${si(Ll)}. For larger files, mention the file path instead.`);continue}if(a+r.size>El){s.push(`Total upload size exceeds ${si(El)} limit`);break}a+=r.size,n.push(r)}return{validFiles:n,errors:s}}const _w=new Set(["md","markdown","mdx"]),Cw=new Set(["htm","html"]),Lw=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function Ew(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function Rw(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?_w.has(n)?"text/markdown":Cw.has(n)?"text/html":Lw.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function Pu(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return Rw(e.filePath??null)??"text/markdown"}function Iw(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function Pw(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const a=s.getAttribute("href");if(!a)return;const i=Iw(a);i&&(e.preventDefault(),e.stopPropagation(),t(i))}function Mw(e){if(e.error)return o`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return o`
      <div class="muted">No content available</div>
    `;const t=Pu(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?o`
        <div class="sidebar-image">
          <img src=${s} alt=${Ew(e.filePath??"Image preview")} />
        </div>
      `:o`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(t==="text/html"||t==="application/xhtml+xml"){const a=new Blob([n],{type:"text/html"}),i=URL.createObjectURL(a);return o`<iframe
      class="sidebar-html-frame"
      src=${i}
      sandbox="allow-same-origin"
      @load=${r=>{URL.revokeObjectURL(i);const l=r.target;try{const c=l.contentDocument?.documentElement?.scrollHeight;c&&(l.style.height=`${c}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const a=Kf(n);return o`<div
      class="sidebar-markdown"
      @click=${i=>Pw(i,e.onOpenFile)}
    >${_e(we(a))}</div>`}return o`<pre class="sidebar-plain">${n}</pre>`}function Dw(e){const t=Pu(e);return t==="text/html"||t==="application/xhtml+xml"}function Ow(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Mu(e){const t=e.title?.trim()||"Tool Output",n=Dw(e)&&e.content;return o`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?o`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:p}
        </div>
        <div class="sidebar-header-actions">
          ${n?o`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>Ow(e.content)}
              >Open in Browser</button>`:p}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${Y.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content">${Mw(e)}</div>
    </div>
  `}var Nw=Object.defineProperty,Bw=Object.getOwnPropertyDescriptor,ya=(e,t,n,s)=>{for(var a=s>1?void 0:s?Bw(t,n):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(a=(s?r(t,n,a):r(a))||a);return s&&a&&Nw(t,n,a),a};let cn=class extends en{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,a=(e.clientX-this.startX)/n;let i=this.startRatio+a;i=Math.max(this.minRatio,Math.min(this.maxRatio,i)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:i},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return o``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};cn.styles=bp`
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
  `;ya([Js({type:Number})],cn.prototype,"splitRatio",2);ya([Js({type:Number})],cn.prototype,"minRatio",2);ya([Js({type:Number})],cn.prototype,"maxRatio",2);cn=ya([Sc("resizable-divider")],cn);const Fw=5e3;function Uw(e){const t=(e??"").trim();if(!t||t==="/")return"/consciousness-icon.webp";const n=t.startsWith("/")?t:`/${t}`;return`${n.endsWith("/")?n.slice(0,-1):n}/consciousness-icon.webp`}function Il(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function zw(e){const t=e.sessions?.sessions?.find(a=>a.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Kw(e){const t=zw(e);if(t===null)return p;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",a=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),i=a?.totalTokens??0,r=a?.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return o`
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
        ${i.toLocaleString()} / ${r.toLocaleString()} tokens<br>
        Click to compact
      </span>
    </button>
  `}function Ww(e){return e?e.active?o`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${Y.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Fw?o`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${Y.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:p:p}function Br(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function qw(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Hw(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function jw(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Vw(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Nr(s,i);for(const h of l)t.showToast?.(h,"error");if(r.length===0)return;const c=[];let u=r.length;for(const h of r){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;c.push({id:Br(),dataUrl:m,mimeType:h.type||"application/octet-stream",fileName:h.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${h.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(h)}}function Gw(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let h=0;h<n.length;h++){const f=n[h];if(f.type.startsWith("image/")){const m=f.getAsFile();m&&s.push(m)}}if(s.length===0)return;e.preventDefault();const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Nr(s,i);for(const h of l)t.showToast?.(h,"error");if(r.length===0)return;const c=[];let u=r.length;for(const h of r){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;c.push({id:Br(),dataUrl:m,mimeType:h.type,fileName:h.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(h)}}function Qw(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Nr(s,i);for(const h of l)t.showToast?.(h,"error");if(r.length===0){n.value="";return}const c=[];let u=r.length;for(const h of r){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;c.push({id:Br(),dataUrl:m,mimeType:h.type||"application/octet-stream",fileName:h.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${h.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(h)}n.value=""}function Yw(e){const t=e.attachments??[];return t.length===0?p:o`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),a=n.fileName||"file",i=a.length>20?a.slice(0,17)+"...":a;return o`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?o`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:o`<div class="chat-attachment__file">
                  ${Y.fileText}
                  <span class="chat-attachment__filename" title=${a}>${i}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const r=(e.attachments??[]).filter(l=>l.id!==n.id);e.onAttachmentsChange?.(r)}}
            >
              ${Y.x}
            </button>
          </div>
        `})}
    </div>
  `}function Xw(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function Jw(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Zw(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function ek(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Xw(e))return;const a=s.closest("a");if(a instanceof HTMLAnchorElement){if(a.hasAttribute("download"))return;const c=a.getAttribute("href");if(!c)return;try{const h=new URL(c,window.location.href);if(/^https?:$/.test(h.protocol)&&h.origin!==window.location.origin){e.preventDefault(),window.open(h.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(c)||Jw(a);return}const i=s.closest("code");if(!(i instanceof HTMLElement))return;const r=(i.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(r)){e.preventDefault(),window.open(r,"_blank","noopener,noreferrer");return}const l=Zw(r);l&&(e.preventDefault(),await t.onMessageLinkClick(l))}function tk(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const a=e.sessions?.sessions?.find(g=>g.key===e.sessionKey)?.reasoningLevel??"off",i=e.showThinking&&a!=="off",r={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,c=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",u=e.splitRatio??.6,h=!!(e.sidebarOpen&&e.onCloseSidebar),f=Uw(e.basePath),m=o`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${g=>{ek(g,e)}}
    >
      ${e.loading?o`
              <div class="muted">Loading chat…</div>
            `:p}
      ${fa(ak(e),g=>g.key,g=>{try{if(g.kind==="reading-indicator")return Xg(r,e.currentToolInfo);if(g.kind==="stream")return Jg(g.text,g.startedAt,e.onOpenSidebar,r,e.currentToolInfo);if(g.kind==="compaction-summary")return nm(g.message);if(g.kind==="group"){const w=e.resolveImageUrl?(S,T)=>e.resolveImageUrl(S,T):void 0;return Zg(g,{onOpenSidebar:e.onOpenSidebar,onImageClick:e.onImageClick,resolveImageUrl:w,showReasoning:i,assistantName:e.assistantName,assistantAvatar:r.avatar,userName:e.userName,userAvatar:e.userAvatar})}return p}catch(w){return console.error("[chat] item render error:",w,g.key),p}})}
    </div>
  `;return o`
    <section 
      class="card chat"
      @dragover=${qw}
      @dragenter=${g=>Hw(g,g.currentTarget)}
      @dragleave=${g=>jw(g,g.currentTarget)}
      @drop=${g=>Vw(g,e)}
    >
      ${e.disabledReason?o`<div class="callout">${e.disabledReason}</div>`:p}

      ${e.error?o`<div class="callout danger">${e.error}</div>`:p}

      ${Ww(e.compactionStatus)}

      ${e.pendingRetry&&e.onRetry?o`
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
                ${e.onClearRetry?o`
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

      ${e.focusMode?o`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${Y.x}
            </button>
          `:p}

      <div
        class="chat-split-container ${h?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${h?`0 0 ${u*100}%`:"1 1 100%"}"
          @click=${h?()=>e.onCloseSidebar?.():p}
        >
          ${m}
          ${e.showScrollButton?o`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?o`<span class="chat-scroll-bottom__badge"></span>`:p}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:p}
        </div>

        ${h?o`
              <resizable-divider
                .splitRatio=${u}
                @resize=${g=>e.onSplitRatioChange?.(g.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${Mu({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile})}
              </div>
            `:p}
      </div>

      ${e.queue.length?o`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(g=>o`
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
                        ${Y.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:p}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${g=>Qw(g,e)}
          />
          ${Yw(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${xw(g=>g&&Il(g))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${g=>{if(g.key!=="Enter"||g.isComposing||g.keyCode===229||g.shiftKey||!e.connected)return;g.preventDefault();const w=g.ctrlKey||g.metaKey;t&&e.onSend(w)}}
              @input=${g=>{const w=g.target;Il(w),e.onDraftChange(w.value)}}
              @paste=${g=>Gw(g,e)}
              placeholder=${c}
            ></textarea>

            <div class="chat-compose__actions">
              ${Kw(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${Y.paperclip}
              </button>

              ${e.onConsciousnessFlush?o`
                  <button
                    class="chat-compose__toolbar-btn consciousness-btn ${e.consciousnessStatus==="ok"?"consciousness-btn--ok":""} ${e.consciousnessStatus==="error"?"consciousness-btn--error":""}"
                    type="button"
                    ?disabled=${e.consciousnessStatus==="loading"}
                    @click=${e.onConsciousnessFlush}
                    title="Sync consciousness — refreshes your agent's live context (⌘⇧H)"
                    aria-label="Sync consciousness"
                  >
                    ${e.consciousnessStatus==="loading"?Y.loader:o`<img src=${f} width="18" height="18" alt="" style="display:block;opacity:0.9;" />`}
                  </button>
                `:p}

              <button
                class="chat-compose__send-btn"
                ?disabled=${!e.canSend||!e.connected}
                @click=${()=>e.onSend(!1)}
                title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
              >
                ${Y.arrowUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const Pl=200;function nk(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const a=Xc(s.message),i=ar(a.role),r=a.timestamp||Date.now();!n||n.role!==i?(n&&t.push(n),n={kind:"group",key:`group:${i}:${s.key}`,role:i,messages:[{message:s.message,key:s.key}],timestamp:r,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function sk(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const a=s;if(a.type==="image")return!0;if(Array.isArray(a.content)){for(const i of a.content)if(!(typeof i!="object"||i===null)&&i.type==="image")return!0}}return!1}function ak(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],a=Math.max(0,n.length-Pl);a>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Pl} messages (${a} hidden).`,timestamp:Date.now()}});for(let i=a;i<n.length;i++){const r=n[i];if(r._chatIdx=i,sm(r)){t.push({kind:"compaction-summary",key:`compaction:${i}`,message:r});continue}const l=Xc(r);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!sk(r)||t.push({kind:"message",key:Ml(r,i),message:r})}if(e.showThinking)for(let i=0;i<s.length;i++)t.push({kind:"message",key:Ml(s[i],i+n.length),message:s[i]});if(e.stream!==null){const i=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:i,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:i})}else if(e.isWorking){const i=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}else if(e.sending||e.canAbort){const i=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}return nk(t)}function Ml(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const a=typeof n.id=="string"?n.id:"";if(a)return`msg:${a}`;const i=typeof n.messageId=="string"?n.messageId:"";if(i)return`msg:${i}`;const r=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";return r!=null?`msg:${l}:${r}:${t}`:`msg:${l}:${t}`}function ik(e,t=128){return new Promise((n,s)=>{const a=new Image;a.addEventListener("load",()=>{const i=document.createElement("canvas");i.width=t,i.height=t;const r=i.getContext("2d");if(!r){s(new Error("Could not get canvas context"));return}const l=Math.min(a.width,a.height),c=(a.width-l)/2,u=(a.height-l)/2;r.drawImage(a,c,u,l,l,0,0,t,t),n(i.toDataURL("image/png"))}),a.addEventListener("error",()=>s(new Error("Failed to load image"))),a.src=URL.createObjectURL(e)})}let Xt="",Pn=null,xt=null,Dl=!1,it=!1;function rk(e){Dl||(Xt=e.userName||"",Pn=e.userAvatar||null,xt=e.userAvatar||null,Dl=!0,it=!1)}function ok(e){rk(e);const t=c=>{Xt=c.target.value,it=!0},n=async c=>{const h=c.target.files?.[0];if(h){if(!h.type.startsWith("image/")){alert("Please select an image file");return}if(h.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const f=await ik(h,128);Pn=f,xt=f,it=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(f){console.error("Failed to process image:",f),alert("Failed to process image")}}},s=()=>{Pn=null,xt=null,it=!0;const c=document.getElementById("user-avatar-input");c&&(c.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},a=()=>{e.onUpdate(Xt,Pn||""),it=!1;const c=document.querySelector(".user-settings__save");c&&(c.textContent="Saved!",setTimeout(()=>{c.textContent="Save"},1500))},i=()=>{Xt=e.userName||"",Pn=e.userAvatar||null,xt=e.userAvatar||null,it=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},r=Xt||"You",l=xt?o`<img src="${xt}" alt="${r}" class="user-settings__avatar-img" />`:o`<span class="user-settings__avatar-initial">${r.charAt(0).toUpperCase()}</span>`;return o`
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
                  ${xt?o`
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
                .value=${Xt}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${it?o`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${i}
                    >
                      Cancel
                    </button>
                  `:p}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!it}
                @click=${a}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Pi={all:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:o`
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
  `,meta:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:o`
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
  `,user:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,default:o`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},ai=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Ol=new Set(["user"]),Nl="__all__";function Bl(e){return Pi[e]??Pi.default}function lk(e,t){const n=Or[e];return n||{label:t?.title??Ze(e),description:t?.description??""}}function ck(e){const{key:t,schema:n,uiHints:s}=e;if(!n||We(n)!=="object"||!n.properties)return[];const a=Object.entries(n.properties).map(([i,r])=>{const l=xe([t,i],s),c=l?.label??r.title??Ze(i),u=l?.help??r.description??"",h=l?.order??50;return{key:i,label:c,description:u,order:h}});return a.sort((i,r)=>i.order!==r.order?i.order-r.order:i.key.localeCompare(r.key)),a}function dk(e,t){if(!e||!t)return[];const n=[];function s(a,i,r){if(a===i)return;if(typeof a!=typeof i){n.push({path:r,from:a,to:i});return}if(typeof a!="object"||a===null||i===null){a!==i&&n.push({path:r,from:a,to:i});return}if(Array.isArray(a)&&Array.isArray(i)){JSON.stringify(a)!==JSON.stringify(i)&&n.push({path:r,from:a,to:i});return}const l=a,c=i,u=new Set([...Object.keys(l),...Object.keys(c)]);for(const h of u)s(l[h],c[h],r?`${r}.${h}`:h)}return s(e,t,""),n}function Fl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function uk(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Lu(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,a=n.schema?.properties??{},i=ai.filter(E=>E.key in a&&!Ol.has(E.key)),r=new Set(ai.map(E=>E.key)),l=Object.keys(a).filter(E=>!r.has(E)).map(E=>({key:E,label:E.charAt(0).toUpperCase()+E.slice(1)})),c=ai.filter(E=>Ol.has(E.key)),u=[...i,...l,...c],h=e.activeSection&&n.schema&&We(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,f=e.activeSection?lk(e.activeSection,h):null,m=e.activeSection?ck({key:e.activeSection,schema:h,uiHints:e.uiHints}):[],g=e.formMode==="form"&&!!e.activeSection&&m.length>0,w=e.activeSubsection===Nl,S=e.searchQuery||w?null:e.activeSubsection??m[0]?.key??null,T=e.formMode==="form"?dk(e.originalValue,e.formValue):[],_=e.formMode==="raw"&&e.raw!==e.originalRaw,d=e.formMode==="form"?T.length>0:_,$=!!e.formValue&&!e.loading&&!!n.schema,A=e.connected&&!e.saving&&d&&(e.formMode==="raw"?!0:$),x=e.connected&&!e.applying&&!e.updating&&d&&(e.formMode==="raw"?!0:$),L=e.connected&&!e.applying&&!e.updating;return o`
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
            @input=${E=>e.onSearchChange(E.target.value)}
          />
          ${e.searchQuery?o`
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
            <span class="config-nav__icon">${Pi.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${u.map(E=>o`
            <button
              class="config-nav__item ${e.activeSection===E.key?"active":""}"
              @click=${()=>e.onSectionChange(E.key)}
            >
              <span class="config-nav__icon">${Bl(E.key)}</span>
              <span class="config-nav__label">${E.label}</span>
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
            ${d?o`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${T.length} unsaved change${T.length!==1?"s":""}`}</span>
            `:o`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!A}
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
              ?disabled=${!L}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${d&&e.formMode==="form"?o`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${T.length} pending change${T.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${T.map(E=>o`
                <div class="config-diff__item">
                  <div class="config-diff__path">${E.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Fl(E.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Fl(E.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:p}

        ${f&&e.formMode==="form"?o`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${Bl(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${f.label}</div>
                  ${f.description?o`<div class="config-section-hero__desc">${f.description}</div>`:p}
                </div>
              </div>
            `:p}

        ${g?o`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${S===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Nl)}
                >
                  All
                </button>
                ${m.map(E=>o`
                    <button
                      class="config-subnav__item ${S===E.key?"active":""}"
                      title=${E.description||E.label}
                      @click=${()=>e.onSubsectionChange(E.key)}
                    >
                      ${E.label}
                    </button>
                  `)}
              </div>
            `:p}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="user"?ok({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?o`
                  ${e.schemaLoading?o`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Gb({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:S})}
                  ${s?o`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:p}
                `:o`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${E=>e.onRawChange(E.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?o`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:p}
      </main>
    </div>
  `}function pk(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",a=e.version??"";return`${t} ${n} ${s} ${a}`.trim()}function hk(e){const t=e.ts??null;return t?K(t):"n/a"}function Du(e){return e?`${Wn(e)} (${K(e)})`:"n/a"}function fk(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function gk(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function mk(e){const t=e.state??{},n=t.nextRunAtMs?Wn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Wn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function vk(e){const t=e.schedule;return t.kind==="at"?`At ${Wn(t.atMs)}`:t.kind==="every"?`Every ${qi(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function yk(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function bk(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(a=>s.has(a)?!1:(s.add(a),!0))}function wk(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function kk(e){const t=bk(e);return o`
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
            <div class="stat-value">${Du(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?o`<span class="muted">${e.error}</span>`:p}
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
        ${$k(e)}
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
	          ${e.form.payloadKind==="agentTurn"?o`
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
	                    ${t.map(n=>o`<option value=${n}>
                            ${wk(e,n)}
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
                ${e.form.sessionTarget==="isolated"?o`
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
      ${e.jobs.length===0?o`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:o`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(n=>Sk(n,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?o`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?o`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:o`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(n=>Ak(n))}
              </div>
            `}
    </section>
  `}function $k(e){const t=e.form;return t.scheduleKind==="at"?o`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?o`
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
    `:o`
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
  `}function Sk(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return o`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${vk(e)}</div>
        <div class="muted">${yk(e)}</div>
        ${e.agentId?o`<div class="muted">Agent: ${e.agentId}</div>`:p}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${mk(e)}</div>
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
  `}function Ak(e){return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Wn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?o`<div class="muted">${e.error}</div>`:p}
      </div>
    </div>
  `}const Tk={health:"❤️",calendar:"📅",tasks:"✅",email:"📧",meetings:"🎤",environment:"🌤️"},xk={connected:"#10b981",pending:"#f59e0b",disconnected:"#ef4444"},Ul={connected:"Connected",pending:"Pending",disconnected:"Disconnected"};function _k(e){return Tk[e.toLowerCase()]??"🔗"}function Ck(e){if(!e)return"Never";const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function Lk(e,t){const n=xk[e.status];return o`
    <div class="my-day-card data-source-card">
      <div class="data-source-header">
        <span class="data-source-icon">${_k(e.type)}</span>
        <div class="data-source-info">
          <div class="data-source-name">${e.name}</div>
          <span class="data-source-type-badge">${e.type}</span>
        </div>
        <div class="data-source-status" title="${Ul[e.status]}">
          <span
            class="data-source-status-dot"
            style="background: ${n};"
          ></span>
          <span class="data-source-status-label">${Ul[e.status]}</span>
        </div>
      </div>
      <div class="data-source-body">
        ${e.skill?o`<div class="data-source-skill">
              <span class="data-source-detail-label">Skill:</span>
              <span class="data-source-detail-value">${e.skill}</span>
            </div>`:p}
        <div class="data-source-sync">
          <span class="data-source-detail-label">Last sync:</span>
          <span class="data-source-detail-value">${Ck(e.lastSync)}</span>
        </div>
      </div>
      ${e.status==="pending"&&t?o`
            <div class="data-source-actions">
              <button
                class="data-source-connect-btn"
                @click=${()=>t(e.id)}
              >
                Connect
              </button>
            </div>
          `:p}
    </div>
  `}function Ek(e,t){return e.length===0?o`
      <div class="my-day-card">
        <div class="my-day-card-content">
          <div class="my-day-empty">
            No data sources configured. Chat to connect your first integration.
          </div>
        </div>
      </div>
    `:o`
    <div class="data-sources-grid">
      ${e.map(n=>Lk(n,t))}
    </div>
  `}function Rk(e){return o`
    <div class="data-dashboard-section">
      <div class="data-dashboard-prompt">What do you want to know?</div>
      <div class="data-dashboard-hint">
        Ask questions about your connected data in chat.
        Dashboards and visualizations are generated on demand.
      </div>
      ${e?o`
            <button
              class="data-dashboard-btn"
              @click=${()=>e("Query my connected data")}
            >
              Open Data Chat
            </button>
          `:p}
    </div>
  `}function Ik(e){if(e.loading)return o`
      <div class="my-day-container" style="overflow-y: auto">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading data sources...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="my-day-container" style="overflow-y: auto;">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:p}
        </div>
      </div>
    `;const t=e.sources.filter(n=>n.status==="connected").length;return o`
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
          ${e.onRefresh?o`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">↻</button>
              `:p}
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
        ${e.subtab==="dashboard"?Rk(e.onQuerySubmit):Ek(e.sources,e.onConnectSource)}
      </div>
    </div>
  `}function Pk(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,a=n?.warn??0,i=n?.info??0,r=s>0?"danger":a>0?"warn":"success",l=s>0?`${s} critical`:a>0?`${a} warnings`:"No critical issues";return o`
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
            ${n?o`<div class="callout ${r}" style="margin-top: 8px;">
                  Security audit: ${l}${i>0?` · ${i} info`:""}. Run
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
        ${e.callError?o`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:p}
        ${e.callResult?o`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:p}
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
      ${e.eventLog.length===0?o`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:o`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(c=>o`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${c.event}</div>
                      <div class="list-sub">${new Date(c.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${gk(c.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function Mk(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function wt(e,t){return t?o`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:p}function Dk(e){const t=e.execApprovalQueue[0];if(!t)return p;const n=t.request,s=t.expiresAtMs-Date.now(),a=s>0?`expires in ${Mk(s)}`:"expired",i=e.execApprovalQueue.length;return o`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${a}</div>
          </div>
          ${i>1?o`<div class="exec-approval-queue">${i} pending</div>`:p}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${wt("Host",n.host)}
          ${wt("Agent",n.agentId)}
          ${wt("Session",n.sessionKey)}
          ${wt("CWD",n.cwd)}
          ${wt("Resolved",n.resolvedPath)}
          ${wt("Security",n.security)}
          ${wt("Ask",n.ask)}
        </div>
        ${e.execApprovalError?o`<div class="exec-approval-error">${e.execApprovalError}</div>`:p}
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
  `}function Ok(e){const{pendingGatewayUrl:t}=e;return t?o`
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
  `:p}const Nk={professional:"#3b82f6",personal:"#10b981",health:"#ef4444",financial:"#f59e0b",creative:"#a855f7",relationship:"#ec4899"},Bk={active:"Active",completed:"Completed",paused:"Paused"},Fk={active:"●",completed:"✓",paused:"⏸"};function Uk(e){return e?Nk[e.toLowerCase()]??"var(--mc-text-muted)":"var(--mc-text-muted)"}function zk(e){const t={active:[],completed:[],paused:[]};for(const n of e)t[n.status].push(n);return t}function Kk(e){const t=Math.max(0,Math.min(100,e));return o`
    <div class="goals-progress-bar">
      <div
        class="goals-progress-fill"
        style="width: ${t}%; background: ${t>=100?"#10b981":"var(--mc-accent)"}"
      ></div>
    </div>
    <span class="goals-progress-label">${t}%</span>
  `}function Wk(e){const t=Uk(e.area);return o`
    <div class="my-day-card goals-card goals-status-${e.status}">
      <div class="goals-card-header">
        <div class="goals-card-title">${e.title}</div>
        <span class="goals-status-indicator goals-status-${e.status}" title="${Bk[e.status]}">
          ${Fk[e.status]}
        </span>
      </div>
      <div class="goals-card-body">
        ${e.area?o`
              <span
                class="goals-area-badge"
                style="background: ${t}22; color: ${t}; border: 1px solid ${t}44;"
              >
                ${e.area}
              </span>
            `:p}
        ${e.target?o`<div class="goals-target-text">${e.target}</div>`:p}
        ${e.progress!=null?o`<div class="goals-progress-row">${Kk(e.progress)}</div>`:p}
      </div>
    </div>
  `}function ii(e,t){return t.length===0?p:o`
    <div class="goals-group">
      <div class="goals-group-label">
        <span>${e}</span>
        <span class="goals-group-count">${t.length}</span>
      </div>
      <div class="goals-group-cards">
        ${t.map(n=>Wk(n))}
      </div>
    </div>
  `}function qk(e){if(e.loading)return o`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading goals...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:p}
        </div>
      </div>
    `;const t=zk(e.goals),n=t.active.length,s=t.completed.length;return o`
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
          ${e.onUpdateViaChat?o`
                <div class="my-day-summary-divider"></div>
                <button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                  Update via Chat
                </button>
              `:p}
          ${e.onRefresh?o`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">↻</button>
              `:p}
        </div>
      </div>

      <!-- Content -->
      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${e.goals.length===0?o`
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <div class="my-day-empty">No goals yet. Chat to set up your goals.</div>
                  </div>
                </div>
              `:o`
              ${ii("ACTIVE",t.active)}
              ${ii("COMPLETED",t.completed)}
              ${ii("PAUSED",t.paused)}
            `}
      </div>
    </div>
  `}function Hk(e){return o`
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
      ${e.lastError?o`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:p}
      ${e.statusMessage?o`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:p}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?o`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>jk(t))}
      </div>
    </section>
  `}function jk(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],a=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],i=a.length>0?a.length>3?`${a.length} scopes`:`scopes: ${a.join(", ")}`:null;return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${pk(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(r=>o`<span class="chip">${r}</span>`)}
          ${i?o`<span class="chip">${i}</span>`:p}
          ${e.platform?o`<span class="chip">${e.platform}</span>`:p}
          ${e.deviceFamily?o`<span class="chip">${e.deviceFamily}</span>`:p}
          ${e.modelIdentifier?o`<span class="chip">${e.modelIdentifier}</span>`:p}
          ${e.version?o`<span class="chip">${e.version}</span>`:p}
        </div>
      </div>
      <div class="list-meta">
        <div>${hk(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}function Vk(e){return new Date(e).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}function Gk(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric"})}function Ou(e){return e===te()}function Qk(e){const t=new Date,n=new Date(e),s=Math.floor((t.getTime()-n.getTime())/(1e3*60*60*24));return s===0?"Today":s===1?"Yesterday":s<7?`${s} days ago`:Gk(e)}function Yk(e){if(!e||e.length===0)return!1;const t=te();return e.some(n=>n.date===t)}function Xk(e){return o`
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
        ${e?o`<button class="cta-button primary-button" @click=${e}>
              Enable LifeTracks
            </button>`:p}
        <p class="cta-note">You can pause or disable anytime in settings.</p>
      </div>
    </div>
  `}function Jk(e,t,n){return o`
    <div class="lifetracks-generate-cta">
      <div class="generate-header">
        <h3>No tracks yet</h3>
        <p>Generate your first personalized LifeTrack based on your Vision Board and goals.</p>
      </div>

      ${t?o`<div class="generate-error">
            <span class="error-icon">⚠️</span>
            <span>${t}</span>
          </div>`:p}

      <button
        class="generate-button primary-button ${e?"generating":""}"
        @click=${n}
        ?disabled=${e}
      >
        ${e?o`
                <span class="spinner-small"></span> Generating (~2 min)...
              `:o`
                Generate Today's Track
              `}
      </button>

      <p class="generate-cost">Cost: ~$0.16</p>
    </div>
  `}function Zk(e,t,n,s){return e?o`
    <div class="lifetracks-player">
      <div class="player-header">
        <div class="player-info">
          <span class="player-date">${Vk(e.date)}</span>
          ${Ou(e.date)?o`
                  <span class="player-badge today">Today's Track</span>
                `:p}
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
        ${!t&&s?o`<button
              class="player-generate-btn ${n?"generating":""}"
              @click=${s}
              ?disabled=${n}
            >
              ${n?"Generating...":"Generate Today's"}
            </button>`:p}
      </div>
    </div>
  `:o`
      <div class="lifetracks-player-empty">
        <span class="player-empty-icon">🎧</span>
        <span class="player-empty-text">Select a track to play</span>
      </div>
    `}function e$(e,t,n){return!e||e.length===0?o`
      <div class="lifetracks-empty-list">
        <span>No tracks available yet.</span>
      </div>
    `:o`
    <div class="lifetracks-list">
      ${e.map(s=>{const a=t?.date===s.date,i=Ou(s.date);return o`
          <button
            class="lifetracks-list-item ${a?"active":""} ${i?"today":""}"
            @click=${()=>n?.(s)}
          >
            <span class="list-item-date">${Qk(s.date)}</span>
            ${i?o`
                    <span class="list-item-badge">NEW</span>
                  `:p}
            ${a?o`
                    <span class="list-item-playing">▶</span>
                  `:p}
          </button>
        `})}
    </div>
  `}function t$(e){if(!e?.stats)return p;const{totalGenerated:t,estimatedCost:n}=e.stats;return t===0?p:o`
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
  `}function zl(e){if(!e.config?.enabled&&!e.loading)return Xk(e.onEnable);if(e.loading)return o`
      <div class="lifetracks-container">
        <div class="lifetracks-loading">
          <div class="spinner"></div>
          <span>Loading Lifetracks...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="lifetracks-container">
        <div class="lifetracks-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:p}
        </div>
      </div>
    `;if(!e.data||e.data.length===0)return o`
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

        ${Jk(e.generating??!1,e.generationError??null,e.onGenerate)}
      </div>
    `;const t=Yk(e.data);return o`
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
          ${e.onUpdateViaChat?o`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:p}
          ${e.onRefresh?o`<button class="lifetracks-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:p}
        </div>
      </div>

      <!-- Main content -->
      <div class="lifetracks-content">
        <!-- Player section -->
        <div class="lifetracks-player-section">
          <div class="lifetracks-section-label">NOW PLAYING</div>
          ${Zk(e.currentTrack,t,e.generating??!1,e.onGenerate)}
        </div>

        <!-- Track list section -->
        <div class="lifetracks-list-section">
          <div class="lifetracks-section-label">ALL TRACKS (${e.data.length})</div>
          ${e$(e.data,e.currentTrack,e.onSelectTrack)}
        </div>
      </div>

      <!-- Stats -->
      ${t$(e.config??null)}

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
  `}const Kl=["trace","debug","info","warn","error","fatal"];function n$(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function s$(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function a$(e){const t=e.filterText.trim().toLowerCase(),n=Kl.some(i=>!e.levelFilters[i]),s=e.entries.filter(i=>i.level&&!e.levelFilters[i.level]?!1:s$(i,t)),a=t||n?"filtered":"visible";return o`
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
        ${Kl.map(i=>o`
            <label class="chip log-chip ${i}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[i]}
                @change=${r=>e.onLevelToggle(i,r.target.checked)}
              />
              <span>${i}</span>
            </label>
          `)}
      </div>

      ${e.file?o`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:p}
      ${e.truncated?o`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:p}
      ${e.error?o`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:p}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?o`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(i=>o`
                <div class="log-row">
                  <div class="log-time mono">${n$(i.time)}</div>
                  <div class="log-level ${i.level??""}">${i.level??""}</div>
                  <div class="log-subsystem mono">${i.subsystem??""}</div>
                  <div class="log-message mono">${i.message??i.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const i$=/(^~\/|^\/|^\.\.?\/|[\\/])/;function Wl(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!i$.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function Nu(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const a=n.getAttribute("href")??"";let i=a;if(a.includes("%"))try{i=decodeURIComponent(a)}catch{i=a}return Wl(i)}const s=t.closest("code");return!s||s.closest("pre")?null:Wl(s.textContent??"")}function r$(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const a=Ue(n,{listDepth:0,orderedIndex:[]});return l$(a)}function Mi(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${Ge(n,t)}

`;case"h2":return`## ${Ge(n,t)}

`;case"h3":return`### ${Ge(n,t)}

`;case"h4":return`#### ${Ge(n,t)}

`;case"h5":return`##### ${Ge(n,t)}

`;case"h6":return`###### ${Ge(n,t)}

`;case"p":return`${Ue(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Ue(n,t)}**`;case"em":case"i":return`*${Ue(n,t)}*`;case"del":return`~~${Ue(n,t)}~~`;case"a":{const a=n.getAttribute("href")??"",i=Ue(n,t);return!a||a===i?i:`[${i}](${a})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const a=n.querySelector("code"),i=a?a.textContent??"":n.textContent??"",r=a?.className.match(/language-(\S+)/);return`\`\`\`${r?r[1]:""}
${i}
\`\`\`

`}case"blockquote":return Ue(n,t).trim().split(`
`).map(r=>`> ${r}`).join(`
`)+`

`;case"ul":return ql(n,t,!1);case"ol":return ql(n,t,!0);case"li":return Bu(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return o$(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Ue(n,t);default:return Ue(n,t)}}function Ue(e,t){let n="";for(const s of Array.from(e.childNodes))n+=Mi(s,t);return n}function Ge(e,t){return Ue(e,t).replace(/\n+/g," ").trim()}function ql(e,t,n){const s=Array.from(e.children).filter(r=>r.tagName.toLowerCase()==="li"),a="  ".repeat(t.listDepth);let i="";for(let r=0;r<s.length;r++){const l=s[r],c={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,r+1]},u=n?`${r+1}. `:"- ",h=Bu(l,c);i+=`${a}${u}${h}
`}return t.listDepth===0&&(i+=`
`),i}function Bu(e,t){let n="";for(const s of Array.from(e.childNodes)){const a=s.tagName?.toLowerCase();a==="ul"||a==="ol"?n+=`
`+Mi(s,t):n+=Mi(s,t)}return n.trim()}function o$(e,t){const n=[],s=e.querySelector("thead tr"),a=e.querySelectorAll("tbody tr");if(s){const u=Array.from(s.querySelectorAll("th, td")).map(h=>Ge(h,t));n.push(u)}for(const u of Array.from(a)){const h=Array.from(u.querySelectorAll("td, th")).map(f=>Ge(f,t));n.push(h)}if(n.length===0){const u=e.querySelectorAll("tr");for(const h of Array.from(u)){const f=Array.from(h.querySelectorAll("td, th")).map(m=>Ge(m,t));n.push(f)}}if(n.length===0)return"";const i=Math.max(...n.map(u=>u.length)),r=[];for(let u=0;u<i;u++)r[u]=Math.max(3,...n.map(h=>(h[u]??"").length));let l="";const c=u=>`| ${r.map((f,m)=>(u[m]??"").padEnd(f)).join(" | ")} |`;l+=c(n[0])+`
`,l+=`| ${r.map(u=>"-".repeat(u)).join(" | ")} |
`;for(let u=1;u<n.length;u++)l+=c(n[u])+`
`;return l+`
`}function l$(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function c$(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function d$(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function u$(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let Bn=null,dn=null;function Hl(e,t,n=1500){Bn&&clearTimeout(Bn),Bn=setTimeout(()=>{e!==dn&&(dn=e,t(e))},n)}function p$(e,t){Bn&&clearTimeout(Bn),e!==dn&&(dn=e,t(e))}function ri(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return r$(e.innerHTML)}function h$(e){const{data:t,loading:n,error:s,onRefresh:a,onOpenInObsidian:i,onSaveBrief:r,onToggleCheckbox:l,onOpenFile:c}=e;if(n)return o`
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
    `;if(s)return o`
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
            ${a?o`<button class="retry-button" @click=${a}>Retry</button>`:p}
          </div>
        </div>
      </div>
    `;if(!t||!t.content)return o`
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
    `;dn===null&&(dn=t.content);const u=g=>{const w=g.currentTarget;if(r){const S=ri(w);Hl(S,r)}},h=g=>{if((g.ctrlKey||g.metaKey)&&g.key==="s"){g.preventDefault();const w=g.currentTarget;if(r){const S=ri(w);p$(S,r)}}if((g.ctrlKey||g.metaKey)&&g.key==="l"){g.preventDefault();const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,T=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");if(T){const _=T.querySelector('input[type="checkbox"]');if(_)_.nextSibling?.nodeType===Node.TEXT_NODE&&_.nextSibling.textContent===" "&&_.nextSibling.remove(),_.remove();else{const $=document.createElement("input");$.type="checkbox",T.insertBefore(document.createTextNode(" "),T.firstChild),T.insertBefore($,T.firstChild)}const d=g.currentTarget;if(r){const $=ri(d);Hl($,r)}}}if(g.key==="Enter"&&!g.shiftKey){const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,T=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");T&&T.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const _=window.getSelection();if(!_||_.rangeCount===0)return;const d=_.focusNode,$=d instanceof HTMLElement?d.closest("li"):d?.parentElement?.closest("li");if($&&$!==T&&!$.querySelector('input[type="checkbox"]')){const A=document.createElement("input");A.type="checkbox",$.insertBefore(A,$.firstChild),$.insertBefore(document.createTextNode(" "),A.nextSibling);const x=document.createRange();x.setStartAfter(A.nextSibling),x.collapse(!0),_.removeAllRanges(),_.addRange(x)}},0)}},f=g=>{const w=g.target;if(w.tagName==="INPUT"&&w.getAttribute("type")==="checkbox"){const T=w,_=g.currentTarget;if(l&&_){const $=Array.from(_.querySelectorAll('input[type="checkbox"]')).indexOf(T);$>=0&&l($,T.checked)}return}const S=Nu(g.target);S&&c&&(g.preventDefault(),c(S))},m=Vf(c$(t.content));return o`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${d$(t.updatedAt)}</span>
          ${i?o`
                <a
                  href="${u$(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${g=>{g.preventDefault(),i()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:p}
          ${a?o`
                <button class="brief-refresh-btn" @click=${a} title="Refresh">
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
            @input=${u}
            @keydown=${h}
            @click=${f}
          >${_e(m)}</div>
        </div>
      </div>
    </div>
  `}function Fu(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Uu(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function jl(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function zu(e){return`ws-task-priority ws-task-priority--${e}`}function Ku(e){return e==="high"?"High":e==="low"?"Low":"Med"}function Wu(e){if(!e)return"";const t=te();return e===t?"Today":e<t?`Overdue (${e})`:e}function qu(e){if(!e)return"ws-task-due";const t=te();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Gs(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,a)=>{if(t==="priority"){const i=n[s.priority]-n[a.priority];return i!==0?i:s.dueDate&&a.dueDate?s.dueDate.localeCompare(a.dueDate):s.dueDate&&!a.dueDate?-1:!s.dueDate&&a.dueDate?1:0}if(t==="newest")return(a.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&a.dueDate){const i=s.dueDate.localeCompare(a.dueDate);if(i!==0)return i}else{if(s.dueDate&&!a.dueDate)return-1;if(!s.dueDate&&a.dueDate)return 1}return n[s.priority]-n[a.priority]})}function Vl(e,t,n,s,a,i){const r=e.status==="complete";return s===e.id?o`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${c=>{c.preventDefault();const u=c.currentTarget,h=u.querySelector(".ws-task-edit-input"),f=u.querySelector(".ws-task-date-input"),m=h.value.trim();m&&(i?.(e.id,{title:m,dueDate:f.value||null}),a?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${c=>c.stopPropagation()}
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
    `:o`
    <div class="ws-list-row ws-task-row ${r?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${r?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${r?"Mark incomplete":"Mark complete"}
      >
        ${r?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${r?"ws-task-title--done":""}"
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?o`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${zu(e.priority)}>${Ku(e.priority)}</span>
      ${e.dueDate?o`<span class=${qu(e.dueDate)}>${Wu(e.dueDate)}</span>`:p}
      ${!r&&e.queueStatus?.status==="processing"?o`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!r&&e.queueStatus?.status==="review"&&n?o`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:!r&&n?o`<button
                class="ws-task-start-btn"
                @click=${()=>n(e.id)}
                title="Start working on this task"
              >Start</button>`:p}
    </div>
  `}function Di(e,t,n,s,a,i){const r=e.status==="complete";return s===e.id?o`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${c=>{c.preventDefault();const u=c.currentTarget,h=u.querySelector(".ws-task-edit-input"),f=u.querySelector(".ws-task-date-input"),m=h.value.trim();m&&(i?.(e.id,{title:m,dueDate:f.value||null}),a?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${c=>c.stopPropagation()}
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
    `:o`
    <div class="ws-list-row ws-task-row ${r?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${r?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${r?"Mark incomplete":"Mark complete"}
      >
        ${r?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${r?"ws-task-title--done":""}"
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?o`<span class="ws-task-project">${e.project}</span>`:p}
      ${e.briefSection?o`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${zu(e.priority)}>${Ku(e.priority)}</span>
      ${e.dueDate?o`<span class=${qu(e.dueDate)}>${Wu(e.dueDate)}</span>`:p}
      ${!r&&e.queueStatus?.status==="processing"?o`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!r&&e.queueStatus?.status==="review"&&n?o`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:!r&&n?o`<button
                class="ws-task-start-btn"
                @click=${()=>n(e.id)}
                title="Start working on this task"
              >Start</button>`:p}
    </div>
  `}function f$(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function Gl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function Ql(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function Hu(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,a)=>{if(a.type==="file")(a.name.toLowerCase().includes(n)||a.path.toLowerCase().includes(n))&&s.push(a);else{const i=Hu(e,a.children??[]);i.length>0&&s.push({...a,children:i})}return s},[])}function ju(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=ju(n.children));return t}function Vu(e,t,n){if(e.type==="file"){const r=n.pinnedPaths.has(e.path);return o`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Uu(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?o`<span class="ws-list-meta">${Fu(e.size)}</span>`:p}
          ${e.modified?o`<span class="ws-list-meta">${K(e.modified.getTime())}</span>`:p}
        </button>
        <button
          class="ws-pin-btn ${r?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,r)}
          title=${r?"Unpin":"Pin"}
        >
          ${r?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),a=e.children??[],i=ju(a);return o`
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
      ${s?o`
            <div class="ws-folder-children">
              ${a.map(r=>Vu(r,t+1,n))}
            </div>
          `:p}
    </div>
  `}function g$(e,t,n){return o`
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
      ${n?o`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:p}
    </div>
  `}function Yl(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e;return o`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${Uu(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${Fu(n.size)}</span>
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
  `}function m$(e,t){return o`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>o`
          ${s>0?o`<span class="breadcrumb-sep">/</span>`:p}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function v$(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:a,onBrowseFolder:i,onBrowseSearch:r,onBrowseBack:l,onCreateFolder:c,onItemClick:u}=e,h=a??t??[];return o`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>l?.()}>
          &larr; Back
        </button>
        ${n?m$(n,f=>i?.(f)):p}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${f=>{const m=f.target;r?.(m.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const f=prompt("New folder name:");if(f?.trim()){const m=n?.[n.length-1]?.path??".";c?.(`${m}/${f.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${h.length===0?o`<div class="workspace-browse-empty">No files found</div>`:h.map(f=>o`
              <button
                class="workspace-browse-entry"
                @click=${()=>{f.type==="folder"?i?.(f.path):u&&u({path:f.path,name:f.name,type:f.fileType??"text",size:f.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${f.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${f.name}</span>
                ${f.excerpt?o`<span class="browse-entry-excerpt">${f.excerpt}</span>`:p}
              </button>
            `)}
      </div>
    </div>
  `}function y$(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:a=!1,onItemSearch:i,onBack:r,onItemClick:l,onSessionClick:c,onPinToggle:u,onPinSessionToggle:h,onToggleFolder:f,onToggleTaskComplete:m,onCreateTask:g,onToggleCompletedTasks:w,onStartTask:S,editingTaskId:T,onEditTask:_,onUpdateTask:d}=e,$=Gl(n,t.pinned).toSorted((I,F)=>F.modified.getTime()-I.modified.getTime()),A=Ql(n,t.pinnedSessions),x=Gl(n,t.outputs).filter(I=>!t.pinned.some(F=>F.path===I.path)),L=(t.folderTree?.length??0)>0,E=L?Hu(n,t.folderTree):[],z=Ql(n,t.sessions),V=new Set(t.pinnedSessions.map(I=>I.key)),H=new Set(t.pinned.map(I=>I.path)),j=n.trim().length>0,ae=$.length>0||A.length>0,me=z.length>0||t.sessions.length===0||j,D={expandedFolders:s,pinnedPaths:H,workspaceId:t.id,onToggleFolder:f,onItemClick:l,onPinToggle:u};return o`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${r}>←</button>
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
            @input=${I=>i?.(I.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?v$(e):p}

        ${ae?o`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${$.length+A.length}</span>
                  </div>
                  <div class="ws-list">
                    ${A.map(I=>o`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>c?.(I)}>
                            <span class=${jl(I.status)}></span>
                            <span class="ws-list-title">${I.title}</span>
                            <span class="ws-list-meta">${K(I.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>h?.(t.id,I.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${$.map(I=>Yl({workspaceId:t.id,entry:I,pinned:!0,onOpen:l,onPinToggle:u}))}
                  </div>
                </section>
              `:p}

        ${b$({tasks:t.tasks??[],workspaceName:t.name,showCompleted:a,onToggleTaskComplete:m,onCreateTask:g,onToggleCompletedTasks:w,onStartTask:S,editingTaskId:T,onEditTask:_,onUpdateTask:d})}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${L?E.length:x.length}</span>
          </div>
          <div class="ws-list ws-list--scroll">
            ${L?E.length===0?o`<div class="ws-empty">No artifacts</div>`:E.map(I=>Vu(I,0,D)):x.length===0?o`<div class="ws-empty">No artifacts</div>`:x.map(I=>Yl({workspaceId:t.id,entry:I,pinned:!1,onOpen:l,onPinToggle:u}))}
          </div>
        </section>

        ${me?o`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${z.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${z.length===0?o`
                            <div class="ws-empty">No sessions</div>
                          `:z.map(I=>o`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>c?.(I)}>
                                  <span class=${jl(I.status)}></span>
                                  <span class="ws-list-title">${I.title}</span>
                                  <span class="ws-list-meta">${K(I.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${V.has(I.key)?"active":""}"
                                  @click=${()=>h?.(t.id,I.key,V.has(I.key))}
                                  title=${V.has(I.key)?"Unpin":"Pin"}
                                >
                                  ${V.has(I.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:p}
      </div>
    </div>
  `}function b$(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:a,onCreateTask:i,onToggleCompletedTasks:r,onStartTask:l,editingTaskId:c,onEditTask:u,onUpdateTask:h}=e,f=Gs(t.filter(g=>g.status==="pending")),m=Gs(t.filter(g=>g.status==="complete"));return o`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${f.length} open${m.length>0?`, ${m.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${f.length===0&&m.length===0?o`<div class="ws-empty">No tasks</div>`:p}
        ${f.map(g=>Vl(g,a,l,c,u,h))}
        ${m.length>0?o`
              <button class="ws-task-completed-toggle" @click=${()=>r?.()}>
                ${s?"Hide":"Show"} ${m.length} completed
              </button>
              ${s?m.map(g=>Vl(g,a,l,c,u,h)):p}
            `:p}
      </div>
      ${i?o`
            <form
              class="ws-task-create-form"
              @submit=${g=>{g.preventDefault();const S=g.currentTarget.querySelector("input"),T=S.value.trim();T&&(i(T,n),S.value="")}}
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
  `}function w$(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:a,itemSearchQuery:i,expandedFolders:r,loading:l,createLoading:c,error:u,allTasks:h=[],taskFilter:f="outstanding",taskSort:m="due",showCompletedTasks:g=!1,editingTaskId:w,workspaceNames:S=[],onSearch:T,onItemSearch:_,onSelectWorkspace:d,onBack:$,onItemClick:A,onSessionClick:x,onPinToggle:L,onPinSessionToggle:E,onCreateWorkspace:z,onDeleteWorkspace:V,onToggleFolder:H,onTeamSetup:j,onToggleTaskComplete:ae,onCreateTask:me,onSetTaskFilter:D,onSetTaskSort:I,onToggleCompletedTasks:F,onStartTask:X,onEditTask:N,onUpdateTask:Me}=e,ke=n.filter(B=>f$(a,`${B.name} ${B.path} ${B.type}`));return s?y$({workspace:s,itemSearchQuery:i??"",expandedFolders:r,showCompletedTasks:g,onItemSearch:_,onBack:$,onItemClick:A,onSessionClick:x,onPinToggle:L,onPinSessionToggle:E,onToggleFolder:H,onToggleTaskComplete:ae,onCreateTask:me,onToggleCompletedTasks:F,onStartTask:X,editingTaskId:w,onEditTask:N,onUpdateTask:Me,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder}):o`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async B=>{if(B.preventDefault(),c||!z)return;const gn=B.currentTarget,J=new FormData(gn),mn=J.get("name"),G=(typeof mn=="string"?mn:"").trim();if(!G)return;const tt=J.get("type"),ft=(typeof tt=="string"?tt:"project").trim().toLowerCase(),nt=ft==="team"||ft==="personal"?ft:"project",vn=J.get("path"),Ut=(typeof vn=="string"?vn:"").trim();await z({name:G,type:nt,...Ut?{path:Ut}:{}})!==!1&&gn.reset()}}
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
            @input=${B=>T?.(B.target.value)}
          />
          <span class="workspaces-count">${ke.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${j?o`<button class="ws-team-setup-btn" @click=${()=>j()}>Team Setup</button>`:p}
      </div>

      ${u?o`<div class="callout danger" style="margin: 16px;">${u}</div>`:p}

      ${l?o`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:o`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${ke.length===0?o`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces found":"Connect to gateway to see workspaces"}</span>
                          </div>
                        `:ke.map(B=>g$(B,d,V))}
                </div>

                ${k$({tasks:h,taskFilter:f,taskSort:m,onToggleTaskComplete:ae,onSetTaskFilter:D,onSetTaskSort:I,onCreateTask:me,workspaceNames:S,onStartTask:X,editingTaskId:w,onEditTask:N,onUpdateTask:Me})}
              </div>
            `}
    </div>
  `}function k$(e){const{tasks:t,taskFilter:n,taskSort:s="due",onToggleTaskComplete:a,onSetTaskFilter:i,onSetTaskSort:r,onCreateTask:l,workspaceNames:c=[],onStartTask:u,editingTaskId:h,onEditTask:f,onUpdateTask:m}=e;if(t.length===0&&!l)return o``;let g;if(n==="outstanding")g=t.filter(S=>S.status==="pending");else if(n==="today"){const S=te();g=t.filter(T=>T.status==="pending"&&T.dueDate!=null&&T.dueDate<=S)}else n==="complete"?g=t.filter(S=>S.status==="complete"):g=t;const w=Gs(g,s);return o`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <h3>All Tasks</h3>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${n==="all"?"active":""}"
                @click=${()=>i?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${n==="outstanding"?"active":""}"
                @click=${()=>i?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${n==="today"?"active":""}"
                @click=${()=>i?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${n==="complete"?"active":""}"
                @click=${()=>i?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${s}
              @change=${S=>r?.(S.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${l?o`
              <form
                class="ws-task-create-form"
                @submit=${S=>{S.preventDefault();const T=S.currentTarget,_=T.querySelector(".ws-task-create-input"),d=T.querySelector(".ws-task-create-project"),$=_.value.trim();if(!$)return;const A=d?.value||c[0]||"";l($,A),_.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${c.length>0?o`
                      <select class="ws-task-create-project">
                        ${c.map(S=>o`<option value=${S}>${S}</option>`)}
                      </select>
                    `:p}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:p}
        <div class="ws-list ws-list--scroll">
          ${w.length===0?o`<div class="ws-empty">No tasks</div>`:w.map(S=>Di(S,a,u,h,f,m))}
        </div>
      </section>
    </div>
  `}function $$(e){return e===te()}function Gu(e){const t=new Date(e+"T12:00:00");return S$(t)}function S$(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],a=n[e.getMonth()],i=e.getDate();return`${s}, ${a} ${i}`}function A$(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime()))return"";const s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleString()}function T$(e){if(!e)return"";const t=e.split("/");return t[t.length-1]||e}function x$(e,t,n){const s=a=>{if(!e.onOpenFile)return;const i=Nu(a.target);i&&(a.preventDefault(),e.onOpenFile(i))};return o`
    <div class="my-day-card agent-log-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x26A1;</span>
          <span>AGENT LOG</span>
        </div>
        <div class="agent-log-header-actions">
          ${t?.updatedAt?o`<span class="brief-updated">${A$(t.updatedAt)}</span>`:p}
          ${t?.sourcePath?o`<span class="agent-log-file" title=${t.sourcePath}>
                ${T$(t.sourcePath)}
              </span>`:p}
          ${e.onAgentLogRefresh?o`<button class="brief-refresh-btn agent-log-refresh-btn"
                @click=${e.onAgentLogRefresh} title="Refresh agent log">&#x21BB;</button>`:p}
        </div>
      </div>
      <div class="my-day-card-content agent-log-content">
        ${e.agentLogLoading?o`<div class="brief-loading"><div class="spinner"></div><span>Loading agent day...</span></div>`:e.agentLogError?o`<div class="brief-error"><span class="error-icon">&#x26A0;&#xFE0F;</span><span>${e.agentLogError}</span></div>`:t?.content?.trim()?o`<div class="brief-content brief-content--read agent-log-readonly" @click=${s}>
                  <div class="brief-rendered agent-log-rendered">${_e(we(t.content))}</div>
                </div>`:o`<div class="my-day-empty">No agent day entry found for ${n}. Create/update <code>AGENT-DAY.md</code> and refresh.</div>`}
      </div>
    </div>
  `}function _$(e){return o`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),a=s.value.trim();a&&(e(a),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function C$(e){const t=Gs(e.todayTasks??[],"due"),n=t.filter(a=>a.status==="pending"),s=t.filter(a=>a.status==="complete");return o`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${n.length} open${s.length>0?o`, ${s.length} done`:p}
        </span>
      </div>
      <div class="my-day-card-content">
        ${e.todayTasksLoading?o`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:o`
              ${e.onCreateTask?_$(e.onCreateTask):p}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?o`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(a=>Di(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
              </div>
              ${s.length>0?o`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?o`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(a=>Di(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:p}
                  `:p}
            `}
      </div>
    </div>
  `}function L$(e){const t=te(),n=e.selectedDate??t,s=$$(n),a=Gu(n),i=e.viewMode??"my-day";return o`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?o`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:p}
        <span class="today-date-label ${s?"":"past-date"}">${a}</span>
        ${e.onDateNext?o`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:p}
        ${!s&&e.onDateToday?o`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:p}
      </div>
      <div class="today-view-toggle">
        <button class="${i==="my-day"?"active":""}"
          @click=${()=>e.onViewModeChange?.("my-day")}>My Day</button>
        <button class="${i==="agent-log"?"active":""}"
          @click=${()=>e.onViewModeChange?.("agent-log")}>Agent Log</button>
      </div>
      ${!e.focusPulseActive&&e.onStartMorningSet?o`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
            title="Start your morning focus ritual">\u2600\uFE0F Start Morning Set</button>`:p}
      ${e.onRefresh?o`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">&#x21BB;</button>`:null}
    </div>
  `}function E$(e){const t=te(),n=e.selectedDate??t,s=e.viewMode??"my-day",a=e.agentLog??null;if(e.loading)return o`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const i={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onToggleCheckbox:e.onBriefToggleCheckbox,onOpenFile:e.onOpenFile};return o`
    <div class="my-day-container">
      <!-- Two-column layout: Tasks (left) + Brief/AgentLog (right) -->
      <div class="my-day-columns">
        <div class="my-day-tasks-col">
          ${C$(e)}
        </div>
        <div class="my-day-brief-col">
          ${s==="my-day"?h$(i):x$(e,a,Gu(n))}
        </div>
      </div>
    </div>
  `}function R$(e){const t=N$(e),n=W$(e);return o`
    ${H$(n)}
    ${q$(t)}
    ${I$(e)}
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
        ${e.nodes.length===0?o`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>t0(s))}
      </div>
    </section>
  `}function I$(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return o`
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
      ${e.devicesError?o`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:p}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?o`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(a=>P$(a,e))}
            `:p}
        ${s.length>0?o`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(a=>M$(a,e))}
            `:p}
        ${n.length===0&&s.length===0?o`
                <div class="muted">No paired devices.</div>
              `:p}
      </div>
    </section>
  `}function P$(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?K(e.ts):"n/a",a=e.role?.trim()?`role: ${e.role}`:"role: -",i=e.isRepair?" · repair":"",r=e.remoteIp?` · ${e.remoteIp}`:"";return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${r}</div>
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
  `}function M$(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",a=`roles: ${ui(e.roles)}`,i=`scopes: ${ui(e.scopes)}`,r=Array.isArray(e.tokens)?e.tokens:[];return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${a} · ${i}</div>
        ${r.length===0?o`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:o`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${r.map(l=>D$(e.deviceId,l,t))}
              </div>
            `}
      </div>
    </div>
  `}function D$(e,t,n){const s=t.revokedAtMs?"revoked":"active",a=`scopes: ${ui(t.scopes)}`,i=K(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return o`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${a} · ${i}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?p:o`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const dt="__defaults__",Xl=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],O$=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function N$(e){const t=e.configForm,n=J$(e.nodes),{defaultBinding:s,agents:a}=e0(t),i=!!t,r=e.configSaving||e.configFormMode==="raw";return{ready:i,disabled:r,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:a,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function Jl(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function B$(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function F$(e){const t=e?.defaults??{};return{security:Jl(t.security),ask:B$(t.ask),askFallback:Jl(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function U$(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(a=>{if(!a||typeof a!="object")return;const i=a,r=typeof i.id=="string"?i.id.trim():"";if(!r)return;const l=typeof i.name=="string"?i.name.trim():void 0,c=i.default===!0;s.push({id:r,name:l||void 0,isDefault:c})}),s}function z$(e,t){const n=U$(e),s=Object.keys(t?.agents??{}),a=new Map;n.forEach(r=>a.set(r.id,r)),s.forEach(r=>{a.has(r)||a.set(r,{id:r})});const i=Array.from(a.values());return i.length===0&&i.push({id:"main",isDefault:!0}),i.sort((r,l)=>{if(r.isDefault&&!l.isDefault)return-1;if(!r.isDefault&&l.isDefault)return 1;const c=r.name?.trim()?r.name:r.id,u=l.name?.trim()?l.name:l.id;return c.localeCompare(u)}),i}function K$(e,t){return e===dt?dt:e&&t.some(n=>n.id===e)?e:dt}function W$(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=F$(t),a=z$(e.configForm,t),i=Z$(e.nodes),r=e.execApprovalsTarget;let l=r==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;r==="node"&&l&&!i.some(f=>f.id===l)&&(l=null);const c=K$(e.execApprovalsSelectedAgent,a),u=c!==dt?(t?.agents??{})[c]??null:null,h=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:c,selectedAgent:u,agents:a,allowlist:h,target:r,targetNodeId:l,targetNodes:i,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function q$(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return o`
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

      ${e.formMode==="raw"?o`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:p}

      ${e.ready?o`
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
                      ${e.nodes.map(s=>o`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?p:o`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?o`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>X$(s,e))}
            </div>
          `:o`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function H$(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return o`
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

      ${j$(e)}

      ${t?o`
            ${V$(e)}
            ${G$(e)}
            ${e.selectedScope===dt?p:Q$(e)}
          `:o`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function j$(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return o`
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
              @change=${s=>{if(s.target.value==="node"){const r=e.targetNodes[0]?.id??null;e.onSelectTarget("node",n||r)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?o`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const i=s.target.value.trim();e.onSelectTarget("node",i||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>o`<option
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
      ${e.target==="node"&&!t?o`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:p}
    </div>
  `}function V$(e){return o`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===dt?"active":""}"
          @click=${()=>e.onSelectScope(dt)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return o`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function G$(e){const t=e.selectedScope===dt,n=e.defaults,s=e.selectedAgent??{},a=t?["defaults"]:["agents",e.selectedScope],i=typeof s.security=="string"?s.security:void 0,r=typeof s.ask=="string"?s.ask:void 0,l=typeof s.askFallback=="string"?s.askFallback:void 0,c=t?n.security:i??"__default__",u=t?n.ask:r??"__default__",h=t?n.askFallback:l??"__default__",f=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,m=f??n.autoAllowSkills,g=f==null;return o`
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
              @change=${w=>{const T=w.target.value;!t&&T==="__default__"?e.onRemove([...a,"security"]):e.onPatch([...a,"security"],T)}}
            >
              ${t?p:o`<option value="__default__" ?selected=${c==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Xl.map(w=>o`<option
                    value=${w.value}
                    ?selected=${c===w.value}
                  >
                    ${w.label}
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
              @change=${w=>{const T=w.target.value;!t&&T==="__default__"?e.onRemove([...a,"ask"]):e.onPatch([...a,"ask"],T)}}
            >
              ${t?p:o`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${O$.map(w=>o`<option
                    value=${w.value}
                    ?selected=${u===w.value}
                  >
                    ${w.label}
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
              @change=${w=>{const T=w.target.value;!t&&T==="__default__"?e.onRemove([...a,"askFallback"]):e.onPatch([...a,"askFallback"],T)}}
            >
              ${t?p:o`<option value="__default__" ?selected=${h==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Xl.map(w=>o`<option
                    value=${w.value}
                    ?selected=${h===w.value}
                  >
                    ${w.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":g?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${m?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${m}
              @change=${w=>{const S=w.target;e.onPatch([...a,"autoAllowSkills"],S.checked)}}
            />
          </label>
          ${!t&&!g?o`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...a,"autoAllowSkills"])}
              >
                Use default
              </button>`:p}
        </div>
      </div>
    </div>
  `}function Q$(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return o`
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
      ${n.length===0?o`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,a)=>Y$(e,s,a))}
    </div>
  `}function Y$(e,t,n){const s=t.lastUsedAt?K(t.lastUsedAt):"never",a=t.lastUsedCommand?qn(t.lastUsedCommand,120):null,i=t.lastResolvedPath?qn(t.lastResolvedPath,120):null;return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${a?o`<div class="list-sub mono">${a}</div>`:p}
        ${i?o`<div class="list-sub mono">${i}</div>`:p}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${r=>{const l=r.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],l.value)}}
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
  `}function X$(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,a=t.nodes.length>0;return o`
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
            ${t.nodes.map(i=>o`<option
                  value=${i.id}
                  ?selected=${n===i.id}
                >
                  ${i.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function J$(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.run"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const r=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:r===i?i:`${r} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Z$(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.execApprovals.get"||String(l)==="system.execApprovals.set"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const r=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:r===i?i:`${r} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function e0(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},a=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,i=e.agents??{},r=Array.isArray(i.list)?i.list:[];if(r.length===0)return{defaultBinding:a,agents:[t]};const l=[];return r.forEach((c,u)=>{if(!c||typeof c!="object")return;const h=c,f=typeof h.id=="string"?h.id.trim():"";if(!f)return;const m=typeof h.name=="string"?h.name.trim():void 0,g=h.default===!0,S=(h.tools??{}).exec??{},T=typeof S.node=="string"&&S.node.trim()?S.node.trim():null;l.push({id:f,name:m||void 0,index:u,isDefault:g,binding:T})}),l.length===0&&l.push(t),{defaultBinding:a,agents:l}}function t0(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),a=Array.isArray(e.caps)?e.caps:[],i=Array.isArray(e.commands)?e.commands:[];return o`
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
          ${a.slice(0,12).map(r=>o`<span class="chip">${String(r)}</span>`)}
          ${i.slice(0,8).map(r=>o`<span class="chip">${String(r)}</span>`)}
        </div>
      </div>
    </div>
  `}function n0(e){const t=e.hello?.snapshot,n=t?.uptimeMs?qi(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",a=(()=>{if(e.connected||!e.lastError)return null;const r=e.lastError.toLowerCase();if(!(r.includes("unauthorized")||r.includes("connect failed")))return null;const c=!!e.settings.token.trim(),u=!!e.password.trim();return!c&&!u?o`
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
      `:o`
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
    `})(),i=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const l=e.lastError.toLowerCase();return!l.includes("secure context")&&!l.includes("device identity required")?null:o`
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
    `})();return o`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Gateway Access</div>
        <div class="card-sub">Where the dashboard connects and how it authenticates.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>WebSocket URL</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${r=>{const l=r.target.value;e.onSettingsChange({...e.settings,gatewayUrl:l})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          <label class="field">
            <span>Gateway Token</span>
            <input
              .value=${e.settings.token}
              @input=${r=>{const l=r.target.value;e.onSettingsChange({...e.settings,token:l})}}
              placeholder="CLAWDBOT_GATEWAY_TOKEN"
            />
          </label>
          <label class="field">
            <span>Password (not stored)</span>
            <input
              type="password"
              .value=${e.password}
              @input=${r=>{const l=r.target.value;e.onPasswordChange(l)}}
              placeholder="system or shared password"
            />
          </label>
          <label class="field">
            <span>Default Session Key</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${r=>{const l=r.target.value;e.onSessionKeyChange(l)}}
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
        ${e.lastError?o`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${a??""}
              ${i??""}
            </div>`:o`
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
        <div class="muted">Next wake ${Du(e.cronNext)}</div>
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
        ${e.updateStatus?.openclawUpdateAvailable?o`
              <div class="callout" style="margin-top: 14px;">
                <div>
                  <b>OpenClaw ${e.updateStatus.openclawVersion} \u2192 ${e.updateStatus.openclawLatest??"newer"}</b>
                </div>
                <div class="row" style="margin-top: 10px; gap: 8px;">
                  ${e.onUpdateNow?o`<button
                          class="btn primary"
                          ?disabled=${e.updateRunning||!e.connected}
                          @click=${()=>e.onUpdateNow?.()}
                        >
                          ${e.updateRunning?"Updating...":"Update Now"}
                        </button>`:p}
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">openclaw update</span>
                </div>
              </div>
            `:p}
        ${e.updateStatus?.pluginUpdateAvailable?o`
              <div class="callout" style="margin-top: ${e.updateStatus?.openclawUpdateAvailable?"10":"14"}px;">
                <div>
                  <b>GodMode ${e.updateStatus.pluginVersion} \u2192 ${e.updateStatus.pluginLatest??"newer"}</b>
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Run: <span class="mono">npm update -g @godmode-team/godmode</span>
                </div>
              </div>
            `:p}
        ${e.updateError?o`<div class="callout danger" style="margin-top: 14px;">
              ${e.updateError}
            </div>`:p}
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
  `}function s0(e,t=5){return e.filter(n=>n.lastContact).toSorted((n,s)=>{const a=new Date(n.lastContact).getTime();return new Date(s.lastContact).getTime()-a}).slice(0,t)}function a0(e){const t=new Map;for(const n of e)if(n.tags.length===0){const s=t.get("uncategorized")??[];s.push(n),t.set("uncategorized",s)}else for(const s of n.tags){const a=t.get(s)??[];a.push(n),t.set(s,a)}return t}function Qu(e){if(!e)return"";const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60*60*24));return a===0?"Today":a===1?"Yesterday":a<7?`${a}d ago`:a<30?`${Math.floor(a/7)}w ago`:`${Math.floor(a/30)}mo ago`}function Zl(e,t){return o`
    <button class="people-card" @click=${t} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
      <div class="people-card-main">
        <span class="people-avatar">${e.emoji??"👤"}</span>
        <div class="people-card-info">
          <span class="people-name">${e.name}</span>
          ${e.company||e.role?o`<span class="people-role">${[e.role,e.company].filter(Boolean).join(" at ")}</span>`:p}
        </div>
        ${e.lastContact?o`<span class="people-last-contact">${Qu(e.lastContact)}</span>`:p}
      </div>
      ${e.tags.length>0?o`
            <div class="people-tags">
              ${e.tags.map(n=>o`<span class="people-tag">${n}</span>`)}
            </div>
          `:p}
    </button>
  `}function i0(e,t){return o`
    <div class="my-day-card people-detail">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          ${t?o`<button class="people-back-btn" @click=${t}>← Back</button>`:p}
          <span class="my-day-card-icon">${e.emoji??"👤"}</span>
          <span>${e.name}</span>
        </div>
      </div>
      <div class="my-day-card-content">
        ${e.company||e.role?o`<div class="people-detail-row">
              <span class="people-detail-label">Role</span>
              <span>${[e.role,e.company].filter(Boolean).join(" at ")}</span>
            </div>`:p}
        ${e.email?o`<div class="people-detail-row">
              <span class="people-detail-label">Email</span>
              <a href="mailto:${e.email}">${e.email}</a>
            </div>`:p}
        ${e.phone?o`<div class="people-detail-row">
              <span class="people-detail-label">Phone</span>
              <span>${e.phone}</span>
            </div>`:p}
        ${e.birthday?o`<div class="people-detail-row">
              <span class="people-detail-label">Birthday</span>
              <span>${e.birthday}</span>
            </div>`:p}
        ${e.lastContact?o`<div class="people-detail-row">
              <span class="people-detail-label">Last Contact</span>
              <span>${Qu(e.lastContact)}</span>
            </div>`:p}
        ${e.tags.length>0?o`<div class="people-detail-row">
              <span class="people-detail-label">Tags</span>
              <div class="people-tags">
                ${e.tags.map(n=>o`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:p}
        ${e.projects&&e.projects.length>0?o`<div class="people-detail-row">
              <span class="people-detail-label">Projects</span>
              <div class="people-tags">
                ${e.projects.map(n=>o`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:p}
        ${e.notes?o`<div class="people-detail-row">
              <span class="people-detail-label">Notes</span>
              <span style="white-space: pre-wrap;">${e.notes}</span>
            </div>`:p}
      </div>
    </div>
  `}function r0(e){const{people:t,loading:n,error:s,selectedId:a,searchQuery:i="",onRefresh:r,onSelectPerson:l,onBack:c,onSearchChange:u,onImportContacts:h}=e;if(n)return o`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading contacts...</span>
        </div>
      </div>
    `;if(s)return o`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${s}</span>
          ${r?o`<button class="retry-button" @click=${r}>Retry</button>`:p}
        </div>
      </div>
    `;if(a){const w=t.find(S=>S.id===a);if(w)return o`
        <div class="my-day-container">
          <div class="my-day-header">
            <div class="my-day-header-left">
              <h1 class="my-day-title">People</h1>
              <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
            </div>
          </div>
          <div class="my-day-grid" style="grid-template-columns: 1fr;">
            ${i0(w,c)}
          </div>
        </div>
      `}const f=i?t.filter(w=>{const S=i.toLowerCase();return w.name.toLowerCase().includes(S)||(w.company??"").toLowerCase().includes(S)||(w.role??"").toLowerCase().includes(S)||w.tags.some(T=>T.toLowerCase().includes(S))}):t,m=a0(f),g=s0(t);return o`
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
          ${h?o`
                <div class="my-day-summary-divider"></div>
                <div style="position: relative;">
                  <button
                    class="my-day-refresh-btn"
                    @click=${w=>{const T=w.currentTarget.nextElementSibling;T.style.display=T.style.display==="block"?"none":"block"}}
                    title="Import Contacts"
                  >
                    ⬇ Import
                  </button>
                  <div
                    style="display: none; position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--mc-bg); border: 1px solid var(--mc-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000;"
                    @click=${w=>{const S=w.currentTarget;S.style.display="none"}}
                  >
                    <button
                      @click=${()=>h("apple")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      📱 Set up Apple Contacts (via Chat)
                    </button>
                    <button
                      @click=${()=>h("google")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      🌐 Set up Google Contacts (via Chat)
                    </button>
                  </div>
                </div>
              `:p}
          ${r?o`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${r} title="Refresh">↻</button>
              `:p}
        </div>
      </div>

      ${t.length>3?o`
            <div style="margin-bottom: 12px;">
              <input
                type="text"
                placeholder="Search contacts..."
                .value=${i}
                @input=${w=>u?.(w.target.value)}
                style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--mc-border); background: var(--mc-bg); color: var(--mc-text); font-size: 14px;"
              />
            </div>
          `:p}

      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${f.length===0?o`
              <div class="my-day-card">
                <div class="my-day-card-content">
                  <div class="my-day-empty">
                    ${t.length===0?"No contacts yet. Use chat to add people or run onboarding.":"No contacts match your search."}
                  </div>
                </div>
              </div>
            `:p}
        ${!i&&g.length>0?o`
              <div class="my-day-card">
                <div class="my-day-card-header">
                  <div class="my-day-card-title">
                    <span class="my-day-card-icon">⭐</span>
                    <span>Top Contacts</span>
                  </div>
                  <div class="my-day-card-count">${g.length}</div>
                </div>
                <div class="my-day-card-content">
                  ${g.map(w=>Zl(w,()=>l?.(w.id)))}
                </div>
              </div>
            `:p}
        ${Array.from(m.entries()).map(([w,S])=>o`
            <div class="my-day-card">
              <div class="my-day-card-header">
                <div class="my-day-card-title">
                  <span class="my-day-card-icon">${w==="uncategorized"?"📋":"🏷"}</span>
                  <span>${w==="uncategorized"?"Other":w}</span>
                </div>
                <div class="my-day-card-count">${S.length}</div>
              </div>
              <div class="my-day-card-content">
                ${S.map(T=>Zl(T,()=>l?.(T.id)))}
              </div>
            </div>
          `)}
      </div>
    </div>
  `}const o0=["","off","minimal","low","medium","high"],l0=["","off","on"],c0=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],d0=["","off","on","stream"];function u0(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function Yu(e){return u0(e)==="zai"}function p0(e){return Yu(e)?l0:o0}function h0(e,t){return!t||!e||e==="off"?e:"on"}function f0(e,t){return e?t&&e==="on"?"low":e:null}function g0(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function m0(){return o`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function v0(){return o`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function y0(e){return o`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function b0(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(i=>i.sessionKey)),s=t.filter(i=>!n.has(i.key)),a=e.archivedSessions.length;return o`
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

      ${e.error?o`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

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
        ${s.length===0?o`
                <div class="muted">No active sessions found.</div>
              `:s.map(i=>k0(i,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${w0(e,a)}
  `}function w0(e,t){return t===0&&!e.archivedSessionsLoading?p:o`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${y0(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?o`<span class="archived-badge">${t}</span>`:p}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${e.archivedSessionsExpanded?o`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${e.archivedSessionsLoading?o`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?o`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>$0(n,e.onUnarchive,e.loading))}
              </div>
            `:p}
    </section>
  `}function k0(e,t,n,s,a,i){const r=e.updatedAt?K(e.updatedAt):"n/a",l=e.thinkingLevel??"",c=Yu(e.modelProvider),u=h0(l,c),h=p0(e.modelProvider),f=e.verboseLevel??"",m=e.reasoningLevel??"",g=e.displayName??e.key,w=e.kind!=="global",S=w?`${xr("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return o`
    <div class="table-row">
      <div class="mono">${w?o`<a href=${S} class="session-link">${g}</a>`:g}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${T=>{const _=T.target.value.trim();n(e.key,{label:_||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${r}</div>
      <div>${fk(e)}</div>
      <div>
        <select
          .value=${u}
          ?disabled=${i}
          @change=${T=>{const _=T.target.value;n(e.key,{thinkingLevel:f0(_,c)})}}
        >
          ${h.map(T=>o`<option value=${T}>${T||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${f}
          ?disabled=${i}
          @change=${T=>{const _=T.target.value;n(e.key,{verboseLevel:_||null})}}
        >
          ${c0.map(T=>o`<option value=${T.value}>${T.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${m}
          ?disabled=${i}
          @change=${T=>{const _=T.target.value;n(e.key,{reasoningLevel:_||null})}}
        >
          ${d0.map(T=>o`<option value=${T}>${T||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${i}
          @click=${()=>a(e.key)}
          title="Archive this session"
        >
          ${m0()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function $0(e,t,n){const s=K(Date.parse(e.archivedAt));return o`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${g0(e.reason)}</div>
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
          ${v0()}
        </button>
      </div>
    </div>
  `}const S0=[{key:"trending",label:"Trending"},{key:"updated",label:"Newest"},{key:"stars",label:"Top Rated"},{key:"downloads",label:"Popular"}];function A0(e){return o`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div class="muted" style="line-height: 1.5;">
        Browse 3,000+ community skills from the
        <a href="https://clawhub.ai" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">ClawHub</a>
        registry. When you import a skill, GodMode reviews it against your current
        setup — checking for overlaps, missing tools, and integration opportunities — then
        walks you through personalizing it for your specific workflow in a dedicated chat session.
      </div>
      ${T0(e)}
      ${e.error?o`<div class="callout danger">${e.error}</div>`:p}
      ${e.message?o`<div class="callout ${e.message.kind==="error"?"danger":"success"}">
            ${e.message.message}
          </div>`:p}
      ${e.detailSlug?L0(e):p}
      ${e.detailSlug?p:x0(e)}
    </div>
  `}function T0(e){let t;return o`
    <div class="filters">
      <label class="field" style="flex: 1;">
        <span>Search ClawHub</span>
        <input
          .value=${e.query}
          @input=${n=>{const s=n.target.value;clearTimeout(t),t=setTimeout(()=>e.onSearch(s),400)}}
          placeholder="Search 3,000+ skills..."
        />
      </label>
    </div>
  `}function x0(e){return e.results&&e.query.trim()?o`
      <div>
        <div class="muted" style="margin-bottom: 8px;">
          ${e.results.length} results for "${e.query}"
        </div>
        ${e.results.length===0?o`<div class="muted">No skills found. Try a different search.</div>`:o`<div class="list">
              ${e.results.map(t=>_0(t,e))}
            </div>`}
      </div>
    `:o`
    <div>
      <div class="chip-row" style="margin-bottom: 12px;">
        ${S0.map(t=>o`
            <button
              class="chip ${e.exploreSort===t.key?"chip-ok":""}"
              style="cursor: pointer; border: none; background: var(${e.exploreSort===t.key?"--chip-ok-bg, #e6f4ea":"--chip-bg, #f3f3f3"});"
              @click=${()=>e.onExplore(t.key)}
            >
              ${t.label}
            </button>
          `)}
      </div>
      ${e.loading?o`<div class="muted">Loading skills...</div>`:p}
      ${e.exploreItems&&e.exploreItems.length>0?o`<div class="list">
            ${e.exploreItems.map(t=>C0(t,e))}
          </div>`:e.loading?p:o`<div class="muted">No skills found.</div>`}
    </div>
  `}function _0(e,t){const n=e.slug??"unknown",s=e.displayName??n,a=t.importing===n;return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">${qn(e.summary??"",120)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${n}</span>
          ${e.version?o`<span class="chip">v${e.version}</span>`:p}
          ${Fr(e.stats)}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn" @click=${()=>t.onDetail(n)}>
            Preview
          </button>
          <button class="btn primary" ?disabled=${a} @click=${()=>t.onImportAndPersonalize(n)}>
            ${a?"Importing...":"Import"}
          </button>
        </div>
      </div>
    </div>
  `}function C0(e,t){const n=t.importing===e.slug,s=E0(e.updatedAt);return o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.displayName}</div>
        <div class="list-sub">${qn(e.summary??"",120)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.slug}</span>
          ${e.latestVersion?o`<span class="chip">v${e.latestVersion.version}</span>`:p}
          ${Fr(e.stats)}
          <span class="chip">${s}</span>
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn" @click=${()=>t.onDetail(e.slug)}>
            Preview
          </button>
          <button class="btn primary" ?disabled=${n} @click=${()=>t.onImportAndPersonalize(e.slug)}>
            ${n?"Importing...":"Import"}
          </button>
        </div>
      </div>
    </div>
  `}function L0(e){const t=e.detail,n=e.detailSlug??"",s=e.importing===n;if(e.loading&&!t)return o`<div class="muted">Loading skill details...</div>`;if(!t||!t.skill)return o`
      <div>
        <button class="btn" @click=${e.onCloseDetail}>Back</button>
        <div class="muted" style="margin-top: 12px;">Skill not found.</div>
      </div>
    `;const a=t.moderation?.isMalwareBlocked??!1,i=t.moderation?.isSuspicious??!1;return o`
    <div>
      <button class="btn" @click=${e.onCloseDetail}>&larr; Back to browse</button>

      <div style="margin-top: 16px;">
        <div class="card-title">${t.skill.displayName}</div>
        <div class="card-sub" style="margin-top: 4px;">${n}</div>

        ${t.skill.summary?o`<div style="margin-top: 12px;">${t.skill.summary}</div>`:p}

        <div class="chip-row" style="margin-top: 12px;">
          ${t.latestVersion?o`<span class="chip">v${t.latestVersion.version}</span>`:p}
          ${t.owner?.handle?o`<span class="chip">by @${t.owner.handle}</span>`:t.owner?.displayName?o`<span class="chip">by ${t.owner.displayName}</span>`:p}
          ${Fr(t.skill.stats)}
          ${a?o`<span class="chip chip-warn" style="background: var(--danger-bg, #fde8e8); color: var(--danger-color, #d14343);">
                Blocked — malware
              </span>`:p}
          ${i&&!a?o`<span class="chip chip-warn">Suspicious — review before use</span>`:p}
        </div>

        ${t.latestVersion?.changelog?o`
            <div style="margin-top: 16px;">
              <div class="muted" style="font-weight: 600; margin-bottom: 4px;">Changelog</div>
              <div class="list-sub">${t.latestVersion.changelog}</div>
            </div>`:p}

        <div class="row" style="gap: 8px; margin-top: 20px;">
          ${a?o`<div class="callout danger">This skill is blocked and cannot be imported.</div>`:o`
                <button class="btn primary" ?disabled=${s} @click=${()=>e.onImportAndPersonalize(n)}>
                  ${s?"Importing...":"Import + Personalize"}
                </button>
                <button class="btn" ?disabled=${s} @click=${()=>e.onImport(n)}>
                  ${s?"Importing...":"Import Only"}
                </button>
              `}
        </div>
      </div>
    </div>
  `}function oi(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}k`:String(e)}function Fr(e){if(!e)return p;const t=[];return typeof e.stars=="number"&&e.stars>0&&t.push(o`<span class="chip" title="Stars">\u2605 ${oi(e.stars)}</span>`),typeof e.downloads=="number"&&e.downloads>0&&t.push(o`<span class="chip" title="Downloads">\u2193 ${oi(e.downloads)}</span>`),typeof e.installsCurrent=="number"&&e.installsCurrent>0&&t.push(o`<span class="chip" title="Active installs">\u2713 ${oi(e.installsCurrent)}</span>`),t}function E0(e){const t=Date.now()-e,n=Math.floor(t/1e3),s=Math.floor(n/60),a=Math.floor(s/60),i=Math.floor(a/24);return i>30?`${Math.floor(i/30)}mo ago`:i>0?`${i}d ago`:a>0?`${a}h ago`:s>0?`${s}m ago`:"just now"}function R0(e){return o`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="chip-row" style="gap: 0;">
          <button
            class="chip ${e.subTab==="my-skills"?"chip-ok":""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${e.subTab==="my-skills"?"--chip-ok-bg, #e6f4ea":"--chip-bg, #f3f3f3"});"
            @click=${()=>e.onSubTabChange("my-skills")}
          >
            My Skills
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
        ${e.subTab==="my-skills"?o`<button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
              ${e.loading?"Loading…":"Refresh"}
            </button>`:p}
      </div>

      ${e.subTab==="my-skills"?I0(e):p}
      ${e.subTab==="clawhub"?o`<div style="margin-top: 16px;">${A0(e.clawhub)}</div>`:p}
    </section>
  `}function I0(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(n)):t;return o`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${a=>e.onFilterChange(a.target.value)}
          placeholder="Search skills"
        />
      </label>
      <div class="muted">${s.length} shown</div>
    </div>

    ${e.error?o`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

    ${s.length===0?o`<div class="muted" style="margin-top: 16px">No skills found.</div>`:o`<div class="list" style="margin-top: 16px;">
            ${s.map(a=>P0(a,e))}
          </div>`}
  `}function P0(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",a=t.messages[e.skillKey]??null,i=e.install.length>0&&e.missing.bins.length>0,r=[...e.missing.bins.map(c=>`bin:${c}`),...e.missing.env.map(c=>`env:${c}`),...e.missing.config.map(c=>`config:${c}`),...e.missing.os.map(c=>`os:${c}`)],l=[];return e.disabled&&l.push("disabled"),e.blockedByAllowlist&&l.push("blocked by allowlist"),o`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${qn(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?o`
                  <span class="chip chip-warn">disabled</span>
                `:p}
        </div>
        ${r.length>0?o`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${r.join(", ")}
              </div>
            `:p}
        ${l.length>0?o`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${l.join(", ")}
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
          ${i?o`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:p}
        </div>
        ${a?o`<div
              class="muted"
              style="margin-top: 8px; color: ${a.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${a.message}
            </div>`:p}
        ${e.primaryEnv?o`
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
            `:p}
      </div>
    </div>
  `}function Xu(){return{open:!1,images:[],currentIndex:0}}function M0(e,t,n){return{open:!0,images:t,currentIndex:n}}function D0(){return Xu()}function O0(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const N0=o`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,B0=o`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,F0=o`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function U0(e,t){if(!e.open||e.images.length===0)return p;const n=e.images[e.currentIndex];if(!n)return p;const s=e.images.length>1,a=e.currentIndex>0,i=e.currentIndex<e.images.length-1;return o`
    <div
      class="lightbox-overlay"
      @click=${r=>{r.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${r=>{r.key==="Escape"&&t.onClose(),r.key==="ArrowRight"&&i&&t.onNav(1),r.key==="ArrowLeft"&&a&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${N0}
      </button>

      ${s&&a?o`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${B0}</button>`:p}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${r=>r.stopPropagation()}
        @error=${r=>{r.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&i?o`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${F0}</button>`:p}

      ${s?o`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:p}
    </div>
  `}const z0=e=>{switch(e){case"success":return o`
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
      `;case"error":return o`
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
      `;case"warning":return o`
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
      `;default:return o`
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
      `}};function K0({toasts:e,onDismiss:t}){return e.length===0?null:o`
    <div class="toast-container">
      ${fa(e,n=>n.id,n=>o`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${z0(n.type)}</div>
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
  `}const ec={launch:"🚀",milestone:"🎉",health:"💪",systems:"⚙️",default:"🎯"},W0={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"};function q0(e){const t=new Date(e),n=new Date,s=t.getFullYear()-n.getFullYear();return s<=0?"This year":s===1?"Next year":`${s} years`}function Ju(e){return`${Math.round(e*100)}%`}function H0(e){return ec[e]||ec.default}function j0(e){const t=e.progress*100;return o`
    <div class="vision-cda-section">
      <div class="vision-cda-label">CHIEF DEFINITE AIM</div>
      <blockquote class="vision-cda-statement">"${e.statement}"</blockquote>
      <div class="vision-cda-meta">
        <div class="vision-cda-deadline">
          <span class="meta-icon">📅</span>
          <span class="meta-value">${e.deadline}</span>
          <span class="meta-label">(${q0(e.deadline)})</span>
        </div>
        <div class="vision-cda-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${t}%"></div>
          </div>
          <span class="progress-label">${Ju(e.progress)} progress</span>
        </div>
      </div>
    </div>
  `}function V0(e){return e?o`
    <div class="vision-identity-section">
      <div class="vision-section-label">TODAY'S IDENTITY</div>
      <div class="vision-identity-card">
        <span class="identity-icon">💎</span>
        <blockquote class="identity-statement">"${e}"</blockquote>
      </div>
    </div>
  `:null}function G0(e){return!e||e.length===0?o`
      <div class="vision-themes-section">
        <div class="vision-section-label">2026 THEMES</div>
        <div class="vision-empty-state">No themes defined yet.</div>
      </div>
    `:o`
    <div class="vision-themes-section">
      <div class="vision-section-label">2026 THEMES</div>
      <div class="vision-themes-grid">
        ${e.map(t=>{const n=t.progress*100;return o`
            <div class="vision-theme-card">
              <div class="theme-card-header">
                <span class="theme-icon">${H0(t.id)}</span>
                <span class="theme-title">${t.theme}</span>
              </div>
              <p class="theme-description">${t.description}</p>
              <div class="theme-progress">
                <div class="progress-bar-container small">
                  <div class="progress-bar-fill" style="width: ${n}%"></div>
                </div>
                <span class="progress-label">${Ju(t.progress)}</span>
              </div>
              ${t.wheelSpokes&&t.wheelSpokes.length>0?o`
                    <div class="theme-spokes">
                      ${t.wheelSpokes.map(s=>o`
                          <span class="theme-spoke-badge">${W0[s]||s}</span>
                        `)}
                    </div>
                  `:null}
              ${t.keyResults&&t.keyResults.length>0?o`
                    <div class="theme-key-results">
                      ${t.keyResults.map(s=>(s.current!==null&&s.current/s.target*100,o`
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
  `}function Q0(e){return!e||e.length===0?null:o`
    <div class="vision-values-section">
      <div class="vision-section-label">VALUES HIERARCHY</div>
      <div class="vision-values-list">
        ${e.map((t,n)=>o`
            <div class="vision-value-item">
              <span class="value-rank">${n+1}</span>
              <span class="value-text">${t}</span>
            </div>
          `)}
      </div>
    </div>
  `}function Y0(e){return!e||e.length===0?null:o`
    <div class="vision-antigoals-section">
      <div class="vision-section-label">WHAT I'M NOT CHASING</div>
      <div class="vision-antigoals-list">
        ${e.map(t=>o`
            <div class="vision-antigoal-item">
              <span class="antigoal-icon">🚫</span>
              <span class="antigoal-text">${t}</span>
            </div>
          `)}
      </div>
    </div>
  `}function tc(e){if(e.loading)return o`
      <div class="vision-container">
        <div class="vision-loading">
          <div class="spinner"></div>
          <span>Loading Vision Board...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="vision-container">
        <div class="vision-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;if(!e.data)return o`
      <div class="vision-container">
        <div class="vision-empty">
          <span class="empty-icon">⭐</span>
          <span>No vision board yet. Define your Chief Definite Aim!</span>
          ${e.onRefresh?o`<button class="primary-button" @click=${e.onRefresh}>Load Data</button>`:null}
        </div>
      </div>
    `;const{data:t,identityToday:n}=e;return o`
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
          ${e.onUpdateViaChat?o`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:null}
          ${e.onRefresh?o`<button class="vision-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:null}
        </div>
      </div>

      <!-- Chief Definite Aim -->
      ${j0(t.chiefDefiniteAim)}

      <!-- Today's Identity (rotated daily) -->
      ${V0(n)}

      <!-- Annual Themes -->
      ${G0(t.annualThemes)}

      <!-- Two-column layout for Values and Anti-Goals -->
      <div class="vision-bottom-grid">
        ${Q0(t.values)} ${Y0(t.antiGoals)}
      </div>
    </div>
  `}const rt=["health","wealth","career","relationships","fun","environment","growth","contribution"],_s={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"},Zu={health:"💪",wealth:"💰",career:"🚀",relationships:"❤️",fun:"🎉",environment:"🏠",growth:"📚",contribution:"🤝"};function X0(e){return new Date(e).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}function J0(e){switch(e){case"up":return"↑";case"down":return"↓";case"stable":return"→"}}function Z0(e){switch(e){case"up":return"trend-up";case"down":return"trend-down";case"stable":return"trend-stable"}}function eS(e){return e<=4?"score-low":e<=6?"score-medium":"score-high"}function tS(e){const a=2*Math.PI/rt.length,i=rt.map((l,c)=>{const u=c*a-Math.PI/2,h=(e[l]?.current??5)/10,f=150+Math.cos(u)*120*h,m=150+Math.sin(u)*120*h;return`${f},${m}`}).join(" "),r=rt.map((l,c)=>{const u=c*a-Math.PI/2,h=(e[l]?.target??8)/10,f=150+Math.cos(u)*120*h,m=150+Math.sin(u)*120*h;return`${f},${m}`}).join(" ");return o`
    <div class="wheel-chart-container">
      <svg viewBox="0 0 300 300" class="wheel-chart">
        <!-- Grid circles -->
        ${[2,4,6,8,10].map(l=>ds`
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
        ${rt.map((l,c)=>{const u=c*a-Math.PI/2,h=150+Math.cos(u)*120,f=150+Math.sin(u)*120;return ds`
            <line
              x1="${150}"
              y1="${150}"
              x2="${h}"
              y2="${f}"
              stroke="var(--border)"
              stroke-opacity="0.5"
            />
          `})}

        <!-- Target polygon (dashed) -->
        <polygon
          points="${r}"
          fill="none"
          stroke="var(--text-muted)"
          stroke-width="1.5"
          stroke-dasharray="4,4"
          stroke-opacity="0.5"
        />

        <!-- Current scores polygon -->
        <polygon
          points="${i}"
          fill="var(--accent)"
          fill-opacity="0.25"
          stroke="var(--accent)"
          stroke-width="2.5"
        />

        <!-- Score dots -->
        ${rt.map((l,c)=>{const u=c*a-Math.PI/2,h=(e[l]?.current??5)/10,f=150+Math.cos(u)*120*h,m=150+Math.sin(u)*120*h;return ds`
            <circle
              cx="${f}"
              cy="${m}"
              r="5"
              fill="var(--accent)"
              stroke="var(--bg)"
              stroke-width="2"
            />
          `})}

        <!-- Spoke labels -->
        ${rt.map((l,c)=>{const u=c*a-Math.PI/2,h=145,f=150+Math.cos(u)*h,m=150+Math.sin(u)*h,g=e[l]?.current??5;return ds`
            <text
              x="${f}"
              y="${m}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="var(--text)"
              font-size="11"
              font-weight="500"
            >
              ${Zu[l]} ${g}
            </text>
          `})}
      </svg>
    </div>
  `}function nS(e,t,n){return o`
    <div class="wheel-spokes-grid">
      ${rt.map(s=>{const a=e[s];if(!a)return null;const r=n[s]?.current??a.current,l=a.target-r;return o`
          <div class="wheel-spoke-card ${eS(r)}">
            <div class="spoke-card-header">
              <span class="spoke-icon">${Zu[s]}</span>
              <span class="spoke-name">${_s[s]}</span>
              <span class="spoke-trend ${Z0(a.trend)}">
                ${J0(a.trend)}
              </span>
            </div>
            <div class="spoke-card-body">
              ${t?o`
                    <div class="spoke-edit-row">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        .value="${String(r)}"
                        class="spoke-slider"
                        data-spoke="${s}"
                      />
                      <span class="spoke-value-display">${r}</span>
                    </div>
                  `:o`
                    <div class="spoke-scores">
                      <div class="spoke-current">
                        <span class="spoke-score-value">${a.current}</span>
                        <span class="spoke-score-label">current</span>
                      </div>
                      <div class="spoke-target">
                        <span class="spoke-score-value">${a.target}</span>
                        <span class="spoke-score-label">target</span>
                      </div>
                      ${l>0?o`
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
  `}function nc(e){if(e.loading)return o`
      <div class="wheel-container">
        <div class="wheel-loading">
          <div class="spinner"></div>
          <span>Loading Wheel of Life...</span>
        </div>
      </div>
    `;if(e.error)return o`
      <div class="wheel-container">
        <div class="wheel-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?o`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;if(!e.data)return o`
      <div class="wheel-container">
        <div class="wheel-empty">
          <span class="empty-icon">🎯</span>
          <span>No wheel data yet. Start tracking your life balance!</span>
          ${e.onRefresh?o`<button class="primary-button" @click=${e.onRefresh}>Load Data</button>`:null}
        </div>
      </div>
    `;const{data:t,editMode:n=!1}=e,s={},a=rt.filter(i=>(t.scores[i]?.current??5)<=4);return o`
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
            <span class="summary-value">${a.length}</span>
            <span class="summary-label">Alerts</span>
          </div>
          <div class="wheel-summary-divider"></div>
          <div class="wheel-status ${e.connected?"online":"offline"}">
            <span class="status-indicator status-${e.connected?"working":"idle"}"></span>
            <span class="status-label">${e.connected?"ONLINE":"OFFLINE"}</span>
          </div>
          ${e.onUpdateViaChat&&!n?o`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:null}
          ${e.onRefresh&&!n?o`<button class="wheel-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:null}
          ${e.onEdit&&!n?o`<button class="wheel-edit-btn" @click=${e.onEdit} title="Edit scores">
                ✏️ Update
              </button>`:null}
          ${n&&e.onSave&&e.onCancel?o`
                <button class="wheel-save-btn" @click=${()=>e.onSave(s)}>
                  💾 Save
                </button>
                <button class="wheel-cancel-btn" @click=${e.onCancel}>Cancel</button>
              `:null}
        </div>
      </div>

      <!-- Date badge -->
      <div class="wheel-date-badge">As of ${X0(t.asOf)}</div>

      <!-- Alerts -->
      ${a.length>0?o`
            <div class="wheel-alerts">
              <div class="wheel-alert warning">
                <span class="alert-icon">⚠️</span>
                <span class="alert-text">
                  <strong>Attention needed:</strong>
                  ${a.map(i=>_s[i]).join(", ")}
                  ${a.length===1?"is":"are"} below 5
                </span>
              </div>
            </div>
          `:null}

      <!-- Main content grid -->
      <div class="wheel-content">
        <!-- Radar chart -->
        <div class="wheel-chart-section">${tS(t.scores)}</div>

        <!-- Spoke cards -->
        <div class="wheel-spokes-section">
          ${nS(t.scores,n,s)}
        </div>
      </div>

      <!-- Insights -->
      <div class="wheel-insights">
        <div class="wheel-insight">
          <span class="insight-icon">📉</span>
          <span class="insight-label">Lowest</span>
          <span class="insight-value">${_s[t.lowestSpoke]??"—"}</span>
        </div>
        <div class="wheel-insight">
          <span class="insight-icon">🎯</span>
          <span class="insight-label">Biggest Gap</span>
          <span class="insight-value">${_s[t.biggestGap]??"—"}</span>
        </div>
      </div>
    </div>
  `}const sc=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function sS(e,t){return o`
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
  `}function aS(e,t,n){const a=!!(t?.[e.key]??e.default);return o`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${sS(a,()=>n(e.key,!a))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function iS(e){const{connected:t,loading:n,options:s,onToggle:a,onOpenWizard:i}=e;return t?n&&!s?o`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:o`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${sc.map(r=>aS(r,s,a))}
      </div>
      ${sc.length===0?o`<div class="options-empty">
            No configurable features yet.
          </div>`:p}
      ${i?o`
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
          `:p}
    </section>
  `:o`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const ac=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],rS=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],oS=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],li=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],ic=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function rc(e){const n=Math.min(Number(e),8);return o`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,a)=>o`
          <div class="wizard-progress-dot ${a<n?"completed":""} ${a===n?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${n<8?`Step ${n+1} of 8`:"Review"}
      </div>
    </div>
  `}function lS(e){if(e>=ic.length)return o`${p}`;const t=ic[e];return o`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function cS(e,t,n,s){return o`
    <div class="wizard-nav">
      ${e>0?o`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${()=>t.onStepChange(e-1)}
            >Back</button>
          `:o`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${n?"":"wizard-btn--disabled"}"
        ?disabled=${!n}
        @click=${()=>{s?(t.onStepChange(8),t.onPreview()):t.onStepChange(e+1)}}
      >${s?"Review":"Continue"}</button>
    </div>
  `}function ep(){return o`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function dS(e,t){function n(a){const i=a.target.value;t.onAnswerChange("name",i)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(1))}return o`
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
  `}function uS(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return o`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${ac.includes(n)?p:o`<option value="${n}">${n} (detected)</option>`}
        ${ac.map(s=>o`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${ep()}
    </div>
  `}function pS(e,t){function n(a){t.onAnswerChange("focus",a.target.value)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(3))}return o`
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
  `}function hS(e,t){function n(){const i=document.querySelector(".wizard-project-input");if(!i)return;const r=i.value.trim();r&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,r]),i.value="",i.focus())}function s(i){const r=e.projects.filter((l,c)=>c!==i);t.onAnswerChange("projects",r)}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return o`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((i,r)=>o`
            <span class="wizard-tag">
              ${i}
              <button class="wizard-tag-remove" @click=${()=>s(r)}>x</button>
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
      ${e.projects.length===0?o`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:p}
    </div>
  `}function fS(e,t){return o`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${rS.map(n=>o`
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
  `}function gS(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(r){n.includes(r)?t.onAnswerChange("hardRules",n.filter(l=>l!==r)):t.onAnswerChange("hardRules",[...n,r])}function a(){const r=document.querySelector(".wizard-rule-input");if(!r)return;const l=r.value.trim();l&&(t.onAnswerChange("hardRules",[...n,l]),r.value="",r.focus())}function i(r){r.key==="Enter"&&(r.preventDefault(),r.target.value.trim()&&a())}return o`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${li.map(r=>o`
            <label class="wizard-checkbox ${n.includes(r)?"wizard-checkbox--selected":""}">
              <input
                type="checkbox"
                ?checked=${n.includes(r)}
                @change=${()=>s(r)}
              />
              <span class="wizard-checkbox-label">${r}</span>
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
      ${n.filter(r=>!li.includes(r)).length>0?o`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(r=>!li.includes(r)).map(r=>o`
                    <span class="wizard-tag">
                      ${r}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(l=>l!==r))}}>x</button>
                    </span>
                  `)}
            </div>
          `:p}
    </div>
  `}function mS(e,t){function n(){const i=document.querySelector(".wizard-person-input");if(!i)return;const r=i.value.trim();r&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,r]),i.value="",i.focus())}function s(i){t.onAnswerChange("keyPeople",e.keyPeople.filter((r,l)=>l!==i))}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return o`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((i,r)=>o`
            <span class="wizard-tag">
              ${i}
              <button class="wizard-tag-remove" @click=${()=>s(r)}>x</button>
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
  `}function vS(e,t){return o`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${oS.map(n=>o`
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
      ${ep()}
    </div>
  `}function yS(e,t){const{answers:n,preview:s,generating:a}=e;return o`
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

        ${n.projects.length>0?o`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${n.projects.map(i=>o`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:p}

        ${n.keyPeople.length>0?o`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(i=>o`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:p}

        ${n.hardRules.length>0?o`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(i=>o`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:p}
      </div>

      ${s&&s.length>0?o`
            <div class="wizard-review-section wizard-review-files">
              <h3>Files to Generate</h3>
              <div class="wizard-file-list">
                ${s.map(i=>o`
                    <div class="wizard-file-item ${i.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <span class="wizard-file-icon">${i.wouldCreate?"+":"-"}</span>
                      <span class="wizard-file-path">${i.path}</span>
                      <span class="wizard-file-status">${i.wouldCreate?"will create":"exists (skip)"}</span>
                    </div>
                  `)}
              </div>
              <p class="wizard-hint">Plus: OC config will be patched with optimal memory/agent settings.</p>
            </div>
          `:p}

      <div class="wizard-nav">
        <button
          class="wizard-btn wizard-btn--back"
          @click=${()=>t.onStepChange(7)}
          ?disabled=${a}
        >Back</button>
        <button
          class="wizard-btn wizard-btn--generate ${a?"wizard-btn--loading":""}"
          @click=${()=>t.onGenerate()}
          ?disabled=${a}
        >${a?"Generating...":"Generate Workspace"}</button>
      </div>

      ${e.error?o`<div class="wizard-error">${e.error}</div>`:p}
    </div>
  `}function bS(e,t){const n=e.result;return n?o`
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
  `:o`${p}`}function tp(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function wS(){return{step:0,answers:tp(),preview:null,generating:!1,result:null,error:null}}function np(e,t){const{step:n,answers:s}=e;if(n===9)return o`
      <div class="wizard-fullscreen">
        ${bS(e,t)}
      </div>
    `;if(n===8)return o`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${rc(n)}
          ${yS(e,t)}
        </div>
      </div>
    `;const a=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),i=n===7,r=(()=>{switch(n){case 0:return dS(s,t);case 1:return uS(s,t);case 2:return pS(s,t);case 3:return hS(s,t);case 4:return fS(s,t);case 5:return gS(s,t);case 6:return mS(s,t);case 7:return vS(s,t);default:return o`${p}`}})();return o`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${rc(n)}
        ${lS(n)}
        ${r}
        ${cS(n,t,a,i)}
      </div>
    </div>
  `}const kS=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:tp,emptyWizardState:wS,renderOnboardingWizard:np},Symbol.toStringTag,{value:"Module"}));function hn(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function ts(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function $S(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function SS(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function AS(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function TS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function xS(e){const t=e.overallScore,n=hn(t);return o`
    <div class="trust-overall">
      <div class="trust-overall-score ${ts(n)}">
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
  `}function _S(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),a=hn(e??(t>0?t:null));return o`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${ts(a)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function CS(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",a=hn(e.trustScore??(e.avgRating>0?e.avgRating:null)),i=e.count<10?10-e.count:0;return o`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?o`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:p}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${ts(a)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${SS(e.trend)}">
          ${AS(e.trend)} ${$S(e.trend)}
        </span>
      </div>

      ${_S(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${i>0?o`<span class="trust-card-pending">${i} more until trust score</span>`:p}
        ${e.needsFeedback?o`<span class="trust-card-needs-feedback">Needs improvement</span>`:p}
      </div>

      ${e.recentFeedback.length>0?o`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(r=>o`<span class="trust-card-feedback-item">${r}</span>`)}
            </div>
          `:p}
    </div>
  `}function LS(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function ES(){const e=LS();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function RS(e){const t=hn(e.rating);return o`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${ts(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?o`<span class="trust-rating-note">${e.note}</span>`:p}
      <span class="trust-rating-time">${TS(e.timestamp)}</span>
    </div>
  `}function IS(){return o`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function PS(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,a=e.data?.todayRating??null,i=e.updateStatus??null,r=i?.openclawUpdateAvailable||i?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(r){const c=[];return i.openclawUpdateAvailable&&i.openclawLatest&&c.push(`OpenClaw ${i.openclawVersion} → ${i.openclawLatest}`),i.pluginUpdateAvailable&&i.pluginLatest&&c.push(`GodMode ${i.pluginVersion} → ${i.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:c.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const c=n.gates.filter(h=>h.enabled).length,u=n.gates.length;if(c<u)return{level:"warn",icon:"🛡",text:`${u-c} security gate${u-c!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const l=i&&!r?" Up to date.":"";return a?a.rating>=8?{level:"ok",icon:"✨",text:`Rated ${a.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${l}`}:a.rating>=5?{level:"ok",icon:"💪",text:`Rated ${a.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${l}`}:{level:"warn",icon:"💬",text:`Rated ${a.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${l}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${l} Rate your day below to help improve.`}}function MS(e){const{level:t,icon:n,text:s,detail:a}=PS(e);return o`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${a}</div>
      </div>
    </div>
  `}function DS(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function oc(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return o`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return o`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),a=hn(n.rating);return o`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${a==="none"?"medium":a}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function OS(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],a=t?.dailyStreak??0,i=t?.dailyAverage??null;if(!e.onDailyRate)return p;if(n){const r=hn(n.rating),l=n.rating<7&&!n.note;return o`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${a>1?o`<span class="trust-daily-streak">${a} day streak</span>`:p}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${ts(r)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?o`<span class="trust-daily-result-note">"${n.note}"</span>`:p}
            ${i!==null?o`<span class="trust-daily-result-note">7-day avg: ${i}/10</span>`:p}
          </div>
          ${s.length>1?oc(s):p}
        </div>
        ${l?o`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${c=>{if(c.key==="Enter"){const u=c.target,h=u.value.trim();h&&e.onDailyRate&&(e.onDailyRate(n.rating,h),u.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${c=>{const h=c.target.previousElementSibling,f=h?.value?.trim();f&&e.onDailyRate&&(e.onDailyRate(n.rating,f),h.value="")}}
                >Send</button>
              </div>
            `:p}
      </div>
    `}return o`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${a>0?o`<span class="trust-daily-streak">${a} day streak</span>`:p}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(r=>o`
            <button
              class="trust-daily-button ${DS(r)}"
              type="button"
              title="${r}/10"
              @click=${()=>e.onDailyRate(r)}
            >${r}</button>
          `)}
      </div>
      ${s.length>0?o`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${oc(s)}
              ${i!==null?o`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${i}/10</span>`:p}
            </div>
          `:p}
    </div>
  `}function NS(e){if(!e)return o`
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
    `;const t=e.gates,n=t.filter(h=>h.enabled).length,s=t.length,a=n===s,i=Date.now()-864e5,r=e.activity.filter(h=>Date.parse(h.timestamp)>i),l=r.filter(h=>h.action==="blocked").length,c=r.filter(h=>h.action==="fired").length,u=a?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return o`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${u}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(h=>o`
            <div class="trust-health-gate ${h.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${h.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${h.icon}</span>
              <span class="trust-health-gate-name">${h.name}</span>
            </div>
          `)}
      </div>

      ${r.length>0?o`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${r.length}</span>
              event${r.length!==1?"s":""} in last 24h
              ${l>0?o` &middot; <span class="trust-health-activity-count">${l}</span> blocked`:p}
              ${c>0?o` &middot; <span class="trust-health-activity-count">${c}</span> fired`:p}
            </div>
          `:o`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function BS(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function FS(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function US(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,a=e.gatewayUptimeMs,l=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return o`
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
        <span class="trust-health-dot ${FS(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${BS(n)}</span>
      </div>

      ${s!=null?o`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:p}

      ${a!=null?o`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${qi(a)}</span>
            </div>
          `:p}
    </div>
  `}function zS(e){return o`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${NS(e.guardrailsData)}
        ${US(e)}
      </div>
    </div>
  `}function KS(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:a,onRefresh:i}=e;if(!t)return o`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return o`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const l=!(s?.summaries??[]).some(f=>f.count>0),c=l?ES():s,u=c.summaries,h=l?[]:s?.ratings??[];return o`
    <section class="tab-body trust-section">
      ${MS(e)}

      ${l?IS():p}

      ${OS(e)}

      ${xS(c)}

      <div class="trust-workflows-grid">
        ${u.map(f=>CS(f,l?null:a))}
      </div>

      ${zS(e)}

      ${h.length>0?o`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${h.slice(0,20).map(RS)}
              </div>
            </div>
          `:p}
    </section>
  `}function WS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function qS(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function sp(e,t){return o`
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
  `}function HS(e,t,n,s){const a=e.thresholds?.[t]??0;return o`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${n}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(a)}
        ?disabled=${!e.enabled}
        @change=${i=>{const r=Number(i.target.value);!Number.isNaN(r)&&r>0&&s(e.id,t,r)}}
      />
    </div>
  `}function jS(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return o`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${sp(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?o`
            <div class="guardrails-thresholds">
              ${s.map(a=>HS(e,a,e.thresholdLabels[a],n))}
            </div>
          `:p}
    </div>
  `}function VS(e,t,n){const s=e.action==="redirect"?"↪":"🚫",a=e.action==="redirect"?"redirect":"block";return o`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${a}">${a}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${sp(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(i=>o`<span class="guardrails-pattern-tag">${i}</span>`)}
      </div>
    </div>
  `}function GS(e,t){return o`
    <div class="guardrails-add-form card">
      <h4 class="guardrails-add-form-title">New Custom Rule</h4>
      <div class="guardrails-add-form-fields">
        <div class="guardrails-add-form-row">
          <label>Name</label>
          <input type="text" class="guardrails-add-input" id="gr-add-name" placeholder="e.g. Block npm audit" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Tool to match</label>
          <input type="text" class="guardrails-add-input" id="gr-add-tool" placeholder="e.g. Bash, web_fetch" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Patterns (comma-separated)</label>
          <input type="text" class="guardrails-add-input" id="gr-add-patterns" placeholder="e.g. npm audit, npx audit" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Action</label>
          <select class="guardrails-add-input" id="gr-add-action">
            <option value="block">Block</option>
            <option value="redirect">Redirect</option>
          </select>
        </div>
        <div class="guardrails-add-form-row">
          <label>Message / instruction</label>
          <textarea class="guardrails-add-input guardrails-add-textarea" id="gr-add-message" placeholder="What should the agent do instead?" rows="2"></textarea>
        </div>
      </div>
      <div class="guardrails-add-form-actions">
        <button class="guardrails-add-cancel" @click=${t}>Cancel</button>
        <button class="guardrails-add-submit" @click=${()=>{const n=document.querySelector("godmode-app")?.shadowRoot;if(!n)return;const s=n.querySelector("#gr-add-name")?.value.trim(),a=n.querySelector("#gr-add-tool")?.value.trim(),i=n.querySelector("#gr-add-patterns")?.value.trim(),r=n.querySelector("#gr-add-action")?.value,l=n.querySelector("#gr-add-message")?.value.trim();if(!s||!a||!i||!l)return;const c=i.split(",").map(u=>u.trim()).filter(Boolean);c.length!==0&&e({name:s,tool:a,patterns:c,action:r,message:l})}}>Create Rule</button>
      </div>
    </div>
  `}function QS(e){return o`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${qS(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${WS(e.timestamp)}</span>
    </div>
  `}function YS(e){const{connected:t,loading:n,data:s,showAddForm:a,onToggle:i,onThresholdChange:r,onCustomToggle:l,onCustomDelete:c,onCustomAdd:u,onToggleAddForm:h}=e;if(!t)return o`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return o`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const f=s?.gates??[],m=s?.activity??[],g=s?.custom??[],w=f.filter(_=>_.enabled).length,S=g.filter(_=>_.enabled).length,T=[`${w}/${f.length} gates active`];return g.length>0&&T.push(`${S} custom rule${g.length===1?"":"s"}`),o`
    <section class="tab-body guardrails-section">
      <div class="guardrails-summary">
        <span class="guardrails-summary-count">${w}/${f.length}</span>
        <span class="guardrails-summary-label">gates active</span>
        ${g.length>0?o`
              <span class="guardrails-summary-sep">&middot;</span>
              <span class="guardrails-summary-count guardrails-summary-count--custom">${S}</span>
              <span class="guardrails-summary-label">custom rule${g.length===1?"":"s"}</span>
            `:p}
      </div>

      <div class="guardrails-grid">
        ${f.map(_=>jS(_,i,r))}
      </div>

      <!-- Custom Rules Section -->
      <div class="guardrails-custom-section">
        <div class="guardrails-custom-header">
          <h3 class="guardrails-custom-title">Custom Rules</h3>
          <button class="guardrails-add-btn" @click=${h}>
            ${a?"Cancel":"+ Add Rule"}
          </button>
        </div>

        ${a?GS(u,h):p}

        ${g.length>0?o`
              <div class="guardrails-custom-grid">
                ${g.map(_=>VS(_,l,c))}
              </div>
            `:o`
              <div class="guardrails-custom-empty">
                No custom rules yet. Click "+ Add Rule" or tell your agent "never do X" to create one.
              </div>
            `}
      </div>

      ${m.length>0?o`
            <div class="guardrails-history">
              <h3 class="guardrails-history-title">Recent Activity</h3>
              <div class="guardrails-history-list">
                ${m.slice(0,30).map(QS)}
              </div>
            </div>
          `:o`
            <div class="guardrails-history">
              <div class="guardrails-no-activity">No gate activity recorded yet.</div>
            </div>
          `}
    </section>
  `}const XS={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};function JS(e){const t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function ZS(e){switch(e){case"started":return"▶️";case"completed":return"✅";case"failed":return"❌";case"queued":return"⏳";case"stage":return"🔄";default:return"📋"}}function e1(e){switch(e){case"coding":return"mc-type-badge mc-type-badge--coding";case"subagent":return"mc-type-badge mc-type-badge--subagent";case"swarm":return"mc-type-badge mc-type-badge--swarm";case"queue":return"mc-type-badge mc-type-badge--queue";default:return"mc-type-badge"}}function t1(e){return`mc-agent-card mc-agent-card--${e}`}function n1(e){return o`
    <div class="mc-stats-banner">
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${e.activeNow}
          ${e.activeNow>0?o`<span class="mc-active-dot"></span>`:p}
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
          ${e.queueReview>0?o`<span class="mc-active-dot" style="background:#14b8a6"></span>`:p}
        </div>
        <div class="mc-stat-label">Queue${e.queueReview>0?` (${e.queueReview} review)`:""}</div>
      </div>
    </div>
  `}function s1(e){return e.swarmStages?o`
    <div class="mc-pipeline">
      ${["design","build","qc"].map((n,s)=>{const i=e.swarmStages?.[n]?.status??"pending";return o`
          ${s>0?o`<span class="mc-pipeline-arrow">\u2192</span>`:p}
          <span class="mc-pipeline-stage mc-pipeline-stage--${i}">
            ${n}
          </span>
        `})}
    </div>
  `:p}function ap(e,t){const n=e.startedAt?Hd(e.startedAt,e.endedAt??void 0):null,s=e.childSessionKey&&t.onOpenSession?o`<button class="mc-open-session-btn" @click=${()=>t.onOpenSession(e.childSessionKey)}>Open</button>`:e.sourceTaskId&&t.onOpenTaskSession?o`<button class="mc-open-session-btn" @click=${()=>t.onOpenTaskSession(e.sourceTaskId)}>Open Task</button>`:p;return o`
    <div class="${t1(e.status)}">
      <div class="mc-agent-card-header">
        <div class="mc-agent-card-info">
          <span class="${e1(e.type)}">${e.roleName}</span>
          <span class="mc-agent-card-task">${e.task}</span>
        </div>
        ${s}
        ${e.canCancel?o`<button class="mc-cancel-btn" @click=${()=>t.onCancel(e.id)}>Cancel</button>`:p}
        ${e.prUrl?o`<button class="mc-pr-btn" @click=${()=>t.onViewDetail(e)}>View PR</button>`:p}
      </div>
      <div class="mc-agent-card-meta">
        ${n?o`<span class="mc-agent-card-duration">${n}</span>`:p}
        ${e.model?o`<span class="mc-agent-card-model">${e.model}</span>`:p}
        ${e.branch?o`<span class="mc-agent-card-model">${e.branch}</span>`:p}
        ${e.error&&e.status!=="failed"?o`<span style="color: var(--danger, #ef4444)">${e.error}</span>`:p}
      </div>
      ${e.type==="swarm"?s1(e):p}
      ${e.status==="failed"?o`
        <div class="mc-agent-card-actions">
          <button class="mc-detail-btn" @click=${()=>t.onViewDetail(e)}>View Error</button>
          <button class="mc-retry-btn" @click=${()=>t.onRetry(e.id)}>Retry</button>
        </div>
      `:p}
    </div>
  `}function a1(e,t){const n=e.filter(s=>s.status==="active"||s.status==="queued");return n.length===0?o`
      <div class="mc-empty">
        No active agents
        <div class="mc-empty-hint">Your agents will appear here. Drop tasks into the queue or ask your ally to spawn agents.</div>
      </div>
    `:o`
    <div class="mc-agents-grid">
      ${n.map(s=>ap(s,t))}
    </div>
  `}function i1(e,t,n,s){const a=e.filter(i=>i.isReview===!0);return a.length===0?p:o`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Ready for Review</h3>
      <div class="mc-agents-grid">
        ${a.map(i=>o`
          <div class="mc-agent-card mc-agent-card--review">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${i.roleName}</span>
                <span class="mc-agent-card-task">${i.task}</span>
              </div>
              ${i.sourceTaskId&&s?o`<button class="mc-open-session-btn" @click=${()=>s(i.sourceTaskId)}>Open Session</button>`:p}
              <button class="mc-approve-btn" @click=${()=>t(i.id)}>Done</button>
              <button class="mc-detail-btn" @click=${()=>n(i)}>View Output</button>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function r1(e,t){const n=e.filter(s=>s.status==="pending");return n.length===0?p:o`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Queued (${n.length})</h3>
      <div class="mc-agents-grid">
        ${n.map(s=>o`
          <div class="mc-agent-card mc-agent-card--queued">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${XS[s.type]??s.type}</span>
                <span class="mc-agent-card-task">${s.title}</span>
              </div>
              ${t?o`<button class="mc-open-session-btn" @click=${()=>t(s.id)}>Start</button>`:p}
              <span class="mc-priority-badge mc-priority-badge--${s.priority}">${s.priority}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function o1(e,t){const n=(e.type==="failed"||e.type==="completed")&&e.agentRef;return o`
    <div class="mc-feed-item ${n?"mc-feed-item--clickable":""}"
         @click=${n?()=>t?.(e.agentRef):p}>
      <span class="mc-feed-time">${JS(e.timestamp)}</span>
      <span class="mc-feed-icon">${ZS(e.type)}</span>
      <span class="mc-feed-text">${e.summary}</span>
      ${e.prUrl&&!n?o`<a class="mc-feed-link" href="${e.prUrl}" target="_blank">View PR</a>`:p}
    </div>
  `}function l1(e,t,n){if(e.length===0)return p;const s=e.slice(0,20),a=e.length>20;return o`
    <div class="mc-feed">
      <h3 class="mc-section-title">Activity Feed</h3>
      <div class="mc-feed-list">
        ${s.map(i=>o1(i,n))}
      </div>
      ${a?o`<button class="mc-show-more-btn" @click=${()=>{}}>Show all ${e.length} events</button>`:p}
    </div>
  `}function c1(e,t){const s=e.filter(i=>i.status==="done"||i.status==="failed").filter(i=>!i.isReview);if(s.length===0)return p;const a=s.slice(0,10);return o`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Recent Completed</h3>
      <div class="mc-agents-grid">
        ${a.map(i=>ap(i,t))}
      </div>
    </div>
  `}function d1(e){if(!e.connected)return o`<div class="mc-section"><div class="mc-empty">Not connected to gateway.</div></div>`;if(e.loading&&!e.data)return o`<div class="mc-section"><div class="mc-loading">Loading agent data...</div></div>`;if(e.error&&!e.data)return o`
      <div class="mc-section">
        <div class="mc-empty" style="color: var(--danger, #ef4444)">
          ${e.error}
          <div class="mc-empty-hint">
            <button class="mc-show-more-btn" @click=${e.onRefresh}>Retry</button>
          </div>
        </div>
      </div>
    `;const t=e.data;if(!t)return o`<div class="mc-section"><div class="mc-empty">No data available.</div></div>`;const n={onCancel:e.onCancelTask,onViewDetail:e.onViewDetail,onRetry:e.onRetryItem,onOpenSession:e.onOpenSession,onOpenTaskSession:e.onOpenTaskSession};return o`
    <div class="mc-section">
      ${n1(t.stats)}

      <div class="mc-two-col">
        <div class="mc-col-main">
          <h3 class="mc-section-title">Active Agents</h3>
          ${a1(t.agents,n)}

          ${i1(t.agents,e.onApproveItem,e.onViewDetail,e.onOpenTaskSession)}

          ${r1(t.queueItems,e.onStartQueueItem)}

          ${l1(t.activityFeed,!1,e.onViewDetail)}
        </div>

        <div class="mc-col-side">
          ${c1(t.agents,n)}
        </div>
      </div>
    </div>
  `}function u1(e,t){if(e?.label)return e.label;if(e?.displayName)return e.displayName;const n=Te.get(t);if(n)return n;if(t.includes("webchat")){const a=t.match(/webchat[:-](\d+)/);return a?`Chat ${a[1]}`:"Chat"}if(t.includes("main"))return"MAIN";const s=t.split(/[:-]/);return s[s.length-1]||t}function p1(e){return e?e>=1e3?`${(e/1e3).toFixed(1)}k`:String(e):"0"}function h1(e){const t=e,n=String(t.role??"");if(n!=="user"&&n!=="assistant")return p;const s=typeof t.content=="string"?t.content:Array.isArray(t.content)?t.content.filter(i=>i.type==="text").map(i=>String(i.text??"")).join(" "):"";if(!s.trim())return p;const a=s.slice(0,300);return o`
    <div class="parallel-col__msg parallel-col__msg--${n}">
      <span class="parallel-col__msg-role">${n==="user"?"You":"AI"}</span>
      <span class="parallel-col__msg-text">${a}${s.length>300?"...":""}</span>
    </div>
  `}function f1(e){return o`
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
  `}function g1(e,t,n){const{state:s,onAssignLane:a,onSendInLane:i}=n,r=s.sessionsResult?.sessions??[],l=Ie(r,t),c=l?.key??t,u=s.workingSessions.has(t)||s.workingSessions.has(c),h=u1(l,t),f=Ns.get(t)??Ns.get(c),m=l?.model??"",g=l?.totalTokens??0,w=s.settings.tabLastViewed[c]??s.settings.tabLastViewed[t]??0,S=l?.updatedAt??0,T=!u&&S>w,d=t===s.sessionKey?s.chatMessages:Ke.get(t)??Ke.get(c)??[],$=A=>{A instanceof HTMLElement&&A.dispatchEvent(new CustomEvent("lane-viewed",{detail:{sessionKey:c},bubbles:!0,composed:!0}))};return o`
    <div
      class="parallel-col parallel-col--filled ${u?"parallel-col--working":""} ${T?"parallel-col--ready":""}"
      @pointerdown=${A=>$(A.currentTarget)}
      @focusin=${A=>$(A.currentTarget)}
      @dragover=${A=>{A.preventDefault(),A.dataTransfer&&(A.dataTransfer.dropEffect="move"),A.currentTarget.classList.add("parallel-col--dragover")}}
      @dragleave=${A=>{A.currentTarget.classList.remove("parallel-col--dragover")}}
      @drop=${A=>{A.preventDefault(),A.currentTarget.classList.remove("parallel-col--dragover");const x=A.dataTransfer?.getData("text/lane-index");if(x!=null&&x!==""){const E=Number.parseInt(x,10);if(!Number.isNaN(E)){A.currentTarget.dispatchEvent(new CustomEvent("lane-reorder",{detail:{fromIndex:E,toIndex:e},bubbles:!0,composed:!0}));return}}const L=A.dataTransfer?.getData("text/session-key");L&&A.currentTarget.dispatchEvent(new CustomEvent("lane-drop",{detail:{laneIndex:e,sessionKey:L},bubbles:!0,composed:!0}))}}
      data-lane-index="${e}"
    >
      <!-- Header -->
      <div
        class="parallel-col__header"
        draggable="true"
        @dragstart=${A=>{A.dataTransfer&&(A.dataTransfer.effectAllowed="move",A.dataTransfer.setData("text/lane-index",String(e)),A.currentTarget.classList.add("parallel-col__header--dragging"))}}
        @dragend=${A=>{A.currentTarget.classList.remove("parallel-col__header--dragging")}}
      >
        <div class="parallel-col__title-row">
          <span class="parallel-col__drag-handle" title="Drag to reorder lanes" aria-hidden="true"
            >⋮⋮</span
          >
          <span class="parallel-col__name">${h}</span>
          <div class="parallel-col__header-actions">
            <span
              class="parallel-col__status-dot ${u?"parallel-col__status-dot--working":T?"parallel-col__status-dot--ready":"parallel-col__status-dot--idle"}"
              title=${u?"Working":T?"Ready":"Idle"}
            ></span>
            <span
              class="parallel-col__status ${u?"parallel-col__status--working":T?"parallel-col__status--ready":""}"
              >${u?"WORKING":T?"READY":"IDLE"}</span
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
          ${m?o`<span class="parallel-col__model">${m}</span>`:p}
          <span class="parallel-col__turns">${f!=null?`${f} turns`:"--"}</span>
          <span class="parallel-col__tokens">${p1(g)} tokens</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="parallel-col__messages">
        ${d.length>0?d.slice(-120).map(h1):o`<div class="parallel-col__empty">No messages yet</div>`}
      </div>

      <!-- Compose -->
      <div class="parallel-col__compose">
        <input
          type="text"
          class="parallel-col__input"
          draggable="false"
          placeholder="Message..."
          @keydown=${A=>{if(A.key==="Enter"&&!A.shiftKey){A.preventDefault();const x=A.target,L=x.value.trim();L&&(i(t,L),x.value="")}}}
        />
      </div>
    </div>
  `}function m1(e){const t=e.state.settings.parallelLanes;return o`
    <div
      class="parallel-columns"
      @lane-drop=${n=>{e.onAssignLane(n.detail.laneIndex,n.detail.sessionKey)}}
      @lane-reorder=${n=>{e.onReorderLanes(n.detail.fromIndex,n.detail.toIndex)}}
      @lane-viewed=${n=>{e.onLaneViewed(n.detail.sessionKey)}}
    >
      ${t.map((n,s)=>n?g1(s,n,e):f1(s))}
    </div>
  `}const v1=20;function y1(e){switch(e.split(".").pop()?.toLowerCase()){case"md":return"📝";case"html":return"🌐";case"json":case"yaml":case"yml":case"toml":return"⚙️";case"ts":case"js":case"py":case"sh":case"rs":case"go":return"💻";case"css":return"🎨";default:return"📄"}}function b1(e){const t=[];function n(s){for(const a of s){if(t.length>=v1)return;const i=a;i.type==="file"?t.push(i):i.type==="directory"&&i.children&&n(i.children)}}return n(e),t}function w1(e,t){if(!e||e.length===0)return p;const n=b1(e);return n.length===0?p:o`
    <div class="work-file-list">
      ${n.map(s=>o`
        <button
          class="work-file-item"
          @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
        >
          <span class="work-file-icon">${y1(s.name)}</span>
          <span class="work-file-name">${s.name}</span>
          ${s.size!=null?o`<span class="work-file-meta">${(s.size/1024).toFixed(1)}KB</span>`:p}
        </button>
      `)}
      ${e.length>n.length?o`<div class="work-file-overflow">+${e.length-n.length} more files</div>`:p}
    </div>
  `}function k1(e,t,n,s,a,i,r,l){return o`
    <div class="my-day-card work-project ${t?"expanded":""}">
      <button class="my-day-card-header" @click=${a} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">${e.emoji}</span>
          <span>${e.name}</span>
          ${e.folder?o`<span class="work-folder-badge">${e.folder}</span>`:p}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--mc-text-muted);">${t?"▼":"▶"}</span>
        </div>
      </button>
      ${t?o`
            <div class="my-day-card-content">
              ${s?o`
                      <div class="work-detail-loading">
                        <div class="spinner" style="width: 16px; height: 16px"></div>
                        Loading...
                      </div>
                    `:p}
              ${n.length>0?o`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${w1(n,r)}
                    </div>
                  `:e.outputs.length>0?o`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${$1(e.outputs)}
                      </div>
                    `:p}
              ${e.people.length>0?o`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${e.people.map(c=>o`
                            <button
                              class="work-person-chip"
                              @click=${u=>{u.stopPropagation(),i?.(c)}}
                            >
                              ${c}
                            </button>
                          `)}
                      </div>
                    </div>
                  `:p}
              ${e.skills.length>0?o`
                    <div class="work-section">
                      <div class="work-section-label">Skills</div>
                      <div class="work-skills">
                        ${e.skills.map(c=>o`
                            <button
                              class="work-skill-chip"
                              @click=${u=>{u.stopPropagation(),l?.(c,e.name)}}
                            >
                              ${c}
                            </button>`)}
                      </div>
                    </div>
                  `:p}
              ${e.automations&&e.automations.length>0?o`
                    <div class="work-section">
                      <div class="work-section-label">Automations</div>
                      <div class="work-skills">
                        ${e.automations.map(c=>o`<span class="work-skill-chip">${c}</span>`)}
                      </div>
                    </div>
                  `:p}
            </div>
          `:p}
    </div>
  `}function $1(e){const t=e.reduce((s,a)=>{const i=a.type||"other";return s[i]||(s[i]=[]),s[i].push(a),s},{}),n={document:"📄",template:"📋",report:"📊",presentation:"📽️",spreadsheet:"📈",code:"💻",image:"🖼️",video:"🎬",audio:"🎵",archive:"📦",pdf:"📕",markdown:"📝"};return o`
    <div class="work-file-tree">
      ${Object.entries(t).map(([s,a])=>o`
        <div class="work-folder">
          <span class="work-folder-icon">📁</span>
          <span class="work-folder-name">${s}</span>
          <span class="work-file-meta">${a.length} ${a.length===1?"item":"items"}</span>
        </div>
        ${a.map(i=>o`
          <div class="work-file type-${s}">
            <span class="work-file-icon">${n[s.toLowerCase()]||"📄"}</span>
            ${i.url?o`<a href="${i.url}" target="_blank" rel="noopener noreferrer" class="work-file-name">${i.title}</a>`:o`<span class="work-file-name">${i.title}</span>`}
          </div>
        `)}
      `)}
    </div>
  `}function S1(e){const{projects:t,loading:n,error:s,expandedProjects:a=new Set,projectFiles:i={},detailLoading:r=new Set,onRefresh:l,onToggleProject:c,onPersonClick:u,onFileClick:h,onSkillClick:f}=e;if(n)return o`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading workspace...</span>
        </div>
      </div>
    `;if(s)return o`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${s}</span>
          ${l?o`<button class="retry-button" @click=${l}>Retry</button>`:p}
        </div>
      </div>
    `;const m=t.filter(w=>w.status==="active"),g=t.filter(w=>w.status==="archived");return o`
    <div class="my-day-container">
      <div class="my-day-toolbar">
        <div class="my-day-summary-stat">
          <span class="summary-value">${m.length}</span>
          <span class="summary-label">Projects</span>
        </div>
        ${l?o`<button class="my-day-refresh-btn" @click=${l} title="Refresh">↻</button>`:p}
      </div>

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${m.length===0&&g.length===0?o`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `:p}
          ${m.map(w=>k1(w,a.has(w.id),i[w.id]??[],r.has(w.id),()=>c?.(w.id),u,h,f))}
          ${g.length>0?o`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${g.length} archived project${g.length!==1?"s":""}
                </div>
              `:p}
        </div>
      </div>
    </div>
  `}const A1={urgent:"badge-danger",high:"badge-warning",medium:"badge-info",low:"badge-muted"},T1={"new-feature":"New Feature","skill-recommendation":"Skill","config-optimization":"Config","workflow-suggestion":"Workflow","trend-alert":"Trend","goal-nudge":"Goal","health-warning":"Health"};function Fn(e){const t=Date.now()-e;return t<6e4?"just now":t<36e5?`${Math.floor(t/6e4)}m ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:`${Math.floor(t/864e5)}d ago`}function x1(e){return o`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${_1(e)}
      ${e.error?e.error.includes("unknown method")?o`<div class="callout info">Insights service not yet active. Restart the gateway to enable: <code>openclaw gateway restart</code></div>`:o`<div class="callout danger">${e.error}</div>`:p}
      ${e.loading?o`<div class="callout info">Scanning sources...</div>`:p}
      ${C1(e)}
      ${L1(e)}
      ${E1(e)}
      ${R1(e)}
    </div>
  `}function _1(e){return o`
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <h3 style="margin: 0;">\u{1F441}\uFE0F Insights</h3>
        <p style="margin: 4px 0 0; opacity: 0.6; font-size: 0.85em;">
          GodMode watches external sources and your patterns to help you improve.
        </p>
      </div>
      <button
        class="btn btn-sm"
        ?disabled=${e.loading}
        @click=${()=>e.onRefresh()}
      >
        ${e.loading?"Scanning...":"Refresh All"}
      </button>
    </div>
  `}function C1(e){const t=e.insights.filter(n=>!n.dismissed&&!n.actedOn);return t.length===0?o`
      <div class="card" style="padding: 16px; text-align: center; opacity: 0.6;">
        No active insights. GodMode is watching for opportunities.
      </div>
    `:o`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <h4 style="margin: 0;">Active Insights (${t.length})</h4>
      ${t.map(n=>o`
          <div class="card" style="padding: 12px;">
            <div style="display: flex; align-items: start; gap: 8px;">
              <span class="badge ${A1[n.priority]??"badge-muted"}" style="flex-shrink: 0; font-size: 0.75em;">
                ${T1[n.category]??n.category}
              </span>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.9em;">${n.title}</div>
                <div style="font-size: 0.8em; opacity: 0.7; margin-top: 4px;">${n.body}</div>
                <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                  ${n.action?o`<button class="btn btn-xs btn-primary" @click=${()=>e.onAct(n.id)}>
                        ${n.action.label}
                      </button>`:p}
                  <button class="btn btn-xs" @click=${()=>e.onDismiss(n.id)}>Dismiss</button>
                  <span style="font-size: 0.7em; opacity: 0.5; margin-left: auto;">${Fn(n.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        `)}
    </div>
  `}function L1(e){if(!e.patterns)return p;const t=e.patterns,n=[{label:"Completion Rate (7d)",value:`${Math.round(t.taskPatterns.completionRate7d*100)}%`},{label:"Tasks/Day",value:t.taskPatterns.avgTasksPerDay.toFixed(1)},{label:"Stuck Tasks",value:String(t.taskPatterns.stuckTasks.length)},{label:"Active Days (7d)",value:String(t.activityPatterns.activeDaysLast7d)},{label:"Coding Sessions (7d)",value:String(t.codingPatterns.totalSessionsLast7d)},{label:"Stalled Goals",value:String(t.goalStatus.stalledGoals.length)}];return o`
    <div>
      <h4 style="margin: 0 0 8px;">Your Patterns</h4>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        ${n.map(s=>o`
            <div class="card" style="padding: 10px; text-align: center;">
              <div style="font-size: 1.2em; font-weight: 700;">${s.value}</div>
              <div style="font-size: 0.7em; opacity: 0.6;">${s.label}</div>
            </div>
          `)}
      </div>
    </div>
  `}function E1(e){if(e.discoveries.length===0)return p;const t=e.discoveries.slice(0,10);return o`
    <div>
      <h4 style="margin: 0 0 8px;">Recent Discoveries (${e.discoveries.length})</h4>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        ${t.map(n=>o`
            <div style="padding: 8px 12px; border-radius: 6px; background: var(--surface-1, #1e1e2e); display: flex; align-items: start; gap: 8px;">
              <span style="font-size: 0.7em; opacity: 0.5; flex-shrink: 0; padding-top: 2px;">
                ${n.source}
              </span>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.85em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${n.url?o`<a href=${n.url} target="_blank" rel="noopener" style="color: var(--link-color, #4ecdc4);">${n.title}</a>`:n.title}
                </div>
              </div>
              <span style="font-size: 0.7em; opacity: 0.4; flex-shrink: 0;">${Fn(n.discoveredAt)}</span>
            </div>
          `)}
      </div>
    </div>
  `}function R1(e){if(!e.status)return p;const t=e.status;return o`
    <div style="font-size: 0.75em; opacity: 0.5; display: flex; gap: 12px; flex-wrap: wrap;">
      <span>Status: ${t.running?"Running":"Stopped"}</span>
      ${t.lastScoutRun?o`<span>Scout: ${Fn(t.lastScoutRun)}</span>`:p}
      ${t.lastObserverRun?o`<span>Observer: ${Fn(t.lastObserverRun)}</span>`:p}
      ${t.lastAdvisorRun?o`<span>Advisor: ${Fn(t.lastAdvisorRun)}</span>`:p}
      <span>Findings: ${t.totalFindings}</span>
      <span>Insights: ${t.totalInsights}</span>
    </div>
  `}function Je(e){if(!e)return"";try{return K(new Date(e).getTime())}catch{return""}}function un(e){return o`<div class="second-brain-md-body">${_e(we(e))}</div>`}function I1(e){const{identity:t}=e;return!t||t.files.length===0?ns("No identity files found","Start building your Second Brain by creating USER.md in ~/godmode/."):o`
    <div class="second-brain-panel">
      ${t.identityOs?o`
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
      `:p}

      ${t.files.map(n=>o`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.label}</span>
            ${n.updatedAt?o`<span class="second-brain-card-updated">${Je(n.updatedAt)}</span>`:p}
          </div>
          <div class="second-brain-card-content">${un(n.content)}</div>
        </div>
      `)}

      ${t.identityOs&&t.identityOs.artifacts.length>0?o`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">Identity OS Artifacts</span>
            <span class="second-brain-section-count">${t.identityOs.artifacts.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.identityOs.artifacts.map(n=>Cs(n,e))}
          </div>
        </div>
      `:p}
    </div>
  `}function P1(e){const{memoryBank:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:r}=e;if(n)return o`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?o`<span class="second-brain-card-updated">${Je(n.updatedAt)}</span>`:p}
          </div>
          ${n.relativePath?o`<div class="second-brain-card-path">${n.relativePath}</div>`:p}
          <div class="second-brain-card-content">${un(n.content)}</div>
        </div>
      </div>
    `;if(a&&i)return o`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${r??"Folder"}</span>
            <span class="second-brain-section-count">${i.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${i.length>0?i.map(u=>Cs(u,e)):o`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!t)return ns("No memory bank files found","Start building your memory bank by telling your ally about the people, companies, and projects in your life.");const l=(s??"").toLowerCase().trim(),c=u=>l?u.filter(h=>h.name.toLowerCase().includes(l)||h.excerpt.toLowerCase().includes(l)):u;return o`
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

      ${t.sections.map(u=>{const h=c(u.entries);return u.entries.length===0?p:o`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">${u.icon} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${h.length>0?h.map(f=>Cs(f,e)):l?o`<div class="second-brain-empty-inline">No matches</div>`:p}
            </div>
          </div>
        `})}

      ${t.extraFiles.length>0?o`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
            <span class="second-brain-section-count">${t.extraFiles.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.extraFiles.map(u=>Cs(u,e))}
          </div>
        </div>
      `:p}

      ${t.curated?o`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
            <span class="second-brain-section-count">${Je(t.curated.updatedAt)}</span>
          </div>
          <div class="second-brain-card">
            <div class="second-brain-card-content">${un(t.curated.content)}</div>
          </div>
        </div>
      `:p}
    </div>
  `}function Cs(e,t){const n=e.isDirectory;return o`
    <div class="second-brain-entry" @click=${()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${n?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${n?"/":""}</div>
        ${e.excerpt?o`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
      </div>
      ${e.updatedAt?o`<div class="second-brain-entry-meta">${Je(e.updatedAt)}</div>`:p}
    </div>
  `}function M1(e){const{aiPacket:t,syncing:n}=e;return o`
    <div class="second-brain-panel">
      <div class="second-brain-sync-bar">
        <div class="second-brain-sync-info">
          <span class="second-brain-sync-label">Live Context Injection</span>
          <span class="second-brain-sync-time">
            ${t?.consciousness?.updatedAt?`Last synced ${Je(t.consciousness.updatedAt)}`:"Not yet synced"}
            ${t?.consciousness?` • ${t.consciousness.lineCount} lines`:""}
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

      ${t?.consciousness?o`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">CONSCIOUSNESS.md</span>
            <span class="second-brain-card-updated">${t.consciousness.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${un(t.consciousness.content)}</div>
        </div>
      `:o`
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F9E0}</div>
          <div class="second-brain-empty-title">No consciousness file yet</div>
          <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first consciousness snapshot.</div>
        </div>
      `}

      ${t?.working?o`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">WORKING.md</span>
            <span class="second-brain-card-updated">${t.working.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${un(t.working.content)}</div>
        </div>
      `:p}
    </div>
  `}const lc={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function D1(e){const{sourcesData:t}=e;if(!t||t.sources.length===0)return ns("No sources detected","Connect data sources to build your context universe.");const n=t.sources.filter(a=>a.status==="connected"),s=t.sources.filter(a=>a.status==="available");return o`
    <div class="second-brain-panel">
      <div class="second-brain-sources-summary">
        <span class="second-brain-sources-count">${t.connectedCount}</span>
        <span class="second-brain-sources-label">sources connected</span>
        <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add a Source</button>
      </div>

      ${n.length>0?o`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E2} Connected</span>
            <span class="second-brain-section-count">${n.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${n.map(a=>cc(a))}
          </div>
        </div>
      `:p}

      ${s.length>0?o`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E1} Available</span>
            <span class="second-brain-section-count">${s.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${s.map(a=>cc(a))}
          </div>
        </div>
      `:p}
    </div>
  `}function cc(e){const t=lc[e.status]??lc.available;return o`
    <div class="second-brain-source-card ${t.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?o`<div class="second-brain-source-stats">${e.stats}</div>`:p}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${t.dot}</span>
        <span class="second-brain-source-status-label">${t.label}</span>
        ${e.status==="connected"&&e.lastSync?o`<span class="second-brain-source-sync">${Je(e.lastSync)}</span>`:p}
      </div>
    </div>
  `}function dc(e,t){const n=e.isDirectory,s=n?"📁":"📑",a=()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)},i=e.frontmatter?.title||e.name;return o`
    <div class="second-brain-entry" @click=${a}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${s}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${i}${n?"/":""}</div>
        ${e.frontmatter?.url?o`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:p}
        ${e.excerpt&&!n?o`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
        ${e.frontmatter?.tags?.length?o`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(r=>o`<span class="second-brain-research-tag">${r}</span>`)}
          </div>
        `:p}
      </div>
      ${e.updatedAt?o`<div class="second-brain-entry-meta">${Je(e.updatedAt)}</div>`:p}
    </div>
  `}function O1(e){const{researchData:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:r}=e;if(n)return o`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?o`<span class="second-brain-card-updated">${Je(n.updatedAt)}</span>`:p}
          </div>
          ${n.relativePath?o`<div class="second-brain-card-path">${n.relativePath}</div>`:p}
          <div class="second-brain-card-content">${un(n.content)}</div>
        </div>
      </div>
    `;if(a&&i)return o`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${r??"Category"}</span>
            <span class="second-brain-section-count">${i.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${i.length>0?i.map(u=>dc(u,e)):o`<div class="second-brain-empty-inline">No research in this category</div>`}
          </div>
        </div>
      </div>
    `;if(!t||t.totalEntries===0)return o`
      <div class="second-brain-panel">
        <div class="second-brain-research-toolbar">
          <div style="flex:1"></div>
          <button class="second-brain-sync-btn" @click=${()=>e.onSaveViaChat()}>
            + Save via Chat
          </button>
        </div>
        ${ns("No research collected yet","Click 'Save via Chat' to paste links, bookmarks, or notes — your AI will organize them for you.")}
      </div>
    `;const l=(s??"").toLowerCase().trim(),c=u=>l?u.filter(h=>h.name.toLowerCase().includes(l)||h.excerpt.toLowerCase().includes(l)||(h.frontmatter?.tags??[]).some(f=>f.toLowerCase().includes(l))||(h.frontmatter?.url??"").toLowerCase().includes(l)):u;return o`
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
        <button class="second-brain-sync-btn" @click=${()=>e.onSaveViaChat()}>
          + Save via Chat
        </button>
      </div>

      ${t.categories.map(u=>{const h=c(u.entries);return u.entries.length===0?p:o`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4C1} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${h.length>0?h.map(f=>dc(f,e)):l?o`<div class="second-brain-empty-inline">No matches</div>`:p}
            </div>
          </div>
        `})}
    </div>
  `}function N1(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function B1(e){return o`
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

      ${e.fileSearchResults?F1(e):e.fileTreeLoading?o`<div class="sb-files-loading">Loading file tree...</div>`:e.fileTree?ip(e.fileTree,e):o`<div class="sb-files-empty">No files found</div>`}
    </div>
  `}function F1(e){const t=e.fileSearchResults??[];return t.length===0?o`<div class="sb-files-empty">No results found</div>`:o`
    <div class="sb-files-results">
      ${t.map(n=>o`
          <button
            class="sb-files-result-item"
            @click=${()=>e.onFileSelect?.(n.path)}
          >
            <span class="sb-file-icon">${n.type==="folder"?"📁":"📄"}</span>
            <div class="sb-file-info">
              <span class="sb-file-name">${n.name}</span>
              <span class="sb-file-path">${n.path}</span>
              ${n.matchContext||n.excerpt?o`<span class="sb-file-excerpt">${n.matchContext??n.excerpt}</span>`:p}
            </div>
          </button>
        `)}
    </div>
  `}function ip(e,t,n=0){return o`
    <div class="sb-file-tree" style="padding-left: ${n*16}px">
      ${e.map(s=>s.type==="folder"?o`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${s.name}</span>
                ${s.childCount!=null?o`<span class="sb-tree-count">${s.childCount}</span>`:p}
              </summary>
              ${s.children?ip(s.children,t,n+1):p}
            </details>
          `:o`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>t.onFileSelect?.(s.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${s.name}</span>
            ${s.size!=null?o`<span class="sb-tree-size">${N1(s.size)}</span>`:p}
          </button>
        `)}
    </div>
  `}function ns(e,t){return o`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${t}</div>
    </div>
  `}function U1(e){if(!e)return p;if(!e.available)return o`
      <div class="vault-health-bar vault-health-disconnected">
        <span class="vault-health-status">\u26A0\uFE0F Vault not connected</span>
        <span class="vault-health-detail">Using local storage. Set OBSIDIAN_VAULT_PATH to connect your Obsidian vault.</span>
      </div>
    `;const t=e.stats;if(!t)return p;const n=t.lastActivity?Je(t.lastActivity):"never",s=t.inboxCount>0?o`<span class="vault-health-inbox-badge">${t.inboxCount} in inbox</span>`:p;return o`
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
  `}function z1(e){const{subtab:t,loading:n,vaultHealth:s}=e;return o`
    <section class="second-brain-container">
      ${U1(s)}
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

      ${t==="intel"?e.intelProps?x1(e.intelProps):o`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:n?o`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:t==="identity"?I1(e):t==="memory-bank"?P1(e):t==="ai-packet"?M1(e):t==="sources"?D1(e):t==="resources"?K1(e):t==="files"?B1(e):O1(e)}
    </section>
  `}function K1(e){const{communityResources:t,communityResourceAddFormOpen:n}=e;return o`
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

      ${n?q1(e):p}

      ${!t||t.resources.length===0?ns("No community resources yet","Add GitHub repos, awesome-lists, and tools for your AI agents to discover and reference."):o`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4E6} Bookmarked Resources</span>
              <span class="second-brain-section-count">${t.count}</span>
            </div>
            <div class="second-brain-entry-list">
              ${t.resources.map(s=>W1(s,e))}
            </div>
          </div>
        `}
    </div>
  `}function W1(e,t){return o`
    <div class="second-brain-entry">
      <div class="second-brain-entry-icon">\u{1F517}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">
          <a href=${e.url} target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
            ${e.label}
          </a>
        </div>
        ${e.description?o`<div class="second-brain-entry-excerpt">${e.description}</div>`:p}
        ${e.tags.length>0?o`<div class="second-brain-research-tags">
              ${e.tags.map(n=>o`<span class="second-brain-research-tag">${n}</span>`)}
            </div>`:p}
      </div>
      <button
        class="second-brain-back-btn"
        style="font-size: 11px; padding: 2px 8px; color: var(--danger, #ef4444);"
        @click=${n=>{n.stopPropagation(),t.onCommunityResourceRemove(e.id)}}
      >Remove</button>
    </div>
  `}function q1(e){const t=e.communityResourceAddForm??{url:"",label:"",description:"",tags:""};return o`
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
  `}function H1(e){return e==="global"?o`<span class="dashboard-card-scope">Global</span>`:o`<span class="dashboard-card-scope">${e}</span>`}function j1(e,t,n){return o`
    <div class="dashboard-card">
      <button
        class="dashboard-card-main"
        @click=${()=>t(e.id)}
      >
        <div class="dashboard-card-title">${e.title}</div>
        ${e.description?o`<div class="dashboard-card-desc">${e.description}</div>`:p}
        <div class="dashboard-card-meta">
          ${H1(e.scope)}
          <span>${K(new Date(e.updatedAt).getTime())}</span>
        </div>
      </button>
      <button
        class="dashboard-card-delete"
        title="Delete dashboard"
        @click=${s=>{s.stopPropagation(),confirm(`Delete "${e.title}"?`)&&n(e.id)}}
      >&times;</button>
    </div>
  `}function V1(e,t){const s=(e.role||"unknown")==="assistant",a=s?t:"You";let i="";return typeof e.text=="string"?i=e.text:typeof e.content=="string"?i=e.content:Array.isArray(e.content)&&(i=e.content.filter(r=>r.type==="text"&&typeof r.text=="string").map(r=>r.text).join(`
`)),i.trim()?o`
    <div class="db-chat-msg ${s?"db-chat-msg--assistant":"db-chat-msg--user"}">
      <div class="db-chat-msg-label">${a}</div>
      <div class="db-chat-msg-body">${s?_e(na(i)):i}</div>
    </div>
  `:p}function G1(e){const{chatOpen:t,chatMessages:n,chatStream:s,chatMessage:a,chatSending:i,isWorking:r,assistantName:l,onToggleChat:c,onChatMessageChange:u,onChatSend:h}=e,f=l||"Assistant",m=n??[],g=m.length>0;return o`
    <div class="db-chat-panel ${t?"db-chat-panel--open":""}">
      <button
        class="db-chat-toggle"
        @click=${()=>c?.()}
      >
        <span class="db-chat-toggle-label">
          Session ${g?`(${m.length})`:""}
          ${r?o`<span class="db-chat-working">working...</span>`:p}
        </span>
        <span class="db-chat-toggle-arrow">${t?"▼":"▲"}</span>
      </button>

      ${t?o`
            <div class="db-chat-messages" id="db-chat-messages">
              ${!g&&!s?o`<div class="db-chat-empty">Send a message to refine this dashboard.</div>`:p}
              ${m.map(w=>V1(w,f))}
              ${s?o`
                    <div class="db-chat-msg db-chat-msg--assistant">
                      <div class="db-chat-msg-label">${f}</div>
                      <div class="db-chat-msg-body">${_e(na(s))}</div>
                    </div>
                  `:p}
              ${r&&!s?o`<div class="db-chat-typing">${f} is thinking...</div>`:p}
            </div>
            <div class="db-chat-input-row">
              <input
                class="db-chat-input"
                type="text"
                placeholder="Ask to refine this dashboard..."
                .value=${a??""}
                ?disabled=${i||r}
                @input=${w=>u?.(w.target.value)}
                @keydown=${w=>{w.key==="Enter"&&!w.shiftKey&&(w.preventDefault(),h?.())}}
              />
              <button
                class="db-chat-send-btn"
                ?disabled=${i||r||!(a??"").trim()}
                @click=${()=>h?.()}
              >${i?"...":"Send"}</button>
            </div>
          `:p}
    </div>
  `}function Q1(e){const{activeDashboardHtml:t,activeDashboardManifest:n,isWorking:s}=e;return!t||!n?p:o`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>e.onBack()}
        >&larr; All Dashboards</button>
        <span class="dashboards-active-title">${n.title}</span>
        <button
          class="dashboards-session-btn"
          @click=${()=>e.onOpenSession(n.id)}
        >${s?"Working...":"Open in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${()=>e.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${_e(Yf(t))}
        </div>
      </div>
      ${G1(e)}
    </section>
  `}function Y1(e){const{loading:t,dashboards:n}=e;return o`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <button
          class="dashboards-create-btn"
          @click=${()=>e.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${t?o`<div class="dashboards-loading">Loading...</div>`:!n||n.length===0?o`
              <div class="dashboards-empty">
                <div class="dashboards-empty-icon">&#128202;</div>
                <div class="dashboards-empty-title">No dashboards yet</div>
                <div class="dashboards-empty-hint">
                  Tell your ally what you want to see and they'll build it for you.<br>
                  <em>"Create a morning overview dashboard with my tasks, calendar, and focus score."</em>
                </div>
              </div>
            `:o`
              <div class="dashboards-grid">
                ${n.map(s=>j1(s,e.onSelectDashboard,e.onDeleteDashboard))}
              </div>
            `}
    </section>
  `}function X1(e){return e.error?o`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <p>${e.error}</p>
          <button @click=${()=>e.onRefresh()}>Retry</button>
        </div>
      </section>
    `:e.activeDashboardHtml&&e.activeDashboardManifest?Q1(e):Y1(e)}const J1={0:"Assessment",1:"Interview",2:"Second Brain",3:"Workflow Audit",4:"Configuration",5:"First Win",6:"Ready"},Z1=[{id:"slack",name:"Slack",icon:"#",desc:"Team messaging"},{id:"google-calendar",name:"Google Calendar",icon:"Cal",desc:"Events & scheduling"},{id:"clickup",name:"ClickUp",icon:"CU",desc:"Project management"},{id:"github",name:"GitHub",icon:"GH",desc:"Code & repos"},{id:"obsidian",name:"Obsidian",icon:"Ob",desc:"Notes & knowledge"},{id:"notion",name:"Notion",icon:"N",desc:"Docs & wikis"},{id:"linear",name:"Linear",icon:"Li",desc:"Issue tracking"},{id:"apple-reminders",name:"Apple Reminders",icon:"AR",desc:"Tasks (macOS)"},{id:"email",name:"Email",icon:"@",desc:"Gmail / Outlook"},{id:"things-mac",name:"Things",icon:"Th",desc:"Task manager (macOS)"}];function e2(e){return o`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${[2,3,4,5].map(n=>o`
						<div
							class="onboarding-progress-step ${e>=n?"completed":""} ${e===n?"active":""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${J1[n]}</span>
						</div>
					`)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${(e-2)/4*100}%"></div>
		</div>
	`}function t2(e,t){return o`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${Z1.map(n=>{const a=e.find(i=>i.id===n.id)?.status??"pending";return o`
						<div class="onboarding-tool-card ${a}" data-tool-id="${n.id}">
							<div class="onboarding-tool-icon">${n.icon}</div>
							<div class="onboarding-tool-name">${n.name}</div>
							<div class="onboarding-tool-desc">${n.desc}</div>
							<div class="onboarding-tool-status">
								${a==="connected"?o`<span class="status-connected">Connected</span>`:a==="skipped"?o`<span class="status-skipped">Skipped</span>`:o`<span class="status-pending">Tap to connect</span>`}
							</div>
						</div>
					`})}
			</div>
			<button class="onboarding-skip-btn" @click=${t}>Skip for now</button>
		</div>
	`}function n2(e){return e.length?o`
		<div class="onboarding-audit-overlay">
			<h3>GodMode Audit Results</h3>
			<div class="onboarding-audit-cards">
				${e.map(t=>o`
						<div class="onboarding-audit-card impact-${t.impact}">
							<div class="audit-problem">${t.problem}</div>
							${t.skill?o`<div class="audit-skill">Skill: ${t.skill}</div>`:p}
							${t.estimatedTimeSaved?o`<div class="audit-time">Saves ~${t.estimatedTimeSaved}</div>`:p}
							<div class="audit-impact">${t.impact} impact</div>
						</div>
					`)}
			</div>
		</div>
	`:o`${p}`}function s2(e){const t=e>=70?"#38a169":e>=40?"#d69e2e":"#e53e3e",n=e>=70?"Good":e>=40?"Needs Work":"Getting Started";return o`
		<div class="onboarding-health-gauge">
			<div class="health-score" style="color: ${t}">
				<span class="health-number">${e}</span>
				<span class="health-max">/100</span>
			</div>
			<div class="health-label" style="color: ${t}">${n}</div>
		</div>
	`}function a2(e){return o`
		<div class="onboarding-assessment">
			${s2(e.healthScore)}
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
				${e.features.map(t=>o`
						<div class="assessment-item ${t.enabled?"ok":"gap"}">
							<span class="assessment-icon">${t.enabled?"✅":"❌"}</span>
							<span>${t.label}</span>
						</div>
					`)}
			</div>
		</div>
	`}function i2(e,t){return o`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				${t?o`
						<p class="onboarding-subtitle">Here's where your setup stands today:</p>
						${a2(t)}
						<p class="onboarding-subtitle">Let's get you to 100. It takes about 15 minutes.</p>
					`:o`
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
	`}function r2(e){let t="",n="",s="";const a=["rocket","lightning","fire","star","brain","crown","diamond","target","compass","mountain"],i={rocket:"🚀",lightning:"⚡",fire:"🔥",star:"⭐",brain:"🧠",crown:"👑",diamond:"💎",target:"🎯",compass:"🧭",mountain:"⛰️"};function r(l){l.preventDefault();const c=l.target,u=new FormData(c);t=u.get("name")?.trim()??"",n=u.get("mission")?.trim()??"",s=u.get("emoji")?.trim()||"🚀",t&&e({name:t,mission:n,emoji:s})}return o`
		<div class="onboarding-fullscreen">
			<div class="onboarding-identity">
				<h2 class="onboarding-identity-title">Who are you?</h2>
				<p class="onboarding-identity-subtitle">Let's personalize your GodMode</p>
				<form class="onboarding-identity-form" @submit=${r}>
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
							${a.map((l,c)=>o`
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
	`}function o2(e){const{phase:t,tools:n,auditFindings:s,onSkipPhase:a}=e;return o`
		${e2(t)}
		${t===3?t2(n,a):p}
		${t===4&&s.length>0?n2(s):p}
	`}function l2(e,t,n){return e?o`
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
				${t?.mission?o`<p class="onboarding-summary-mission">"${t.mission}"</p>`:p}
				<button class="onboarding-cta onboarding-reveal-btn" @click=${n}>
					Welcome to GodMode
				</button>
			</div>
		</div>
	`:o`${p}`}const c2=["AI updates","Competitor intel","Market trends","Industry news","Tech launches"];function d2(e){let t="",n="",s="",a=!1;function i(l,c){if(!c)return;const u=c.value.trim();u.toLowerCase().includes(l.toLowerCase())||(c.value=u?`${u}, ${l}`:l)}function r(l){if(l.preventDefault(),a)return;const c=l.target,u=c.querySelector('[name="name"]')?.value?.trim()??"",h=c.querySelector('[name="licenseKey"]')?.value?.trim()??"",f=c.querySelector('[name="dailyIntel"]')?.value?.trim()??"";if(!u){c.querySelector('[name="name"]')?.focus();return}a=!0,e.onQuickSetup(u,h,f)}return o`
    <div class="setup-quick">
      <div class="setup-quick__header">
        <span class="setup-quick__icon">⚡</span>
        <h2 class="setup-quick__title">Welcome to GodMode</h2>
        <p class="setup-quick__subtitle">Let's get you set up in under 2 minutes.</p>
      </div>

      <form class="setup-quick__form" @submit=${r}>
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
            .value=${t}
          />
        </div>

        <div class="setup-field">
          <label class="setup-label" for="setup-key">License key</label>
          <input
            class="setup-input"
            type="text"
            id="setup-key"
            name="licenseKey"
            placeholder="GM-DEV-... or GM-PROD-..."
            .value=${n}
          />
          <span class="setup-hint">Starts with GM-. Don't have one? Ask your admin.</span>
        </div>

        <div class="setup-field">
          <label class="setup-label" for="setup-intel">
            Daily intelligence
            <span class="setup-label-optional">(optional)</span>
          </label>
          <div class="setup-chips">
            ${c2.map(l=>o`
                <button
                  type="button"
                  class="setup-chip"
                  @click=${c=>{const h=c.target.closest("form")?.querySelector('[name="dailyIntel"]');i(l,h)}}
                >
                  ${l}
                </button>
              `)}
          </div>
          <textarea
            class="setup-textarea"
            id="setup-intel"
            name="dailyIntel"
            rows="2"
            placeholder="e.g., AI industry news, SaaS competitor analysis, market trends"
            .value=${s}
          ></textarea>
          <span class="setup-hint">
            This powers your daily brief's intelligence section via X/Twitter search.
          </span>
        </div>

        <button class="setup-submit" type="submit">
          Get Started
        </button>
      </form>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Stuck? Our AI support agent can walk you through it.</span>
        <button class="setup-help-banner__btn" @click=${()=>e.onOpenSupportChat()}>
          Open Support Chat
        </button>
      </div>
    </div>
  `}function u2(e){const t=e.steps.filter(a=>a.completed).length,n=e.steps.length,s=t===n;return o`
    <details class="setup-milestone ${s?"setup-milestone--done":""}" ?open=${e.status==="in-progress"}>
      <summary class="setup-milestone__header">
        <span class="setup-milestone__emoji">${e.emoji}</span>
        <div class="setup-milestone__info">
          <span class="setup-milestone__title">${e.title}</span>
          <span class="setup-milestone__meta">${t}/${n}</span>
        </div>
        <span class="setup-milestone__status">
          ${s?"✅":e.status==="in-progress"?"🔄":"🔒"}
        </span>
      </summary>
      <div class="setup-milestone__body">
        <p class="setup-milestone__desc">${e.description}</p>
        <ul class="setup-steps">
          ${e.steps.map(a=>o`
              <li class="setup-step ${a.completed?"setup-step--done":""}">
                <span class="setup-step__check">${a.completed?"✓":"○"}</span>
                <span class="setup-step__label">${a.label}</span>
                ${a.detail?o`<span class="setup-step__detail">${a.detail}</span>`:p}
              </li>
            `)}
        </ul>
      </div>
    </details>
  `}function p2(e){const{checklist:t,checklistLoading:n,onHideSetup:s,onOpenWizard:a}=e;if(n&&!t)return o`<div class="setup-loading">Loading setup progress...</div>`;if(!t)return o`<div class="setup-loading">Couldn't load setup progress. Is the gateway running?</div>`;const{milestones:i,percentComplete:r}=t;return o`
    <div class="setup-checklist">
      <div class="setup-checklist__header">
        <h3 class="setup-checklist__title">Setup Progress</h3>
        <span class="setup-checklist__pct">${r}%</span>
      </div>

      <div class="setup-progress">
        <div class="setup-progress__bar" style="width: ${r}%"></div>
      </div>

      <div class="setup-milestones">
        ${i.map(l=>u2(l))}
      </div>

      <div class="setup-actions">
        <button class="setup-action-btn" @click=${a}>
          Run Memory Wizard
        </button>
        <button class="setup-action-btn setup-action-btn--text" @click=${s}>
          Hide Setup
        </button>
      </div>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Need help with setup? Chat with our AI support agent.</span>
        <button class="setup-help-banner__btn" @click=${()=>e.onOpenSupportChat()}>
          Open Support Chat
        </button>
      </div>
    </div>
  `}function h2(e){return e.connected?o`
    <section class="tab-body setup-section">
      ${e.quickSetupDone?p:d2(e)}
      ${p2(e)}
    </section>
  `:o`
      <section class="tab-body setup-section">
        <div class="setup-loading">
          Waiting for gateway connection...
        </div>
      </section>
    `}const f2=/^data:/i,g2=/^https?:\/\//i;function m2(e){const t=e.agentsList?.agents??[],s=Lc(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",i=t.find(l=>l.id===s)?.identity,r=i?.avatarUrl??i?.avatar;if(r)return f2.test(r)||g2.test(r)?r:i?.avatarUrl}function st(e,t){const n=e.dynamicSlots[t];return n?o`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${_e(na(n))}</div>
    </div>
  `:p}function uc(e){return e.trim().toLowerCase().replace(/[^a-z0-9+\s]/g," ").replace(/\s+/g," ")}function Oi(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const l=n.length/2,c=n.slice(0,l).join(" "),u=n.slice(l).join(" ");if(c.toLowerCase()===u.toLowerCase())return c}const s=t.replace(/\s+/g," ").toLowerCase(),a=Math.floor(s.length/2),i=s.slice(0,a).trim(),r=s.slice(a).trim();return i&&i===r?t.slice(0,Math.ceil(t.length/2)).trim():t}function Ni(e,t){const n=t?.sessionId?.trim();if(n)return`session:${n}`;const s=t?.label??t?.displayName??Te.get(t?.key??e)??Te.get(e)??"",a=uc(Oi(s));if(a){const i=String(t?.surface??"").trim().toLowerCase(),r=uc(String(t?.subject??"")).slice(0,20),l=a.split(" ").filter(Boolean).slice(0,3).join(" ");return`name:${i}|${r}|${l||a.slice(0,24)}`}return`key:${e.trim().toLowerCase()}`}function v2(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))],s=Ie(t,e.sessionKey),a=Ni(e.sessionKey,s),i=new Map;for(const l of n){const c=Ie(t,l),u=Ni(l,c);if(!i.has(u)){i.set(u,l);continue}l===e.sessionKey&&i.set(u,l)}const r=[...i.values()];return r.length===0&&r.push(e.sessionKey.trim()||"main"),{tabKeys:r,activeIdentity:a}}function y2(e){const t=e.onboardingActive&&e.onboarding,n=e.onboardingPhase??0,s=e.onboardingData;if(t&&n===0)return i2(()=>{e.handleOnboardingStart?.()},s?.assessment);if(t&&n===1)return r2(d=>{e.handleOnboardingIdentitySubmit?.(d)});if(t&&n===6)return l2(s?.summary??null,s?.identity??null,()=>{e.handleOnboardingComplete?.()});if(e.wizardActive&&e.wizardState)return np(e.wizardState,{onStepChange:d=>{e.handleWizardStepChange?.(d)},onAnswerChange:(d,$)=>{e.handleWizardAnswerChange?.(d,$)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()}});const a=e.presenceEntries.length,i=e.sessionsResult?.count??null,r=e.cronStatus?.nextWakeAtMs??null,l=e.connected?null:"Disconnected from gateway.",c=e.tab==="chat",u=c&&(e.settings.chatFocusMode||e.onboarding||t&&n>=2),h=e.onboarding?!1:e.settings.chatShowThinking,f=m2(e),m=e.chatAvatarUrl??f??null,g=!!(e.godmodeOptions?.["focusPulse.enabled"]??!0),w=!!e.focusPulseData?.active,S=g&&w&&!!e.focusPulseData?.currentFocus,{tabKeys:T,activeIdentity:_}=v2(e);return o`
    <div class="shell ${c?"shell--chat":""} ${u?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${Y.menu}</span>
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
          ${S?o`
              <div class="focus-pulse-widget ${e.focusPulseData.aligned?"":"focus-pulse-widget--misaligned"}">
                <span>\u{1F3AF}</span>
                <span class="focus-pulse-widget__focus">${e.focusPulseData.currentFocus.title}</span>
                <span class="focus-pulse-widget__score">${e.focusPulseData.score}/100</span>
                ${e.focusPulseData.streak>0?o`<span class="focus-pulse-widget__streak">\u{1F525} ${e.focusPulseData.streak}d</span>`:p}
                <button class="focus-pulse-widget__complete-btn" @click=${()=>e.handleFocusPulseComplete()} title="Mark current focus complete">\u2713 Done</button>
              </div>
            `:p}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?o`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${d=>{d.preventDefault(),e.setTab("overview")}}
                >
                  <span class="pill__icon">${Y.zap}</span>
                  <span>Update Ready</span>
                </a>`:p}
          <button
            class="pill pill--support"
            @click=${d=>{d.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${Y.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${xu(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Xy.map(d=>{const $=e.settings.navGroupsCollapsed[d.label]??!1,A=d.tabs.some(L=>L===e.tab),x=!d.label||d.tabs.length===1&&qs(d.tabs[0])===d.label;return o`
            <div class="nav-group ${$&&!A?"nav-group--collapsed":""} ${x?"nav-group--no-header":""}">
              ${x?p:o`
                <button
                  class="nav-label"
                  @click=${()=>{const L={...e.settings.navGroupsCollapsed};L[d.label]=!$,e.applySettings({...e.settings,navGroupsCollapsed:L})}}
                  aria-expanded=${!$}
                >
                  <span class="nav-label__text">${d.label}</span>
                  <span class="nav-label__chevron">${$?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!d.label&&e.showSetupTab&&!e.godmodeOptions?.["onboarding.hidden"]?o`
                        <a
                          class="nav-item ${e.tab==="setup"?"active":""}"
                          href="#"
                          @click=${L=>{L.preventDefault(),e.setTab("setup")}}
                          title="Get GodMode configured and running."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F680}</span>
                          <span class="nav-item__text">Setup</span>
                          ${e.setupChecklist&&e.setupChecklist.percentComplete!=null?o`<span class="nav-item__badge">${e.setupChecklist.percentComplete}%</span>`:p}
                        </a>
                      `:p}
                ${d.tabs.map(L=>Au(e,L))}
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
              <span class="nav-item__icon" aria-hidden="true">${Y.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${c?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="setup"&&e.tab!=="people"&&e.tab!=="life"&&e.tab!=="data"&&e.tab!=="wheel-of-life"&&e.tab!=="vision-board"&&e.tab!=="lifetracks"?o`
              <div class="page-title">${qs(e.tab)}</div>
              <div class="page-sub">${eb(e.tab)}</div>
            `:e.tab==="chat"?o`
              <div class="session-tabs">
                ${fa(T,d=>d,(d,$)=>{const A=Ie(e.sessionsResult?.sessions,d),x=Ni(d,A)===_,E=(()=>{if(A?.label||A?.displayName)return Oi(A.label??A.displayName);const D=Te.get(d);if(D)return Oi(D);if(d==="agent:main:support")return"Support";if(d.includes("webchat")){const F=d.match(/webchat[:-](\d+)/);return F?`Chat ${F[1]}`:"Chat"}if(d.includes("main"))return"MAIN";const I=d.split(/[:-]/);return I[I.length-1]||d})(),z=T.length>1,V=e.workingSessions.has(d),H=e.settings.tabLastViewed[d]??0,j=A?.updatedAt??0,ae=!x&&!V&&j>H,me=e.editingTabKey===d;return o`
                      <div
                        class="session-tab ${x?"session-tab--active":""} ${V?"session-tab--working":""} ${ae?"session-tab--ready":""} ${me?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${D=>{if(e.editingTabKey===d){D.preventDefault();return}D.dataTransfer.effectAllowed="move",D.dataTransfer.setData("text/session-key",d),D.dataTransfer.setData("text/plain",$.toString()),D.target.classList.add("dragging")}}
                        @click=${()=>{if(!me){if(x){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}});return}Se(e),e.sessionKey=d,ze(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ye(e,d,!0),le(e),ne(e)}}}
                        @dragend=${D=>{D.target.classList.remove("dragging")}}
                        @dragover=${D=>{D.preventDefault(),D.dataTransfer.dropEffect="move";const I=D.currentTarget,F=I.getBoundingClientRect(),X=F.left+F.width/2;D.clientX<X?(I.classList.add("drop-left"),I.classList.remove("drop-right")):(I.classList.add("drop-right"),I.classList.remove("drop-left"))}}
                        @dragleave=${D=>{D.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${D=>{D.preventDefault();const I=parseInt(D.dataTransfer.getData("text/plain")),F=$;if(I===F)return;const X=e.settings.openTabs.slice(),[N]=X.splice(I,1);X.splice(F,0,N),e.applySettings({...e.settings,openTabs:X}),D.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${E}
                      >
                        ${me?o`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${A?.label??A?.displayName??""}
                            @click=${D=>D.stopPropagation()}
                            @dblclick=${D=>D.stopPropagation()}
                            @blur=${async D=>{const I=D.target;if(I._committedByEnter)return;const F=I.value.trim();e.editingTabKey=null;const X=A?.label??A?.displayName??"";if(F!==X){F?Te.set(d,F):Te.delete(d),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(B=>B.key===d?{...B,label:F||void 0,displayName:F||void 0}:B)});const N=await Ts(e,d,{label:F||null,displayName:F||null});ne(e);const Me=N.ok&&N.canonicalKey!==d?N.canonicalKey:d,ke=d===e.sessionKey;e.applySettings({...e.settings,...N.ok&&N.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(B=>B===d?N.canonicalKey:B)}:{},tabLastViewed:{...e.settings.tabLastViewed,[Me]:Date.now()},...ke&&N.ok&&N.canonicalKey!==d?{sessionKey:N.canonicalKey,lastActiveSessionKey:N.canonicalKey}:{}}),ke&&N.ok&&N.canonicalKey!==d&&(e.sessionKey=N.canonicalKey,ye(e,N.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}}
                            @keydown=${async D=>{if(D.key==="Enter"){D.preventDefault();const I=D.target;I._committedByEnter=!0;const F=I.value.trim();e.editingTabKey=null;const X=A?.label??A?.displayName??"";if(F!==X){F?Te.set(d,F):Te.delete(d),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(B=>B.key===d?{...B,label:F||void 0,displayName:F||void 0}:B)});const N=await Ts(e,d,{label:F||null,displayName:F||null});ne(e);const Me=N.ok&&N.canonicalKey!==d?N.canonicalKey:d,ke=d===e.sessionKey;e.applySettings({...e.settings,...N.ok&&N.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(B=>B===d?N.canonicalKey:B)}:{},tabLastViewed:{...e.settings.tabLastViewed,[Me]:Date.now()},...ke&&N.ok&&N.canonicalKey!==d?{sessionKey:N.canonicalKey,lastActiveSessionKey:N.canonicalKey}:{}}),ke&&N.ok&&N.canonicalKey!==d&&(e.sessionKey=N.canonicalKey,ye(e,N.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}else D.key==="Escape"&&(D.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let D=null;return o`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${I=>{I.stopPropagation(),D&&clearTimeout(D),D=setTimeout(()=>{D=null,e.editingTabKey!==d&&(d===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}):(Se(e),e.sessionKey=d,e.chatPrivateMode=!!e.privateSessions?.has(d),ze(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ye(e,d,!0),le(e),ne(e)))},250)}}
                            @dblclick=${I=>{I.preventDefault(),I.stopPropagation(),D&&(clearTimeout(D),D=null),e.editingTabKey=d;const F=I.target.closest(".session-tab"),X=N=>{const Me=N.target;F&&!F.contains(Me)&&(e.editingTabKey=null,document.removeEventListener("mousedown",X,!0))};document.addEventListener("mousedown",X,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const N=F?.querySelector(".session-tab__name-input");N&&(N.focus(),N.select())})})}}
                          >${E}</span>
                        `})()}
                        ${e.privateSessions?.has(d)?(()=>{const D=e.privateSessions.get(d),I=Math.max(0,D-Date.now()),F=Math.floor(I/36e5),X=Math.floor(I%36e5/6e4),N=F>0?`${F}h ${X}m`:`${X}m`;return o`
                                  <span class="session-tab__private" title="Private session — expires in ${N}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${N}</span
                                  >
                                `})():p}
                        ${V?o`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:p}
                        ${ae?o`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:p}
                        ${z?o`
                          <button
                            class="session-tab__close"
                            @click=${D=>{if(D.stopPropagation(),e.privateSessions?.has(d)){e._destroyPrivateSession(d);return}const I=e.settings.openTabs.filter(X=>X!==d),F=d===e.sessionKey;e.applySettings({...e.settings,openTabs:I,...F?{sessionKey:I[0],lastActiveSessionKey:I[0]}:{}}),F&&(e.sessionKey=I[0],ye(e,I[0],!0),le(e))}}
                            title=${e.privateSessions?.has(d)?"Destroy private session":"Close tab"}
                          >×</button>
                        `:p}
                      </div>
                    `})}
              `:p}
          </div>
          <div class="page-meta">
            ${e.reconnecting?o`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?o`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:p}
            ${c?Tu(e):p}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?L$({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"my-day",onViewModeChange:d=>e.handleTodayViewModeChange(d),focusPulseActive:w,onStartMorningSet:g?()=>e.handleFocusPulseStartMorning():void 0}):p}
          </div>
        </section>

        ${u?o`<button
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

        ${e.tab==="setup"?h2({connected:e.connected,quickSetupDone:e.setupQuickDone??!1,checklist:e.setupChecklist??null,checklistLoading:e.setupChecklistLoading??!1,onQuickSetup:(d,$,A)=>e.handleQuickSetup?.(d,$,A),onHideSetup:()=>e.handleHideSetup?.(),onOpenWizard:()=>e.handleWizardOpen?.(),onNavigate:d=>e.setTab(d),onRunAssessment:()=>e.handleRunAssessment?.(),onOpenSupportChat:()=>e.handleOpenSupportChat()}):p}

        ${e.tab==="overview"?n0({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:a,sessionsCount:i,cronEnabled:e.cronStatus?.enabled??null,cronNext:r,lastChannelsRefresh:e.channelsLastSuccess,updateStatus:e.updateStatus,updateLoading:e.updateLoading,updateError:e.updateError,updateLastChecked:e.updateLastChecked,updateRunning:e.updateRunning,onSettingsChange:d=>e.applySettings(d),onPasswordChange:d=>e.password=d,onSessionKeyChange:d=>{Se(e),e.sessionKey=d,ze(e,d),e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview(),onCheckUpdates:()=>Gm(e),onUpdateNow:()=>{yo(e)}}):p}

        ${e.tab==="workspaces"?w$({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",expandedFolders:e.workspaceExpandedFolders??new Set,loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:d=>e.workspacesSearchQuery=d,onItemSearch:d=>e.workspaceItemSearchQuery=d,onCreateWorkspace:async d=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:$,selectWorkspace:A}=await R(async()=>{const{createWorkspace:L,selectWorkspace:E}=await Promise.resolve().then(()=>pe);return{createWorkspace:L,selectWorkspace:E}},void 0,import.meta.url),x=await $(e,d);return x?(e.workspaceItemSearchQuery="",await A(e,x),e.showToast(`Created workspace: ${x.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onDeleteWorkspace:async d=>{const{deleteWorkspace:$,loadAllTasksWithQueueStatus:A}=await R(async()=>{const{deleteWorkspace:L,loadAllTasksWithQueueStatus:E}=await Promise.resolve().then(()=>pe);return{deleteWorkspace:L,loadAllTasksWithQueueStatus:E}},void 0,import.meta.url);if(!await $(e,d.id)){e.showToast(`Failed to delete ${d.name}`,"error");return}e.showToast(`Deleted workspace: ${d.name}`,"success"),e.allTasks=await A(e)},onSelectWorkspace:async d=>{e.workspaceItemSearchQuery="";const{selectWorkspace:$}=await R(async()=>{const{selectWorkspace:A}=await Promise.resolve().then(()=>pe);return{selectWorkspace:A}},void 0,import.meta.url);await $(e,d)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async d=>{const{readWorkspaceFile:$}=await R(async()=>{const{readWorkspaceFile:L}=await Promise.resolve().then(()=>pe);return{readWorkspaceFile:L}},void 0,import.meta.url),A=e.selectedWorkspace?.id,x=await $(e,d.path,A);if(!x){e.showToast(`Failed to open ${d.name}`,"error");return}e.handleOpenSidebar(x.content,{mimeType:x.mime,filePath:d.path,title:d.name})},onSessionClick:async d=>{if(!d.key)return;const $=d.key;Se(e),e.sessionKey=$,ze(e,$),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const A=e.settings.openTabs.includes($)?e.settings.openTabs:[...e.settings.openTabs,$];e.applySettings({...e.settings,openTabs:A,sessionKey:$,lastActiveSessionKey:$,tabLastViewed:{...e.settings.tabLastViewed,[$]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),ye(e,$,!0),le(e)},onPinToggle:async(d,$,A)=>{const{toggleWorkspacePin:x}=await R(async()=>{const{toggleWorkspacePin:E}=await Promise.resolve().then(()=>pe);return{toggleWorkspacePin:E}},void 0,import.meta.url);await x(e,d,$,A)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(d,$,A)=>{const{toggleWorkspaceSessionPin:x}=await R(async()=>{const{toggleWorkspaceSessionPin:E}=await Promise.resolve().then(()=>pe);return{toggleWorkspaceSessionPin:E}},void 0,import.meta.url);await x(e,d,$,A)||e.showToast("Failed to update session pin","error")},onToggleFolder:d=>{R(async()=>{const{toggleWorkspaceFolder:$}=await Promise.resolve().then(()=>pe);return{toggleWorkspaceFolder:$}},void 0,import.meta.url).then(({toggleWorkspaceFolder:$})=>{e.workspaceExpandedFolders=$(e.workspaceExpandedFolders??new Set,d),e.requestUpdate()})},onTeamSetup:async()=>{let d="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";try{const $=await e.client?.request("workspaces.teamSetupPrompt",{});$?.prompt&&(d=$.prompt)}catch{}e.handleStartChatWithPrompt(d)},allTasks:e.allTasks??[],taskFilter:e.taskFilter??"outstanding",taskSort:e.taskSort??"due",showCompletedTasks:e.showCompletedTasks??!1,onToggleTaskComplete:async(d,$)=>{const{toggleTaskComplete:A,loadAllTasksWithQueueStatus:x,getWorkspace:L}=await R(async()=>{const{toggleTaskComplete:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}=await Promise.resolve().then(()=>pe);return{toggleTaskComplete:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}},void 0,import.meta.url);if(!await A(e,d,$)){e.showToast("Failed to update task","error");return}if(e.allTasks=await x(e),e.selectedWorkspace){const z=await L(e,e.selectedWorkspace.id);z&&(e.selectedWorkspace=z)}},onCreateTask:async(d,$)=>{const{createTask:A,loadAllTasksWithQueueStatus:x,getWorkspace:L}=await R(async()=>{const{createTask:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}=await Promise.resolve().then(()=>pe);return{createTask:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}},void 0,import.meta.url),E=await A(e,d,$);if(!E){e.showToast("Failed to create task","error");return}if(e.showToast(`Task created: ${E.title}`,"success"),e.allTasks=await x(e),e.selectedWorkspace){const z=await L(e,e.selectedWorkspace.id);z&&(e.selectedWorkspace=z)}},onSetTaskFilter:d=>{e.taskFilter=d},onSetTaskSort:d=>{e.taskSort=d},onToggleCompletedTasks:()=>{e.showCompletedTasks=!(e.showCompletedTasks??!1)},editingTaskId:e.editingTaskId??null,workspaceNames:(e.workspaces??[]).map(d=>d.name),onStartTask:async d=>{const{startTask:$,loadAllTasksWithQueueStatus:A}=await R(async()=>{const{startTask:z,loadAllTasksWithQueueStatus:V}=await Promise.resolve().then(()=>pe);return{startTask:z,loadAllTasksWithQueueStatus:V}},void 0,import.meta.url),x=await $(e,d);if(!x?.sessionId){e.showToast("Failed to open session for task","error");return}Se(e);const L=x.sessionId;x.task?.title&&Te.set(L,x.task.title);const E=e.settings.openTabs.includes(L)?e.settings.openTabs:[...e.settings.openTabs,L];if(e.applySettings({...e.settings,openTabs:E,sessionKey:L,lastActiveSessionKey:L,tabLastViewed:{...e.settings.tabLastViewed,[L]:Date.now()}}),e.sessionKey=L,e.setTab("chat"),x.created&&!x.queueOutput){const z=e.allTasks??[],V=e.selectedWorkspace?.tasks??[],H=[...z,...V].find(ae=>ae.id===d),j=H?.project?` (project: ${H.project})`:"";e.chatMessage=`Let's work on: ${H?.title??"this task"}${j}`}else e.chatMessage="";e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,L,!0),await le(e),x.queueOutput&&e.chatMessages.length===0&&e.seedSessionWithAgentOutput(x.task?.title??"this task",x.queueOutput,x.agentPrompt??void 0),e.allTasks=await A(e),e.requestUpdate()},onEditTask:d=>{e.editingTaskId=d},onUpdateTask:async(d,$)=>{const{updateTask:A,loadAllTasksWithQueueStatus:x,getWorkspace:L}=await R(async()=>{const{updateTask:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}=await Promise.resolve().then(()=>pe);return{updateTask:z,loadAllTasksWithQueueStatus:V,getWorkspace:H}},void 0,import.meta.url);if(!await A(e,d,$)){e.showToast("Failed to update task","error");return}if(e.editingTaskId=null,e.allTasks=await x(e),e.selectedWorkspace){const z=await L(e,e.selectedWorkspace.id);z&&(e.selectedWorkspace=z)}},browsePath:e.workspaceBrowsePath??null,browseEntries:e.workspaceBrowseEntries??null,breadcrumbs:e.workspaceBreadcrumbs??null,browseSearchQuery:e.workspaceBrowseSearchQuery??"",browseSearchResults:e.workspaceBrowseSearchResults??null,onBrowseFolder:d=>e.handleWorkspaceBrowse(d),onBrowseSearch:d=>e.handleWorkspaceBrowseSearch(d),onBrowseBack:()=>e.handleWorkspaceBrowseBack(),onCreateFolder:d=>e.handleWorkspaceCreateFolder(d)}):p}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?st(e,"today"):E$({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:d=>e.handleBriefSave(d),onBriefToggleCheckbox:(d,$)=>e.handleBriefToggleCheckbox(d,$),onOpenFile:d=>{e.handleOpenFile(d)},selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"my-day",onViewModeChange:d=>e.handleTodayViewModeChange(d),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh(),focusPulseActive:w,onStartMorningSet:g?()=>e.handleFocusPulseStartMorning():void 0,todayTasks:e.todayTasks??[],todayTasksLoading:e.todayTasksLoading??!1,onToggleTaskComplete:(d,$)=>e.handleMyDayTaskStatusChange(d,$==="complete"?"pending":"complete"),onStartTask:d=>e.handleTodayStartTask(d),onCreateTask:d=>e.handleTodayCreateTask(d),onEditTask:d=>e.handleTodayEditTask(d),onUpdateTask:(d,$)=>e.handleTodayUpdateTask(d,$),editingTaskId:e.todayEditingTaskId,showCompletedTasks:e.todayShowCompleted,onToggleCompletedTasks:()=>e.handleTodayToggleCompleted()}):p}

        ${e.tab==="work"?e.dynamicSlots.work?st(e,"work"):S1({connected:e.connected,projects:e.workProjects??[],loading:e.workLoading??!1,error:e.workError??null,expandedProjects:e.workExpandedProjects,projectFiles:e.workProjectFiles??{},detailLoading:e.workDetailLoading??new Set,onRefresh:()=>e.handleWorkRefresh(),onToggleProject:d=>e.handleWorkToggleProject(d),onPersonClick:d=>e.handleWorkPersonClick(d),onFileClick:d=>e.handleWorkFileClick(d),onSkillClick:(d,$)=>e.handleWorkSkillClick(d,$)}):p}

        ${e.tab==="people"?e.dynamicSlots.people?st(e,"people"):r0({connected:e.connected,people:e.peopleList??[],loading:e.peopleLoading??!1,error:e.peopleError??null,selectedId:e.peopleSelected??null,searchQuery:e.peopleSearchQuery??"",onRefresh:()=>e.handlePeopleRefresh(),onSelectPerson:d=>e.handlePeopleSelect(d),onBack:()=>e.handlePeopleBack(),onSearchChange:d=>e.handlePeopleSearch(d),onImportContacts:d=>e.handlePeopleImport(d)}):p}

        ${e.tab==="life"?e.dynamicSlots.life?st(e,"life"):o`
                <div class="my-day-container" style="overflow-y: auto;">
                  <div class="my-day-header">
                    <div class="my-day-header-left">
                      <h1 class="my-day-title">Life</h1>
                      <p class="my-day-subtitle">Vision board, goals, life scores, and LifeTracks.</p>
                    </div>
                    <div class="my-day-header-right">
                      <button class="my-day-refresh-btn" @click=${()=>e.handleStartChatWithPrompt(e.lifeSubtab==="vision-board"?"Let's update my Vision Board":e.lifeSubtab==="goals"?"Let's review and update my goals":"Time for a Wheel of Life check-in")} title="Update via Chat">
                        💬 Update
                      </button>
                    </div>
                  </div>
                  <div class="life-subnav">
                    ${["vision-board","goals","wheel-of-life"].map(d=>{const $={"vision-board":"Vision Board",goals:"Goals","wheel-of-life":"Wheel of Life"},A=(e.lifeSubtab??"vision-board")===d;return o`
                        <button
                          class="life-subnav__item ${A?"active":""}"
                          @click=${()=>e.handleLifeSubtabChange(d)}
                        >${$[d]}</button>
                      `})}
                  </div>
                  <div class="life-subtab-content">
                    ${(e.lifeSubtab??"vision-board")==="vision-board"?tc({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's update my Vision Board — review my Chief Definite Aim, annual themes, values, and identity statements.")}):p}
                    ${(e.lifeSubtab??"vision-board")==="lifetracks"?zl({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:d=>e.handleLifetracksSelectTrack(d),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Time to update my LifeTracks — let's review my meditation and affirmation audio settings.")}):p}
                    ${e.lifeSubtab==="goals"?qk({connected:e.connected,goals:e.goals??[],loading:e.goalsLoading??!1,error:e.goalsError??null,onRefresh:()=>e.handleGoalsRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's review and update my goals")}):p}
                    ${e.lifeSubtab==="wheel-of-life"?nc({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:d=>e.handleWheelOfLifeSave(d),onCancel:()=>e.handleWheelOfLifeCancel(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's do a Wheel of Life check-in — rate my current satisfaction across all 8 life areas.")}):p}
                  </div>
                </div>
              `:p}

        ${e.tab==="data"?e.dynamicSlots.data?st(e,"data"):Ik({connected:e.connected,sources:e.dataSources??[],loading:e.dataLoading??!1,error:e.dataError??null,subtab:e.dataSubtab??"dashboard",onRefresh:()=>e.handleDataRefresh(),onSubtabChange:d=>e.handleDataSubtabChange(d),onConnectSource:d=>e.handleDataConnectSource(d),onQuerySubmit:d=>e.handleDataQuerySubmit(d)}):p}

        ${e.tab==="wheel-of-life"?e.dynamicSlots["wheel-of-life"]?st(e,"wheel-of-life"):nc({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:d=>e.handleWheelOfLifeSave(d),onCancel:()=>e.handleWheelOfLifeCancel()}):p}

        ${e.tab==="vision-board"?e.dynamicSlots["vision-board"]?st(e,"vision-board"):tc({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh()}):p}

        ${e.tab==="lifetracks"?e.dynamicSlots.lifetracks?st(e,"lifetracks"):zl({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:d=>e.handleLifetracksSelectTrack(d),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate()}):p}

        ${e.tab==="channels"?pw({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:d=>Pe(e,d),onWhatsAppStart:d=>e.handleWhatsAppStart(d),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(d,$)=>us(e,d,$),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(d,$)=>e.handleNostrProfileEdit(d,$),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(d,$)=>e.handleNostrProfileFieldChange(d,$),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):p}

        ${e.tab==="instances"?Hk({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Ar(e)}):p}

        ${e.tab==="sessions"?b0({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:d=>{e.sessionsFilterActive=d.activeMinutes,e.sessionsFilterLimit=d.limit,e.sessionsIncludeGlobal=d.includeGlobal,e.sessionsIncludeUnknown=d.includeUnknown},onRefresh:()=>{ne(e),Dt(e)},onPatch:async(d,$)=>{const A=await Ts(e,d,$);if(A.ok&&A.canonicalKey!==d&&e.settings.openTabs.includes(d)){const x=e.settings.openTabs.map(E=>E===d?A.canonicalKey:E),L=d===e.sessionKey;e.applySettings({...e.settings,openTabs:x,tabLastViewed:{...e.settings.tabLastViewed,[A.canonicalKey]:e.settings.tabLastViewed[d]??Date.now()},...L?{sessionKey:A.canonicalKey,lastActiveSessionKey:A.canonicalKey}:{}}),L&&(e.sessionKey=A.canonicalKey,ye(e,A.canonicalKey,!0))}},onDelete:d=>Ld(e,d),onArchive:d=>Ed(e,d),onUnarchive:d=>Rd(e,d),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Dt(e)},onAutoArchive:()=>Id(e)}):p}

        ${e.tab==="cron"?kk({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(d=>d.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:d=>e.cronForm={...e.cronForm,...d},onRefresh:()=>e.loadCron(),onAdd:()=>Qv(e),onToggle:(d,$)=>Yv(e,d,$),onRun:d=>Xv(e,d),onRemove:d=>Jv(e,d),onLoadRuns:d=>Gd(e,d)}):p}

        ${e.tab==="skills"?R0({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,onFilterChange:d=>e.skillsFilter=d,onRefresh:()=>Jn(e,{clearMessages:!0}),onToggle:(d,$)=>wy(e,d,$),onEdit:(d,$)=>by(e,d,$),onSaveKey:d=>ky(e,d),onInstall:(d,$,A)=>$y(e,d,$,A),onSubTabChange:d=>{e.skillsSubTab=d,d==="clawhub"&&!e.clawhubExploreItems&&kl(e)},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:d=>{e.clawhubQuery=d,Ob(e,d)},onExplore:d=>kl(e,d),onDetail:d=>Nb(e,d),onCloseDetail:()=>Fb(e),onImport:d=>$l(e,d),onImportAndPersonalize:async d=>{if(!await $l(e,d))return;const A=await Bb(e,d);A&&(Lr(e,"chat"),ga(e),e.chatMessage=A)}}}):p}

        ${e.tab==="nodes"?R$({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ia(e),onDevicesRefresh:()=>ht(e),onDeviceApprove:d=>Um(e,d),onDeviceReject:d=>zm(e,d),onDeviceRotate:(d,$,A)=>Km(e,{deviceId:d,role:$,scopes:A}),onDeviceRevoke:(d,$)=>Wm(e,{deviceId:d,role:$}),onLoadConfig:()=>Qe(e),onLoadExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Sr(e,d)},onBindDefault:d=>{d?us(e,["tools","exec","node"],d):bo(e,["tools","exec","node"])},onBindAgent:(d,$)=>{const A=["agents","list",d,"tools","exec","node"];$?us(e,A,$):bo(e,A)},onSaveBindings:()=>di(e),onExecApprovalsTargetChange:(d,$)=>{e.execApprovalsTarget=d,e.execApprovalsTargetNodeId=$,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:d=>{e.execApprovalsSelectedAgent=d},onExecApprovalsPatch:(d,$)=>ly(e,d,$),onExecApprovalsRemove:d=>cy(e,d),onSaveExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return oy(e,d)}}):p}

        ${t&&n>=2&&n<=5&&e.tab==="chat"?o2({phase:n,identity:s?.identity??null,tools:s?.tools??[],auditFindings:s?.audit?.findings??[],summary:s?.summary??null,onSkipPhase:()=>e.handleOnboardingSkipPhase?.()}):e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length&&!t?o`
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

        ${e.tab==="chat"&&e.settings.chatParallelView?m1({state:e,onAssignLane:(d,$)=>{const A=$?Ie(e.sessionsResult?.sessions,$)?.key??$:null,x=[...e.settings.parallelLanes];x[d]=A,e.applySettings({...e.settings,parallelLanes:x}),A&&e.client&&rr(e.client,A).then(()=>{e.applySettings({...e.settings})})},onReorderLanes:(d,$)=>{if(d===$||d<0||$<0||d>=e.settings.parallelLanes.length||$>=e.settings.parallelLanes.length)return;const A=[...e.settings.parallelLanes],[x]=A.splice(d,1);A.splice($,0,x),e.applySettings({...e.settings,parallelLanes:A})},onLaneViewed:d=>{const $=Ie(e.sessionsResult?.sessions,d)?.key??d,A=Date.now(),L=Ie(e.sessionsResult?.sessions,$)?.updatedAt??0,E=Math.max(e.settings.tabLastViewed[d]??0,e.settings.tabLastViewed[$]??0);L>0&&E>=L||e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:A,[$]:A}})},onSendInLane:(d,$)=>{d!==e.sessionKey?(Se(e),e.sessionKey=d,ze(e,d),e.chatLoading=!0,e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),ye(e,d,!0),le(e).then(()=>{e.chatMessage=$,e.handleSendChat($)})):(e.chatMessage=$,e.handleSendChat($))}}):p}

        ${e.tab==="chat"&&!e.settings.chatParallelView?tk({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:d=>{Se(e),e.sessionKey=d,ze(e,d),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),le(e),js(e)},thinkingLevel:e.chatThinkingLevel,showThinking:h,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:m,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:l,error:e.lastError,sessions:e.sessionsResult,focusMode:u,onRefresh:()=>(e.resetToolStream(),Promise.all([le(e),js(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:d=>e.handleChatScroll(d),onDraftChange:d=>e.chatMessage=d,attachments:e.chatAttachments,onAttachmentsChange:d=>e.chatAttachments=d,showToast:(d,$)=>e.showToast(d,$),onSend:d=>e.handleSendChat(void 0,{queue:d}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:d=>e.removeQueuedMessage(d),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,splitRatio:e.splitRatio,onOpenSidebar:(d,$)=>e.handleOpenSidebar(d,$),onMessageLinkClick:d=>e.handleOpenMessageFileLink(d),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenFile:d=>e.handleOpenFile(d),onSplitRatioChange:d=>e.handleSplitRatioChange(d),onImageClick:(d,$,A)=>e.handleImageClick(d,$,A),resolveImageUrl:(d,$)=>fv(e.sessionKey,d,$),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const d=document.querySelector(".chat-thread");d&&(d.scrollTo({top:d.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)}}):p}

        ${e.tab==="options"?iS({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(d,$)=>e.handleOptionToggle(d,$),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):p}

        ${e.tab==="guardrails"?YS({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(d,$)=>e.handleGuardrailToggle(d,$),onThresholdChange:(d,$,A)=>e.handleGuardrailThresholdChange(d,$,A),onCustomToggle:(d,$)=>e.handleCustomGuardrailToggle(d,$),onCustomDelete:d=>e.handleCustomGuardrailDelete(d),onCustomAdd:d=>e.handleCustomGuardrailAdd(d),onToggleAddForm:()=>e.handleToggleGuardrailAddForm()}):p}

        ${e.tab==="mission-control"?d1({connected:e.connected,loading:e.missionControlLoading,error:e.missionControlError,data:e.missionControlData??null,onRefresh:()=>e.handleMissionControlRefresh(),onCancelTask:d=>e.handleMissionControlCancelTask(d),onApproveItem:d=>e.handleMissionControlApproveItem(d),onRetryItem:d=>e.handleMissionControlRetryItem(d),onViewDetail:d=>e.handleMissionControlViewDetail(d),onOpenSession:d=>e.handleMissionControlOpenSession(d),onOpenTaskSession:d=>e.handleMissionControlOpenTaskSession(d),onStartQueueItem:d=>e.handleMissionControlStartQueueItem(d)}):p}

        ${e.tab==="trust"?KS({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:d=>e.handleTrustAddWorkflow(d),onRemoveWorkflow:d=>e.handleTrustRemoveWorkflow(d),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:i,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(d,$)=>e.handleDailyRate(d,$),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):p}

        ${e.tab==="second-brain"?z1({connected:e.connected,loading:e.secondBrainLoading??!1,error:e.secondBrainError??null,subtab:e.secondBrainSubtab??"identity",identity:e.secondBrainIdentity??null,memoryBank:e.secondBrainMemoryBank??null,aiPacket:e.secondBrainAiPacket??null,sourcesData:e.secondBrainSourcesData??null,selectedEntry:e.secondBrainSelectedEntry??null,searchQuery:e.secondBrainSearchQuery??"",syncing:e.secondBrainSyncing??!1,browsingFolder:e.secondBrainBrowsingFolder??null,folderEntries:e.secondBrainFolderEntries??null,folderName:e.secondBrainFolderName??null,onSubtabChange:d=>e.handleSecondBrainSubtabChange(d),onSelectEntry:d=>e.handleSecondBrainSelectEntry(d),onOpenInBrowser:d=>e.handleSecondBrainOpenInBrowser(d),onBrowseFolder:d=>e.handleSecondBrainBrowseFolder(d),onBack:()=>e.handleSecondBrainBack(),onSearch:d=>e.handleSecondBrainSearch(d),onSync:()=>e.handleSecondBrainSync(),onRefresh:()=>e.handleSecondBrainRefresh(),onOpenSidebar:(d,$)=>e.handleOpenSidebar(d,$),researchData:e.secondBrainResearchData??null,researchAddFormOpen:e.secondBrainResearchAddFormOpen??!1,researchAddForm:e.secondBrainResearchAddForm,researchCategories:e.secondBrainResearchCategories??[],onResearchAddFormToggle:()=>e.handleResearchAddFormToggle(),onResearchAddFormChange:(d,$)=>e.handleResearchAddFormChange(d,$),onResearchAddSubmit:()=>e.handleResearchAddSubmit(),onSaveViaChat:()=>e.handleResearchSaveViaChat(),communityResources:e.secondBrainCommunityResources??null,communityResourceAddFormOpen:e.secondBrainCommunityResourceAddFormOpen??!1,communityResourceAddForm:e.secondBrainCommunityResourceAddForm,onCommunityResourceAdd:()=>e.handleCommunityResourceAdd(),onCommunityResourceRemove:d=>e.handleCommunityResourceRemove(d),onCommunityResourceAddFormToggle:()=>e.handleCommunityResourceAddFormToggle(),onCommunityResourceAddFormChange:(d,$)=>e.handleCommunityResourceAddFormChange(d,$),onAddSource:()=>e.handleAddSource(),fileTree:e.secondBrainFileTree??null,fileTreeLoading:e.secondBrainFileTreeLoading??!1,fileSearchQuery:e.secondBrainFileSearchQuery??"",fileSearchResults:e.secondBrainFileSearchResults??null,onFileTreeRefresh:()=>e.handleSecondBrainFileTreeRefresh(),onFileSearch:d=>e.handleSecondBrainFileSearch(d),onFileSelect:d=>e.handleSecondBrainFileSelect(d),intelProps:(e.secondBrainSubtab??"identity")==="intel"?{insights:e.intelInsights??[],discoveries:e.intelDiscoveries??[],patterns:e.intelPatterns??null,status:e.intelStatus??null,loading:e.intelLoading??!1,error:e.intelError??null,onDismiss:d=>e.handleIntelDismiss(d),onAct:d=>e.handleIntelAct(d),onRefresh:()=>e.handleIntelRefresh()}:void 0,vaultHealth:e.secondBrainVaultHealth??null}):p}

        ${e.tab==="dashboards"?e.dynamicSlots.dashboards?o`<div class="dynamic-slot">${_e(na(e.dynamicSlots.dashboards))}</div>`:X1({connected:e.connected,loading:e.dashboardsLoading??!1,error:e.dashboardsError??null,dashboards:e.dashboardsList,activeDashboardId:e.activeDashboardId??null,activeDashboardHtml:e.activeDashboardHtml??null,activeDashboardManifest:e.activeDashboardManifest??null,isWorking:e.activeDashboardManifest?.sessionId?e.workingSessions.has(e.activeDashboardManifest.sessionId):!1,onSelectDashboard:d=>e.handleDashboardSelect(d),onDeleteDashboard:d=>e.handleDashboardDelete(d),onCreateViaChat:()=>e.handleDashboardCreateViaChat(),onBack:()=>e.handleDashboardBack(),onRefresh:()=>e.handleDashboardsRefresh(),onOpenSession:d=>e.handleDashboardOpenSession(d),chatOpen:e.dashboardChatOpen??!1,chatMessages:e.activeDashboardManifest?e.chatMessages:[],chatStream:e.activeDashboardManifest?e.chatStream:null,chatMessage:e.chatMessage,chatSending:e.chatSending,assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,onToggleChat:()=>{const d=e;d.dashboardChatOpen=!d.dashboardChatOpen,d.requestUpdate()},onChatMessageChange:d=>{e.setChatMessage(d)},onChatSend:()=>{e.handleSendChat()}}):p}

        ${e.tab==="config"?uk({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:d=>{e.configRaw=d},onFormModeChange:d=>e.configFormMode=d,onFormPatch:(d,$)=>us(e,d,$),onSearchChange:d=>e.configSearchQuery=d,onSectionChange:d=>{e.configActiveSection=d,e.configActiveSubsection=null},onSubsectionChange:d=>e.configActiveSubsection=d,onReload:()=>Qe(e),onSave:()=>di(e),onApply:()=>Gp(e),onUpdate:()=>yo(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(d,$)=>e.handleUpdateUserProfile(d,$)}):p}

        ${e.tab==="debug"?Pk({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:d=>e.debugCallMethod=d,onCallParamsChange:d=>e.debugCallParams=d,onRefresh:()=>ra(e),onCall:()=>Rv(e)}):p}

        ${e.tab==="logs"?a$({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:d=>e.logsFilterText=d,onLevelToggle:(d,$)=>{e.logsLevelFilters={...e.logsLevelFilters,[d]:$}},onToggleAutoFollow:d=>e.logsAutoFollow=d,onRefresh:()=>mr(e,{reset:!0}),onExport:(d,$)=>e.exportLogs(d,$),onScroll:d=>e.handleLogsScroll(d)}):p}
      </main>
      ${Dk(e)}
      ${Ok(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?o`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Mu({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:d=>e.handleOpenFile(d)})}
              </div>
            </div>
          `:p}
      ${K0({toasts:e.toasts,onDismiss:d=>e.dismissToast(d)})}
      ${U0(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:d=>e.handleLightboxNav(d)})}
    </div>
  `}async function fn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.getState",{});e.focusPulseData=t}catch{e.focusPulseData=null}}async function b2(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.startMorningSet",{});e.showToast(t.message,"info",4e3),await fn(e)}catch(t){e.showToast("Failed to start morning set","error"),console.error("[FocusPulse] startMorningSet error:",t)}}async function w2(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("focusPulse.setFocus",{index:t});e.showToast(n.message,"success",3e3),await fn(e)}catch(n){e.showToast("Failed to set focus","error"),console.error("[FocusPulse] setFocus error:",n)}}async function k2(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.complete",{});e.showToast(t.message,"success",4e3),await fn(e)}catch(t){e.showToast("Failed to complete focus","error"),console.error("[FocusPulse] completeFocus error:",t)}}async function $2(e){if(!(!e.client||!e.connected))try{await e.client.request("focusPulse.pulseCheck",{}),await fn(e)}catch(t){console.error("[FocusPulse] pulseCheck error:",t)}}async function S2(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.endDay",{});e.showToast(t.message,"info",5e3),await fn(e)}catch(t){e.showToast("Failed to end day","error"),console.error("[FocusPulse] endDay error:",t)}}async function Ur(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function rp(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await Ur(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function A2(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await rp(e,[...n,t.trim()])}async function T2(e,t){const n=e.trustTrackerData?.workflows??[];await rp(e,n.filter(s=>s!==t))}async function x2(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await Ur(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const _2=6e4,pc=15,hc=new Set;let Ls=null;async function fc(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+pc*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const a of s.events??[]){if(hc.has(a.id))continue;const i=new Date(a.startTime),r=Math.round((i.getTime()-t.getTime())/6e4);if(r>0&&r<=pc){hc.add(a.id);const l=i.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),c=a.location?` @ ${a.location}`:"",u=`${a.title} starts in ${r} min (${l})${c}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function C2(e){op(),fc(e),Ls=setInterval(()=>{fc(e)},_2)}function op(){Ls&&(clearInterval(Ls),Ls=null)}let L2=0;function E2(e,t="info",n=3e3){return{id:`toast-${Date.now()}-${L2++}`,message:e,type:t,duration:n,createdAt:Date.now()}}function R2(e,t){return e.filter(n=>n.id!==t)}function I2(e,t){return[...e,t]}var P2=Object.defineProperty,M2=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var a=s>1?void 0:s?M2(t,n):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(a=(s?r(t,n,a):r(a))||a);return s&&a&&P2(t,n,a),a};function ci(){return rm()}function ws(){return lm()}function D2(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}const gc=new Set(["chat","today","workspaces","work","people","life","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","wheel-of-life","vision-board","lifetracks","my-day"]),O2=["path","filePath","file","workspacePath"];let v=class extends en{constructor(){super(...arguments),this.settings=tb(),this.password="",this.tab="chat",this.onboarding=D2(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=ci().name,this.assistantAvatar=ci().avatar,this.assistantAgentId=ci().agentId??null,this.userName=ws().name,this.userAvatar=ws().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.splitRatio=this.settings.splitRatio,this.lightbox=Xu(),this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...vb},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupChecklist=null,this.setupChecklistLoading=!1,this.setupQuickDone=!1,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=te(),this.todayViewMode="my-day",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.lifeSubtab="vision-board",this.goalsLoading=!1,this.goalsError=null,this.dataLoading=!1,this.dataError=null,this.dataSubtab="dashboard",this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.peopleLoading=!1,this.peopleError=null,this.peopleSelected=null,this.peopleSearchQuery="",this.wheelOfLifeLoading=!1,this.wheelOfLifeError=null,this.wheelOfLifeEditMode=!1,this.visionBoardLoading=!1,this.visionBoardError=null,this.lifetracksLoading=!1,this.lifetracksError=null,this.lifetracksGenerating=!1,this.lifetracksGenerationError=null,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="my-skills",this.clawhubQuery="",this.clawhubResults=null,this.clawhubExploreItems=null,this.clawhubExploreSort="trending",this.clawhubLoading=!1,this.clawhubError=null,this.clawhubDetailSlug=null,this.clawhubDetail=null,this.clawhubImporting=null,this.clawhubMessage=null,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...mb},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainResearchAddFormOpen=!1,this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""},this.secondBrainResearchCategories=[],this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.intelInsights=[],this.intelDiscoveries=[],this.intelPatterns=null,this.intelStatus=null,this.intelLoading=!1,this.intelError=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.agentLogPollInterval=null,this.agentLogUnsub=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>vu(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const e=ws();this.userName=e.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const e=ws();this.userAvatar=e.avatar}Rb(this),this.agentLogPollInterval==null&&(this.agentLogPollInterval=window.setInterval(()=>{!this.connected||!(this.tab==="today"||this.tab==="my-day")||this.todayViewMode!=="agent-log"||Tt(this)},6e4)),!this.agentLogUnsub&&this.client&&(this.agentLogUnsub=tu(this.client,()=>{this.todayViewMode==="agent-log"&&Tt(this)})),C2(this),this._restorePrivateSessions()}firstUpdated(){Ib(this)}disconnectedCallback(){op(),this._stopPrivateSessionTimer(),this.agentLogPollInterval!=null&&(clearInterval(this.agentLogPollInterval),this.agentLogPollInterval=null),this.agentLogUnsub&&(this.agentLogUnsub(),this.agentLogUnsub=null),Pb(this),super.disconnectedCallback()}updated(e){Db(this,e)}connect(){gr(this)}handleChatScroll(e){uh(this,e)}handleLogsScroll(e){ph(this,e)}exportLogs(e,t){hh(e,t)}resetToolStream(){Hi(this)}resetChatScroll(){Rc(this)}async loadAssistantIdentity(){await id(this)}applySettings(e){Ye(this,e)}setTab(e){Lr(this,e)}setTheme(e,t){uu(this,e,t)}async loadOverview(){await Ir(this)}async loadCron(){await ha(this)}async handleAbortChat(){await Pr(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await fn(this)}async handleFocusPulseStartMorning(){await b2(this),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, then help me review priorities and pick my #1 focus to lock in.",{createNewSession:t}=await R(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>bt);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await w2(this,e)}async handleFocusPulseComplete(){await k2(this)}async handleFocusPulsePulseCheck(){await $2(this)}async handleFocusPulseEndDay(){await S2(this)}async handleTrustLoad(){await Ur(this)}async handleTrustAddWorkflow(e){await A2(this,e)}async handleTrustRemoveWorkflow(e){await T2(this,e)}async handleDailyRate(e,t){await x2(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await R(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>Qt);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await R(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>Qt);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await R(async()=>{const{updateGuardrailThreshold:a}=await Promise.resolve().then(()=>Qt);return{updateGuardrailThreshold:a}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await R(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>Qt);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await R(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>Qt);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await R(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>Qt);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}async handleMissionControlRefresh(){const{loadMissionControl:e}=await R(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>Gt);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await R(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>Gt);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await R(async()=>{const{approveCodingTask:a,approveQueueItem:i}=await Promise.resolve().then(()=>Gt);return{approveCodingTask:a,approveQueueItem:i}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await R(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>Gt);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await R(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>Gt);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>at);return{loadChatHistory:s}},void 0,import.meta.url);await n(this)}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>vs);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;const s=[`A GodMode agent already worked on this task: **${e}**`];if(n){const i=n.match(/## Task\n([\s\S]*?)(?=\n## |$)/);i&&s.push("","**What the agent was asked to do:**",i[1].trim())}s.push("","**Agent's output:**","",t,"","---","","I'm reviewing this. Help me understand the output, flag anything that needs attention, and suggest what to do next.");const a=s.join(`
`);try{const{sendChatMessage:i}=await R(async()=>{const{sendChatMessage:r}=await Promise.resolve().then(()=>at);return{sendChatMessage:r}},void 0,import.meta.url);await i(this,a)}catch(i){console.error("[Session] Failed to seed session with agent output:",i)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await R(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>Gt);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await R(async()=>{const{loadDashboards:t}=await import("./dashboards-BWn_hwxU.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await R(async()=>{const{loadDashboard:n}=await import("./dashboards-BWn_hwxU.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:a}=await R(async()=>{const{autoTitleCache:l}=await Promise.resolve().then(()=>vs);return{autoTitleCache:l}},void 0,import.meta.url);a.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:i}=await R(async()=>{const{saveDraft:l}=await Promise.resolve().then(()=>Ja);return{saveDraft:l}},void 0,import.meta.url);i(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:r}=await R(async()=>{const{loadChatHistory:l}=await Promise.resolve().then(()=>at);return{loadChatHistory:l}},void 0,import.meta.url);await r(this),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await R(async()=>{const{deleteDashboard:n}=await import("./dashboards-BWn_hwxU.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>bt);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,R(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>Ja);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,R(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>at);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await R(async()=>{const{syncUrlWithSessionKey:a}=await Promise.resolve().then(()=>ub);return{syncUrlWithSessionKey:a}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await R(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await R(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await R(async()=>{const{loadSecondBrain:t}=await import("./second-brain-nWUdvmOD.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,e==="intel"?this.handleIntelLoad().catch(t=>{console.error("[Intel] Load after subtab change failed:",t),this.intelError=t instanceof Error?t.message:"Failed to load intel data"}):e==="files"?this.handleSecondBrainFileTreeRefresh().catch(t=>{console.error("[SecondBrain] File tree load after subtab change failed:",t)}):this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await R(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-nWUdvmOD.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainOpenInBrowser(e){try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=new Blob([t.content],{type:"text/html"}),s=URL.createObjectURL(n);window.open(s,"_blank","noopener,noreferrer")}}catch(t){console.error("[SecondBrain] Failed to open in browser:",t)}}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await R(async()=>{const{browseFolder:n}=await import("./second-brain-nWUdvmOD.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await R(async()=>{const{syncSecondBrain:t}=await import("./second-brain-nWUdvmOD.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}async handleSecondBrainFileTreeRefresh(){if(!(!this.client||!this.connected)){this.secondBrainFileTreeLoading=!0;try{const e=await this.client.request("secondBrain.fileTree",{depth:4});this.secondBrainFileTree=e.tree??[]}catch(e){console.error("[SecondBrain] fileTree failed:",e)}finally{this.secondBrainFileTreeLoading=!1}}}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}handleResearchAddFormToggle(){this.secondBrainResearchAddFormOpen=!this.secondBrainResearchAddFormOpen,this.secondBrainResearchAddFormOpen&&(this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""})}handleResearchAddFormChange(e,t){this.secondBrainResearchAddForm={...this.secondBrainResearchAddForm,[e]:t}}async handleResearchAddSubmit(){const{addResearch:e}=await R(async()=>{const{addResearch:t}=await import("./second-brain-nWUdvmOD.js");return{addResearch:t}},[],import.meta.url);await e(this)}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>bt);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>bt);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}async handleCommunityResourceAdd(){const{addCommunityResource:e}=await R(async()=>{const{addCommunityResource:t}=await import("./second-brain-nWUdvmOD.js");return{addCommunityResource:t}},[],import.meta.url);await e(this)}async handleCommunityResourceRemove(e){const{removeCommunityResource:t}=await R(async()=>{const{removeCommunityResource:n}=await import("./second-brain-nWUdvmOD.js");return{removeCommunityResource:n}},[],import.meta.url);await t(this,e)}handleCommunityResourceAddFormToggle(){this.secondBrainCommunityResourceAddFormOpen=!this.secondBrainCommunityResourceAddFormOpen,this.secondBrainCommunityResourceAddFormOpen&&(this.secondBrainCommunityResourceAddForm={url:"",label:"",description:"",tags:""})}handleCommunityResourceAddFormChange(e,t){this.secondBrainCommunityResourceAddForm={...this.secondBrainCommunityResourceAddForm,[e]:t}}async handleIntelLoad(){const{loadInsights:e,loadDiscoveries:t,loadUserPatterns:n,loadStatus:s}=await R(async()=>{const{loadInsights:i,loadDiscoveries:r,loadUserPatterns:l,loadStatus:c}=await import("./proactive-intel-BU5IobT1.js");return{loadInsights:i,loadDiscoveries:r,loadUserPatterns:l,loadStatus:c}},[],import.meta.url),a={client:this.client,connected:this.connected,insights:this.intelInsights??[],discoveries:this.intelDiscoveries??[],patterns:this.intelPatterns??null,status:this.intelStatus??null,loading:!1,error:null};await Promise.all([e(a),t(a),n(a),s(a)]),this.intelInsights=a.insights,this.intelDiscoveries=a.discoveries,this.intelPatterns=a.patterns,this.intelStatus=a.status,this.intelLoading=a.loading,this.intelError=a.error}async handleIntelDismiss(e){const{dismissInsight:t}=await R(async()=>{const{dismissInsight:s}=await import("./proactive-intel-BU5IobT1.js");return{dismissInsight:s}},[],import.meta.url),n={client:this.client,connected:this.connected,insights:this.intelInsights??[],discoveries:this.intelDiscoveries??[],patterns:this.intelPatterns??null,status:this.intelStatus??null,loading:!1,error:null};await t(n,e),this.intelInsights=n.insights}async handleIntelAct(e){const{actOnInsight:t}=await R(async()=>{const{actOnInsight:s}=await import("./proactive-intel-BU5IobT1.js");return{actOnInsight:s}},[],import.meta.url),n={client:this.client,connected:this.connected,insights:this.intelInsights??[],discoveries:this.intelDiscoveries??[],patterns:this.intelPatterns??null,status:this.intelStatus??null,loading:!1,error:null};await t(n,e),this.intelInsights=n.insights}async handleIntelRefresh(){this.intelLoading=!0;const{forceRefresh:e}=await R(async()=>{const{forceRefresh:n}=await import("./proactive-intel-BU5IobT1.js");return{forceRefresh:n}},[],import.meta.url),t={client:this.client,connected:this.connected,insights:this.intelInsights??[],discoveries:this.intelDiscoveries??[],patterns:this.intelPatterns??null,status:this.intelStatus??null,loading:!0,error:null};await e(t),this.intelInsights=t.insights,this.intelDiscoveries=t.discoveries,this.intelPatterns=t.patterns,this.intelStatus=t.status,this.intelLoading=!1,this.intelError=t.error}removeQueuedMessage(e){ku(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,a=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((a>0?s/a:0)>=.9&&!this.compactionStatus?.active){const r=(e??this.chatMessage).trim(),l=e==null?[...this.chatAttachments??[]]:[];if(r||l.length>0){this.pendingRetry={message:r,attachments:l,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:r}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await $u(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Jp(this,e)}async handleWhatsAppWait(){await Zp(this)}async handleWhatsAppLogout(){await eh(this)}async handleChannelConfigSave(){await th(this)}async handleChannelConfigReload(){await nh(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await ld(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){ah(this,e,t)}handleNostrProfileCancel(){ih(this)}handleNostrProfileFieldChange(e,t){rh(this,e,t)}async handleNostrProfileSave(){await lh(this)}async handleNostrProfileImport(){await ch(this)}handleNostrProfileToggleAdvanced(){oh(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,Ye(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("files.read",{path:e}),n=e.split(".").pop()?.toLowerCase()??"",s=t.contentType??t.mime??(n==="md"?"text/markdown":null),a=e.split("/").pop()??e;this.handleOpenSidebar(t.content,{mimeType:s,filePath:e,title:a}),t.truncated&&this.showToast(`Opened truncated file: ${e}`,"warning")}catch(t){console.error("[Chat] Failed to open file:",t),this.showToast(`Failed to open file: ${e}`,"error")}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=M0(e,t,n)}handleLightboxClose(){this.lightbox=D0()}handleLightboxNav(e){this.lightbox=O0(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const a=s.trim();!a||t.has(a)||(t.add(a),e.push(a))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const a of s.workspaces??[])n(a.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];const a=/^[a-z][a-z0-9+.-]*:/i.test(t),i=/^[a-z]:[\\/]/i.test(t);(!a||i)&&n.push(t);let r=null;try{r=new URL(t,window.location.href)}catch{r=null}if(r&&/^https?:$/.test(r.protocol)&&r.origin===window.location.origin){for(const w of O2){const S=r.searchParams.get(w);S&&n.push(S)}const h=(t.split("#")[0]??"").split("?")[0]??"";h.length>0&&!h.startsWith("/")&&!h.includes("://")&&n.push(h);let m=r.pathname;this.basePath&&m.startsWith(`${this.basePath}/`)?m=m.slice(this.basePath.length):this.basePath&&m===this.basePath&&(m="");const g=m.startsWith("/")?m.slice(1):m;if(g){n.push(g);const w=g.indexOf("/");if(w>0){const S=g.slice(0,w).toLowerCase();gc.has(S)&&n.push(g.slice(w+1))}}if(m.startsWith("/")&&g){const w=g.split("/")[0]?.toLowerCase()??"";gc.has(w)||n.push(m)}}const l=[],c=new Set;for(const u of n){let h=u;try{h=decodeURIComponent(u)}catch{}const f=this.normalizeWorkspacePathCandidate(h,{allowAbsolute:!0});!f||c.has(f)||(c.add(f),l.push(f))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=3e3){const s=E2(e,t,n);this.toasts=I2(this.toasts,s),n>0&&window.setTimeout(()=>{this.dismissToast(s.id)},n)}dismissToast(e){this.toasts=R2(this.toasts,e)}async handleMyDayRefresh(){if(this.todayViewMode==="agent-log"){await Tt(this,{refresh:!0});return}await Ks(this)}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Xa);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:te(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await R(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>Xa);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Xa);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:i}=await R(async()=>{const{autoTitleCache:r}=await Promise.resolve().then(()=>vs);return{autoTitleCache:r}},void 0,import.meta.url);i.set(n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:a}=await R(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>at);return{loadChatHistory:i}},void 0,import.meta.url);await a(this),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");if(e.setDate(e.getDate()-1),this.todaySelectedDate=te(e),this.todayViewMode==="agent-log"){Tt(this);return}xs(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=te(),n=te(e);if(!(n>t)){if(this.todaySelectedDate=n,this.todayViewMode==="agent-log"){Tt(this);return}xs(this)}}handleDateToday(){this.todaySelectedDate=te(),Ks(this)}async handleDailyBriefRefresh(){await xs(this)}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;eu(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e,e==="agent-log"&&!this.agentLog&&Tt(this)}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),R(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>bt);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(a=>a!==e),s=n[0]||"agent:main:main";this.applySettings({...this.settings,openTabs:n.length>0?n:["agent:main:main"],sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await R(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>at);return{loadChatHistory:a}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{}),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,a])=>a>n);if(this.privateSessions=new Map(s),s.length!==t.length){const a=t.filter(([,i])=>i<=n);for(const[i]of a)this._destroyPrivateSession(i)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await su(this)}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||Ty(this,e)),this.workExpandedProjects=t}handleWorkPersonClick(e){this.peopleSelected=e,this.setTab("people")}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}async handlePeopleRefresh(){await nu(this)}handlePeopleSelect(e){this.peopleSelected=e}handlePeopleBack(){this.peopleSelected=null}handlePeopleSearch(e){this.peopleSearchQuery=e}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await da(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await R(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>pe);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await R(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>pe);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await R(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>pe);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}async handleWheelOfLifeRefresh(){await Ws(this)}handleWheelOfLifeEdit(){Ay(this)}handleWheelOfLifeCancel(){fl(this)}async handleWheelOfLifeSave(e){await Sy(this,e),fl(this)}async handleVisionBoardRefresh(){await Ri(this)}async handleLifetracksRefresh(){await zs(this)}handleLifetracksSelectTrack(e){dy(this,e)}async handleLifetracksEnable(){await uy(this)}async handleLifetracksGenerate(){await py(this)}handleLifeSubtabChange(e){this.lifeSubtab=e,e==="goals"&&!this.goals&&!this.goalsLoading&&this.handleGoalsRefresh()}async handleGoalsRefresh(){if(!(!this.client||!this.connected)){this.goalsLoading=!0,this.goalsError=null;try{const e=await this.client.request("goals.get",{});this.goals=e.goals??[]}catch(e){this.goalsError=e instanceof Error?e.message:"Failed to load goals",console.error("[Goals] Load error:",e)}finally{this.goalsLoading=!1}}}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>bt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>bt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}R(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>Ja);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>vs);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>at);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(a=>{console.error("[Support] Failed to load chat history:",a)})})}handleWizardOpen(){R(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>kS);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const e=await this.client.request("onboarding.wizard.preview",this.wizardState.answers);this.wizardState={...this.wizardState,preview:e.files??[]},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}async handleWizardGenerate(){if(!(!this.client||!this.wizardState)){this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();try{const e=await this.client.request("onboarding.wizard.generate",this.wizardState.answers);this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:e.filesCreated,filesSkipped:e.filesSkipped,configPatched:e.configPatched,workspacePath:e.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(e){const t=e instanceof Error?e.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:t},this.requestUpdate(),this.showToast(t,"error")}}}async handleQuickSetup(e,t,n){R(()=>import("./setup-DDvbMoK2.js"),[],import.meta.url).then(async({quickSetup:s})=>{await s(this,e,t,n)&&(this.setTab("chat"),R(async()=>{const{loadChecklist:i}=await import("./setup-DDvbMoK2.js");return{loadChecklist:i}},[],import.meta.url).then(({loadChecklist:i})=>i(this)))})}handleLoadSetupChecklist(){R(async()=>{const{loadChecklist:e}=await import("./setup-DDvbMoK2.js");return{loadChecklist:e}},[],import.meta.url).then(({loadChecklist:e})=>e(this))}handleHideSetup(){R(async()=>{const{hideSetup:e}=await import("./setup-DDvbMoK2.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadSetupChecklist()})}async handleDataRefresh(){if(!(!this.client||!this.connected)){this.dataLoading=!0,this.dataError=null;try{const e=await this.client.request("dataSources.list",{});this.dataSources=e.sources??[]}catch(e){this.dataError=e instanceof Error?e.message:"Failed to load data sources",console.error("[Data] Load error:",e)}finally{this.dataLoading=!1}}}handleDataSubtabChange(e){this.dataSubtab=e}handleDataConnectSource(e){const n=this.dataSources?.find(s=>s.id===e)?.name??e;this.handleStartChatWithPrompt(`Help me connect and configure the ${n} integration.`)}handleDataQuerySubmit(e){this.handleStartChatWithPrompt(`Query my connected data: ${e}`)}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}render(){return y2(this)}};y([b()],v.prototype,"settings",2);y([b()],v.prototype,"password",2);y([b()],v.prototype,"tab",2);y([b()],v.prototype,"onboarding",2);y([b()],v.prototype,"connected",2);y([b()],v.prototype,"reconnecting",2);y([b()],v.prototype,"reconnectAttempt",2);y([b()],v.prototype,"theme",2);y([b()],v.prototype,"themeResolved",2);y([b()],v.prototype,"hello",2);y([b()],v.prototype,"lastError",2);y([b()],v.prototype,"eventLog",2);y([b()],v.prototype,"assistantName",2);y([b()],v.prototype,"assistantAvatar",2);y([b()],v.prototype,"assistantAgentId",2);y([b()],v.prototype,"userName",2);y([b()],v.prototype,"userAvatar",2);y([b()],v.prototype,"sessionKey",2);y([b()],v.prototype,"sessionPickerOpen",2);y([b()],v.prototype,"sessionPickerPosition",2);y([b()],v.prototype,"sessionPickerSearch",2);y([b()],v.prototype,"sessionSearchOpen",2);y([b()],v.prototype,"sessionSearchPosition",2);y([b()],v.prototype,"sessionSearchQuery",2);y([b()],v.prototype,"sessionSearchResults",2);y([b()],v.prototype,"sessionSearchLoading",2);y([b()],v.prototype,"profilePopoverOpen",2);y([b()],v.prototype,"profileEditName",2);y([b()],v.prototype,"profileEditAvatar",2);y([b()],v.prototype,"editingTabKey",2);y([b()],v.prototype,"chatLoading",2);y([b()],v.prototype,"chatSending",2);y([b()],v.prototype,"chatSendingSessionKey",2);y([b()],v.prototype,"chatMessage",2);y([b()],v.prototype,"chatDrafts",2);y([b()],v.prototype,"chatMessages",2);y([b()],v.prototype,"chatToolMessages",2);y([b()],v.prototype,"chatStream",2);y([b()],v.prototype,"chatStreamStartedAt",2);y([b()],v.prototype,"chatRunId",2);y([b()],v.prototype,"currentToolName",2);y([b()],v.prototype,"currentToolInfo",2);y([b()],v.prototype,"workingSessions",2);y([b()],v.prototype,"compactionStatus",2);y([b()],v.prototype,"chatAvatarUrl",2);y([b()],v.prototype,"chatThinkingLevel",2);y([b()],v.prototype,"chatQueue",2);y([b()],v.prototype,"chatAttachments",2);y([b()],v.prototype,"pendingRetry",2);y([b()],v.prototype,"autoRetryAfterCompact",2);y([b()],v.prototype,"sidebarOpen",2);y([b()],v.prototype,"sidebarContent",2);y([b()],v.prototype,"sidebarError",2);y([b()],v.prototype,"sidebarMimeType",2);y([b()],v.prototype,"sidebarFilePath",2);y([b()],v.prototype,"sidebarTitle",2);y([b()],v.prototype,"splitRatio",2);y([b()],v.prototype,"lightbox",2);y([b()],v.prototype,"updateStatus",2);y([b()],v.prototype,"updateLoading",2);y([b()],v.prototype,"updateError",2);y([b()],v.prototype,"updateLastChecked",2);y([b()],v.prototype,"nodesLoading",2);y([b()],v.prototype,"nodes",2);y([b()],v.prototype,"devicesLoading",2);y([b()],v.prototype,"devicesError",2);y([b()],v.prototype,"devicesList",2);y([b()],v.prototype,"execApprovalsLoading",2);y([b()],v.prototype,"execApprovalsSaving",2);y([b()],v.prototype,"execApprovalsDirty",2);y([b()],v.prototype,"execApprovalsSnapshot",2);y([b()],v.prototype,"execApprovalsForm",2);y([b()],v.prototype,"execApprovalsSelectedAgent",2);y([b()],v.prototype,"execApprovalsTarget",2);y([b()],v.prototype,"execApprovalsTargetNodeId",2);y([b()],v.prototype,"execApprovalQueue",2);y([b()],v.prototype,"execApprovalBusy",2);y([b()],v.prototype,"execApprovalError",2);y([b()],v.prototype,"pendingGatewayUrl",2);y([b()],v.prototype,"configLoading",2);y([b()],v.prototype,"configRaw",2);y([b()],v.prototype,"configRawOriginal",2);y([b()],v.prototype,"configValid",2);y([b()],v.prototype,"configIssues",2);y([b()],v.prototype,"configSaving",2);y([b()],v.prototype,"configApplying",2);y([b()],v.prototype,"updateRunning",2);y([b()],v.prototype,"applySessionKey",2);y([b()],v.prototype,"configSnapshot",2);y([b()],v.prototype,"configSchema",2);y([b()],v.prototype,"configSchemaVersion",2);y([b()],v.prototype,"configSchemaLoading",2);y([b()],v.prototype,"configUiHints",2);y([b()],v.prototype,"configForm",2);y([b()],v.prototype,"configFormOriginal",2);y([b()],v.prototype,"configFormDirty",2);y([b()],v.prototype,"configFormMode",2);y([b()],v.prototype,"configSearchQuery",2);y([b()],v.prototype,"configActiveSection",2);y([b()],v.prototype,"configActiveSubsection",2);y([b()],v.prototype,"channelsLoading",2);y([b()],v.prototype,"channelsSnapshot",2);y([b()],v.prototype,"channelsError",2);y([b()],v.prototype,"channelsLastSuccess",2);y([b()],v.prototype,"whatsappLoginMessage",2);y([b()],v.prototype,"whatsappLoginQrDataUrl",2);y([b()],v.prototype,"whatsappLoginConnected",2);y([b()],v.prototype,"whatsappBusy",2);y([b()],v.prototype,"nostrProfileFormState",2);y([b()],v.prototype,"nostrProfileAccountId",2);y([b()],v.prototype,"presenceLoading",2);y([b()],v.prototype,"presenceEntries",2);y([b()],v.prototype,"presenceError",2);y([b()],v.prototype,"presenceStatus",2);y([b()],v.prototype,"agentsLoading",2);y([b()],v.prototype,"agentsList",2);y([b()],v.prototype,"agentsError",2);y([b()],v.prototype,"sessionsLoading",2);y([b()],v.prototype,"sessionsResult",2);y([b()],v.prototype,"sessionsError",2);y([b()],v.prototype,"sessionsFilterActive",2);y([b()],v.prototype,"sessionsFilterLimit",2);y([b()],v.prototype,"sessionsIncludeGlobal",2);y([b()],v.prototype,"sessionsIncludeUnknown",2);y([b()],v.prototype,"archivedSessions",2);y([b()],v.prototype,"archivedSessionsLoading",2);y([b()],v.prototype,"archivedSessionsExpanded",2);y([b()],v.prototype,"cronLoading",2);y([b()],v.prototype,"cronJobs",2);y([b()],v.prototype,"cronStatus",2);y([b()],v.prototype,"cronError",2);y([b()],v.prototype,"cronForm",2);y([b()],v.prototype,"cronRunsJobId",2);y([b()],v.prototype,"cronRuns",2);y([b()],v.prototype,"cronBusy",2);y([b()],v.prototype,"workspaceNeedsSetup",2);y([b()],v.prototype,"onboardingPhase",2);y([b()],v.prototype,"onboardingData",2);y([b()],v.prototype,"onboardingActive",2);y([b()],v.prototype,"wizardActive",2);y([b()],v.prototype,"wizardState",2);y([b()],v.prototype,"showSetupTab",2);y([b()],v.prototype,"setupChecklist",2);y([b()],v.prototype,"setupChecklistLoading",2);y([b()],v.prototype,"setupQuickDone",2);y([b()],v.prototype,"workspaces",2);y([b()],v.prototype,"selectedWorkspace",2);y([b()],v.prototype,"workspacesSearchQuery",2);y([b()],v.prototype,"workspaceItemSearchQuery",2);y([b()],v.prototype,"workspacesLoading",2);y([b()],v.prototype,"workspacesCreateLoading",2);y([b()],v.prototype,"workspacesError",2);y([b()],v.prototype,"workspaceExpandedFolders",2);y([b()],v.prototype,"allTasks",2);y([b()],v.prototype,"taskFilter",2);y([b()],v.prototype,"taskSort",2);y([b()],v.prototype,"showCompletedTasks",2);y([b()],v.prototype,"editingTaskId",2);y([b()],v.prototype,"workspaceBrowsePath",2);y([b()],v.prototype,"workspaceBrowseEntries",2);y([b()],v.prototype,"workspaceBreadcrumbs",2);y([b()],v.prototype,"workspaceBrowseSearchQuery",2);y([b()],v.prototype,"workspaceBrowseSearchResults",2);y([b()],v.prototype,"myDayLoading",2);y([b()],v.prototype,"myDayError",2);y([b()],v.prototype,"todaySelectedDate",2);y([b()],v.prototype,"todayViewMode",2);y([b()],v.prototype,"dailyBrief",2);y([b()],v.prototype,"dailyBriefLoading",2);y([b()],v.prototype,"dailyBriefError",2);y([b()],v.prototype,"agentLog",2);y([b()],v.prototype,"agentLogLoading",2);y([b()],v.prototype,"agentLogError",2);y([b()],v.prototype,"briefNotes",2);y([b()],v.prototype,"todayTasks",2);y([b()],v.prototype,"todayTasksLoading",2);y([b()],v.prototype,"todayEditingTaskId",2);y([b()],v.prototype,"todayShowCompleted",2);y([b()],v.prototype,"chatPrivateMode",2);y([b()],v.prototype,"privateSessions",2);y([b()],v.prototype,"lifeSubtab",2);y([b()],v.prototype,"goals",2);y([b()],v.prototype,"goalsLoading",2);y([b()],v.prototype,"goalsError",2);y([b()],v.prototype,"dataSources",2);y([b()],v.prototype,"dataLoading",2);y([b()],v.prototype,"dataError",2);y([b()],v.prototype,"dataSubtab",2);y([b()],v.prototype,"dynamicSlots",2);y([b()],v.prototype,"workProjects",2);y([b()],v.prototype,"workLoading",2);y([b()],v.prototype,"workError",2);y([b()],v.prototype,"workExpandedProjects",2);y([b()],v.prototype,"workProjectFiles",2);y([b()],v.prototype,"workDetailLoading",2);y([b()],v.prototype,"peopleList",2);y([b()],v.prototype,"peopleLoading",2);y([b()],v.prototype,"peopleError",2);y([b()],v.prototype,"peopleSelected",2);y([b()],v.prototype,"peopleSearchQuery",2);y([b()],v.prototype,"wheelOfLifeData",2);y([b()],v.prototype,"wheelOfLifeLoading",2);y([b()],v.prototype,"wheelOfLifeError",2);y([b()],v.prototype,"wheelOfLifeEditMode",2);y([b()],v.prototype,"visionBoardData",2);y([b()],v.prototype,"visionBoardLoading",2);y([b()],v.prototype,"visionBoardError",2);y([b()],v.prototype,"visionBoardIdentityToday",2);y([b()],v.prototype,"lifetracksData",2);y([b()],v.prototype,"lifetracksLoading",2);y([b()],v.prototype,"lifetracksError",2);y([b()],v.prototype,"lifetracksCurrentTrack",2);y([b()],v.prototype,"lifetracksConfig",2);y([b()],v.prototype,"lifetracksGenerating",2);y([b()],v.prototype,"lifetracksGenerationError",2);y([b()],v.prototype,"skillsLoading",2);y([b()],v.prototype,"skillsReport",2);y([b()],v.prototype,"skillsError",2);y([b()],v.prototype,"skillsFilter",2);y([b()],v.prototype,"skillEdits",2);y([b()],v.prototype,"skillsBusyKey",2);y([b()],v.prototype,"skillMessages",2);y([b()],v.prototype,"skillsSubTab",2);y([b()],v.prototype,"clawhubQuery",2);y([b()],v.prototype,"clawhubResults",2);y([b()],v.prototype,"clawhubExploreItems",2);y([b()],v.prototype,"clawhubExploreSort",2);y([b()],v.prototype,"clawhubLoading",2);y([b()],v.prototype,"clawhubError",2);y([b()],v.prototype,"clawhubDetailSlug",2);y([b()],v.prototype,"clawhubDetail",2);y([b()],v.prototype,"clawhubImporting",2);y([b()],v.prototype,"clawhubMessage",2);y([b()],v.prototype,"debugLoading",2);y([b()],v.prototype,"debugStatus",2);y([b()],v.prototype,"debugHealth",2);y([b()],v.prototype,"debugModels",2);y([b()],v.prototype,"debugHeartbeat",2);y([b()],v.prototype,"debugCallMethod",2);y([b()],v.prototype,"debugCallParams",2);y([b()],v.prototype,"debugCallResult",2);y([b()],v.prototype,"debugCallError",2);y([b()],v.prototype,"logsLoading",2);y([b()],v.prototype,"logsError",2);y([b()],v.prototype,"logsFile",2);y([b()],v.prototype,"logsEntries",2);y([b()],v.prototype,"logsFilterText",2);y([b()],v.prototype,"logsLevelFilters",2);y([b()],v.prototype,"logsAutoFollow",2);y([b()],v.prototype,"logsTruncated",2);y([b()],v.prototype,"logsCursor",2);y([b()],v.prototype,"logsLastFetchAt",2);y([b()],v.prototype,"logsLimit",2);y([b()],v.prototype,"logsMaxBytes",2);y([b()],v.prototype,"logsAtBottom",2);y([b()],v.prototype,"toasts",2);y([b()],v.prototype,"chatUserNearBottom",2);y([b()],v.prototype,"chatNewMessagesBelow",2);y([b()],v.prototype,"consciousnessStatus",2);y([b()],v.prototype,"focusPulseData",2);y([b()],v.prototype,"trustTrackerData",2);y([b()],v.prototype,"trustTrackerLoading",2);y([b()],v.prototype,"guardrailsData",2);y([b()],v.prototype,"guardrailsLoading",2);y([b()],v.prototype,"guardrailsShowAddForm",2);y([b()],v.prototype,"missionControlData",2);y([b()],v.prototype,"missionControlLoading",2);y([b()],v.prototype,"missionControlError",2);y([b()],v.prototype,"godmodeOptions",2);y([b()],v.prototype,"godmodeOptionsLoading",2);y([b()],v.prototype,"dashboardsList",2);y([b()],v.prototype,"dashboardsLoading",2);y([b()],v.prototype,"dashboardsError",2);y([b()],v.prototype,"activeDashboardId",2);y([b()],v.prototype,"activeDashboardHtml",2);y([b()],v.prototype,"activeDashboardManifest",2);y([b()],v.prototype,"dashboardChatOpen",2);y([b()],v.prototype,"secondBrainSubtab",2);y([b()],v.prototype,"secondBrainLoading",2);y([b()],v.prototype,"secondBrainError",2);y([b()],v.prototype,"secondBrainIdentity",2);y([b()],v.prototype,"secondBrainMemoryBank",2);y([b()],v.prototype,"secondBrainAiPacket",2);y([b()],v.prototype,"secondBrainSourcesData",2);y([b()],v.prototype,"secondBrainResearchData",2);y([b()],v.prototype,"secondBrainResearchAddFormOpen",2);y([b()],v.prototype,"secondBrainResearchAddForm",2);y([b()],v.prototype,"secondBrainResearchCategories",2);y([b()],v.prototype,"secondBrainSelectedEntry",2);y([b()],v.prototype,"secondBrainSearchQuery",2);y([b()],v.prototype,"secondBrainSyncing",2);y([b()],v.prototype,"secondBrainBrowsingFolder",2);y([b()],v.prototype,"secondBrainFolderEntries",2);y([b()],v.prototype,"secondBrainFolderName",2);y([b()],v.prototype,"secondBrainFileTree",2);y([b()],v.prototype,"secondBrainFileTreeLoading",2);y([b()],v.prototype,"secondBrainFileSearchQuery",2);y([b()],v.prototype,"secondBrainFileSearchResults",2);y([b()],v.prototype,"intelInsights",2);y([b()],v.prototype,"intelDiscoveries",2);y([b()],v.prototype,"intelPatterns",2);y([b()],v.prototype,"intelStatus",2);y([b()],v.prototype,"intelLoading",2);y([b()],v.prototype,"intelError",2);v=y([Sc("godmode-app")],v);
