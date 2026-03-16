(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const Np="modulepreload",Bp=function(e,t){return new URL(e,t).href},pr={},R=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let u=function(h){return Promise.all(h.map(f=>Promise.resolve(f).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");a=u(n.map(h=>{if(h=Bp(h,s),h in pr)return;pr[h]=!0;const f=h.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(s)for(let $=o.length-1;$>=0;$--){const c=o[$];if(c.href===h&&(!f||c.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${m}`))return;const w=document.createElement("link");if(w.rel=f?"stylesheet":Np,f||(w.as="script"),w.crossOrigin="",w.href=h,d&&w.setAttribute("nonce",d),document.head.appendChild(w),f)return new Promise(($,c)=>{w.addEventListener("load",$),w.addEventListener("error",()=>c(new Error(`Unable to preload CSS for ${h}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return a.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};const xs=globalThis,zi=xs.ShadowRoot&&(xs.ShadyCSS===void 0||xs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ki=Symbol(),hr=new WeakMap;let _c=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Ki)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(zi&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=hr.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&hr.set(n,t))}return t}toString(){return this.cssText}};const Up=e=>new _c(typeof e=="string"?e:e+"",void 0,Ki),zp=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,a,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new _c(n,e,Ki)},Kp=(e,t)=>{if(zi)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),a=xs.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=n.cssText,e.appendChild(s)}},fr=zi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return Up(n)})(e):e;const{is:Wp,defineProperty:qp,getOwnPropertyDescriptor:jp,getOwnPropertyNames:Vp,getOwnPropertySymbols:Hp,getPrototypeOf:Gp}=Object,Js=globalThis,gr=Js.trustedTypes,Qp=gr?gr.emptyScript:"",Yp=Js.reactiveElementPolyfillSupport,zn=(e,t)=>e,Is={toAttribute(e,t){switch(t){case Boolean:e=e?Qp:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Wi=(e,t)=>!Wp(e,t),mr={attribute:!0,type:String,converter:Is,reflect:!1,useDefault:!1,hasChanged:Wi};Symbol.metadata??=Symbol("metadata"),Js.litPropertyMetadata??=new WeakMap;let en=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=mr){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(t,s,n);a!==void 0&&qp(this.prototype,t,a)}}static getPropertyDescriptor(t,n,s){const{get:a,set:i}=jp(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){const l=a?.call(this);i?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??mr}static _$Ei(){if(this.hasOwnProperty(zn("elementProperties")))return;const t=Gp(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(zn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(zn("properties"))){const n=this.properties,s=[...Vp(n),...Hp(n)];for(const a of s)this.createProperty(a,n[a])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,a]of n)this.elementProperties.set(s,a)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const a=this._$Eu(n,s);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const a of s)n.unshift(fr(a))}else t!==void 0&&n.push(fr(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Kp(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,s);if(a!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:Is).toAttribute(n,s.type);this._$Em=t,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(t,n){const s=this.constructor,a=s._$Eh.get(t);if(a!==void 0&&this._$Em!==a){const i=s.getPropertyOptions(a),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Is;this._$Em=a;const l=o.fromAttribute(n,i.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,s,a=!1,i){if(t!==void 0){const o=this.constructor;if(a===!1&&(i=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Wi)(i,n)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:a,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),i!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[a,i]of s){const{wrapped:o}=i,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,i,l)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};en.elementStyles=[],en.shadowRootOptions={mode:"open"},en[zn("elementProperties")]=new Map,en[zn("finalized")]=new Map,Yp?.({ReactiveElement:en}),(Js.reactiveElementVersions??=[]).push("2.1.2");const qi=globalThis,vr=e=>e,Ds=qi.trustedTypes,yr=Ds?Ds.createPolicy("lit-html",{createHTML:e=>e}):void 0,Cc="$lit$",dt=`lit$${Math.random().toFixed(9).slice(2)}$`,Rc="?"+dt,Jp=`<${Rc}>`,Lt=document,Vn=()=>Lt.createComment(""),Hn=e=>e===null||typeof e!="object"&&typeof e!="function",ji=Array.isArray,Xp=e=>ji(e)||typeof e?.[Symbol.iterator]=="function",Ra=`[ 	
\f\r]`,Sn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,br=/-->/g,wr=/>/g,$t=RegExp(`>|${Ra}(?:([^\\s"'>=/]+)(${Ra}*=${Ra}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$r=/'/g,kr=/"/g,Ec=/^(?:script|style|textarea|title)$/i,Zp=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),r=Zp(1),ft=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Sr=new WeakMap,Et=Lt.createTreeWalker(Lt,129);function Pc(e,t){if(!ji(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return yr!==void 0?yr.createHTML(t):t}const eh=(e,t)=>{const n=e.length-1,s=[];let a,i=t===2?"<svg>":t===3?"<math>":"",o=Sn;for(let l=0;l<n;l++){const d=e[l];let u,h,f=-1,m=0;for(;m<d.length&&(o.lastIndex=m,h=o.exec(d),h!==null);)m=o.lastIndex,o===Sn?h[1]==="!--"?o=br:h[1]!==void 0?o=wr:h[2]!==void 0?(Ec.test(h[2])&&(a=RegExp("</"+h[2],"g")),o=$t):h[3]!==void 0&&(o=$t):o===$t?h[0]===">"?(o=a??Sn,f=-1):h[1]===void 0?f=-2:(f=o.lastIndex-h[2].length,u=h[1],o=h[3]===void 0?$t:h[3]==='"'?kr:$r):o===kr||o===$r?o=$t:o===br||o===wr?o=Sn:(o=$t,a=void 0);const w=o===$t&&e[l+1].startsWith("/>")?" ":"";i+=o===Sn?d+Jp:f>=0?(s.push(u),d.slice(0,f)+Cc+d.slice(f)+dt+w):d+dt+(f===-2?l:w)}return[Pc(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Gn{constructor({strings:t,_$litType$:n},s){let a;this.parts=[];let i=0,o=0;const l=t.length-1,d=this.parts,[u,h]=eh(t,n);if(this.el=Gn.createElement(u,s),Et.currentNode=this.el.content,n===2||n===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(a=Et.nextNode())!==null&&d.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(const f of a.getAttributeNames())if(f.endsWith(Cc)){const m=h[o++],w=a.getAttribute(f).split(dt),$=/([.?@])?(.*)/.exec(m);d.push({type:1,index:i,name:$[2],strings:w,ctor:$[1]==="."?nh:$[1]==="?"?sh:$[1]==="@"?ah:Zs}),a.removeAttribute(f)}else f.startsWith(dt)&&(d.push({type:6,index:i}),a.removeAttribute(f));if(Ec.test(a.tagName)){const f=a.textContent.split(dt),m=f.length-1;if(m>0){a.textContent=Ds?Ds.emptyScript:"";for(let w=0;w<m;w++)a.append(f[w],Vn()),Et.nextNode(),d.push({type:2,index:++i});a.append(f[m],Vn())}}}else if(a.nodeType===8)if(a.data===Rc)d.push({type:2,index:i});else{let f=-1;for(;(f=a.data.indexOf(dt,f+1))!==-1;)d.push({type:7,index:i}),f+=dt.length-1}i++}}static createElement(t,n){const s=Lt.createElement("template");return s.innerHTML=t,s}}function ln(e,t,n=e,s){if(t===ft)return t;let a=s!==void 0?n._$Co?.[s]:n._$Cl;const i=Hn(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),i===void 0?a=void 0:(a=new i(e),a._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=a:n._$Cl=a),a!==void 0&&(t=ln(e,a._$AS(e,t.values),a,s)),t}class th{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,a=(t?.creationScope??Lt).importNode(n,!0);Et.currentNode=a;let i=Et.nextNode(),o=0,l=0,d=s[0];for(;d!==void 0;){if(o===d.index){let u;d.type===2?u=new Xs(i,i.nextSibling,this,t):d.type===1?u=new d.ctor(i,d.name,d.strings,this,t):d.type===6&&(u=new ih(i,this,t)),this._$AV.push(u),d=s[++l]}o!==d?.index&&(i=Et.nextNode(),o++)}return Et.currentNode=Lt,a}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Xs=class Lc{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,a){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=ln(this,t,n),Hn(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==ft&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xp(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&Hn(this._$AH)?this._$AA.nextSibling.data=t:this.T(Lt.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,a=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Gn.createElement(Pc(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(n);else{const i=new th(a,this),o=i.u(this.options);i.p(n),this.T(o),this._$AH=i}}_$AC(t){let n=Sr.get(t.strings);return n===void 0&&Sr.set(t.strings,n=new Gn(t)),n}k(t){ji(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,a=0;for(const i of t)a===n.length?n.push(s=new Lc(this.O(Vn()),this.O(Vn()),this,this.options)):s=n[a],s._$AI(i),a++;a<n.length&&(this._$AR(s&&s._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=vr(t).nextSibling;vr(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Zs=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,a,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,n=this,s,a){const i=this.strings;let o=!1;if(i===void 0)t=ln(this,t,n,0),o=!Hn(t)||t!==this._$AH&&t!==ft,o&&(this._$AH=t);else{const l=t;let d,u;for(t=i[0],d=0;d<i.length-1;d++)u=ln(this,l[s+d],n,d),u===ft&&(u=this._$AH[d]),o||=!Hn(u)||u!==this._$AH[d],u===p?t=p:t!==p&&(t+=(u??"")+i[d+1]),this._$AH[d]=u}o&&!a&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nh=class extends Zs{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},sh=class extends Zs{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},ah=class extends Zs{constructor(t,n,s,a,i){super(t,n,s,a,i),this.type=5}_$AI(t,n=this){if((t=ln(this,t,n,0)??p)===ft)return;const s=this._$AH,a=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==p&&(s===p||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ih=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ln(this,t)}};const oh={I:Xs},rh=qi.litHtmlPolyfillSupport;rh?.(Gn,Xs),(qi.litHtmlVersions??=[]).push("3.3.2");const lh=(e,t,n)=>{const s=n?.renderBefore??t;let a=s._$litPart$;if(a===void 0){const i=n?.renderBefore??null;s._$litPart$=a=new Xs(t.insertBefore(Vn(),i),i,void 0,n??{})}return a._$AI(e),a};const Vi=globalThis;let on=class extends en{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=lh(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ft}};on._$litElement$=!0,on.finalized=!0,Vi.litElementHydrateSupport?.({LitElement:on});const ch=Vi.litElementPolyfillSupport;ch?.({LitElement:on});(Vi.litElementVersions??=[]).push("4.2.2");const Ic=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const dh={attribute:!0,type:String,converter:Is,reflect:!1,hasChanged:Wi},uh=(e=dh,t,n)=>{const{kind:s,metadata:a}=n;let i=globalThis.litPropertyMetadata.get(a);if(i===void 0&&globalThis.litPropertyMetadata.set(a,i=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(l){const d=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,d,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(s==="setter"){const{name:o}=n;return function(l){const d=this[o];t.call(this,l),this.requestUpdate(o,d,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function ss(e){return(t,n)=>typeof n=="object"?uh(e,t,n):((s,a,i)=>{const o=a.hasOwnProperty(i);return a.constructor.createProperty(i,s),o?Object.getOwnPropertyDescriptor(a,i):void 0})(e,t,n)}function b(e){return ss({...e,state:!0,attribute:!1})}async function Oe(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function ph(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function hh(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function fh(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function It(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function cn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Dc(e,t,n){if(t.length===0)return;let s=e;for(let i=0;i<t.length-1;i+=1){const o=t[i],l=t[i+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof l=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const d=s;d[o]==null&&(d[o]=typeof l=="number"?[]:{}),s=d[o]}}const a=t[t.length-1];if(typeof a=="number"){Array.isArray(s)&&(s[a]=n);return}typeof s=="object"&&s!=null&&(s[a]=n)}function Mc(e,t){if(t.length===0)return;let n=e;for(let a=0;a<t.length-1;a+=1){const i=t[a];if(typeof i=="number"){if(!Array.isArray(n))return;n=n[i]}else{if(typeof n!="object"||n==null)return;n=n[i]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Ze(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});mh(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function Oc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});gh(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function gh(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function mh(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?cn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=cn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=It(t.config??{}),e.configFormOriginal=It(t.config??{}),e.configRawOriginal=n)}async function Ms(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?cn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Ze(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function vh(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?cn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Ze(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Ar(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}async function yh(e){if(!(!e.client||!e.connected)){e.pluginUpdateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.pluginRun",{})}catch(t){e.lastError=String(t)}finally{e.pluginUpdateRunning=!1}}}function nn(e,t,n){const s=It(e.configForm??e.configSnapshot?.config??{});Dc(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=cn(s))}function xr(e,t){const n=It(e.configForm??e.configSnapshot?.config??{});Mc(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=cn(n))}async function bh(e,t,n){nn(e,["agents","defaults","model","primary"],t),nn(e,["agents","defaults","model","fallbacks"],n),await Ms(e)}function wh(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function $h(e){const{state:t,callbacks:n,accountId:s}=e,a=wh(t),i=(l,d,u={})=>{const{type:h="text",placeholder:f,maxLength:m,help:w}=u,$=t.values[l]??"",c=t.fieldErrors[l],g=`nostr-profile-${l}`;return h==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${g}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${g}"
            .value=${$}
            placeholder=${f??""}
            maxlength=${m??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${k=>{const A=k.target;n.onFieldChange(l,A.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${w?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${w}</div>`:p}
          ${c?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${c}</div>`:p}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${g}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${g}"
          type=${h}
          .value=${$}
          placeholder=${f??""}
          maxlength=${m??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${k=>{const A=k.target;n.onFieldChange(l,A.value)}}
          ?disabled=${t.saving}
        />
        ${w?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${w}</div>`:p}
        ${c?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${c}</div>`:p}
      </div>
    `},o=()=>{const l=t.values.picture;return l?r`
      <div style="margin-bottom: 12px;">
        <img
          src=${l}
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

      ${a?r`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:p}
    </div>
  `}function kh(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Sh(e,t){await ph(e,t),await Oe(e,!0)}async function Ah(e){await hh(e),await Oe(e,!0)}async function xh(e){await fh(e),await Oe(e,!0)}async function Th(e){await Ms(e),await Ze(e),await Oe(e,!0)}async function _h(e){await Ze(e),await Oe(e,!0)}function Ch(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...a]=n.split(":");if(!s||a.length===0)continue;const i=s.trim(),o=a.join(":").trim();i&&o&&(t[i]=o)}return t}function Fc(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Nc(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function Rh(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=kh(n??void 0)}function Eh(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Ph(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Lh(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Ih(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Fc(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Nc(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const i=a?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:i,success:null,fieldErrors:Ch(a?.details)};return}if(!a.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Oe(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Dh(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Fc(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Nc(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const d=a?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:d,success:null};return}const i=a.merged??a.imported??null,o=i?{...t.values,...i}:t.values,l=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:a.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},a.saved&&await Oe(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Bc(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),a=n.slice(2).join(":");return!s||!a?null:{agentId:s,rest:a}}const Mh=80;function we(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const a=getComputedStyle(s).overflowY;if(a==="auto"||a==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const i=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=n();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},i)})})}function Uc(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Oh(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<Mh?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function Fh(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function ea(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function Nh(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),a=document.createElement("a"),i=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");a.href=s,a.download=`godmode-logs-${t}-${i}.log`,a.click(),URL.revokeObjectURL(s)}function Bh(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const Uh=[{label:"",tabs:["chat","today","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","skills","agents","trust","guardrails","options"]}],zh=[{label:"System",tabs:["mission-control","overview","channels","sessions","cron","debug"]}],zc={setup:"/setup",onboarding:"/onboarding",options:"/options",overview:"/overview",workspaces:"/workspaces",today:"/today",work:"/work","my-day":"/today",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain","mission-control":"/mission-control",dashboards:"/dashboards"},dn=new Map(Object.entries(zc).map(([e,t])=>[t,e]));dn.set("/today","today");dn.set("/my-day","today");dn.set("/work","workspaces");function ta(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Qn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Hi(e,t=""){const n=ta(t),s=zc[e];return n?`${n}${s}`:s}function Kc(e,t=""){const n=ta(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let a=Qn(s).toLowerCase();return a.endsWith("/index.html")&&(a="/"),a==="/"?"chat":dn.get(a)??null}function Kh(e){let t=Qn(e);if(t.endsWith("/index.html")&&(t=Qn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const a=`/${n.slice(s).join("/")}`.toLowerCase();if(dn.has(a)){const i=n.slice(0,s);return!i.length||i.some(l=>dn.has(`/${l.toLowerCase()}`))?"":`/${i.join("/")}`}}return`/${n.join("/")}`}function Yn(e){switch(e){case"setup":return"Setup";case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":case"my-day":return"Today";case"work":return"Work";case"overview":return"Overview";case"workspaces":return"Work";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"options":return"Experiments";case"trust":return"Trust";case"guardrails":return"Safety";case"second-brain":return"Second Brain";case"mission-control":return"Mission Control";case"dashboards":return"Dashboards";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function Wh(e){switch(e){case"setup":return"🧭";case"onboarding":return"🧭";case"chat":return"💬";case"today":case"my-day":return"☀️";case"work":return"💼";case"overview":return"🎯";case"workspaces":return"📂";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"mission-control":return"🛰️";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function qh(e){switch(e){case"setup":return"Get GodMode configured and running.";case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":case"my-day":return"Calendar, brief, tasks, and schedule for the day.";case"work":return"Your projects, files, tasks, and team — organized by workspace.";case"overview":return"Gateway status, entry points, and a fast health read.";case"workspaces":return"Projects, clients, and personal operating context.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"options":return"Beta features you can toggle on or off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"mission-control":return"Live view — what your agents are doing right now.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const Q="main";function jh(e){const t=[`viewing ${Yn(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const Vh=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,ys=/<\s*\/?\s*final\b[^>]*>/gi,Tr=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function Hh(e,t){return e.trimStart()}function Gh(e,t){if(!e||!Vh.test(e))return e;let n=e;ys.test(n)?(ys.lastIndex=0,n=n.replace(ys,"")):ys.lastIndex=0,Tr.lastIndex=0;let s="",a=0,i=!1;for(const o of n.matchAll(Tr)){const l=o.index??0,d=o[1]==="/";i?d&&(i=!1):(s+=n.slice(a,l),d||(i=!0)),a=l+o[0].length}return s+=n.slice(a),Hh(s)}function Jn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function K(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const a=Math.round(s/60);return a<48?`${a}h ago`:`${Math.round(a/24)}d ago`}function Qh(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const a=Math.round(s/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function Gi(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function di(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function Xn(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Wc(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Os(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function ce(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${a}`}function Ea(e){return Gh(e)}const _r=50,Yh=80,Jh=12e4;function le(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function re(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function Cr(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${le(re(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${le(re(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${le(re(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${le(re(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${le(re(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(re(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return le(re(n.url||""),50)}case"memory_search":return n.query?`"${le(re(n.query),45)}"`:"";case"browser":const s=re(n.action),a=n.ref?` #${re(n.ref)}`:"",i=n.targetUrl?` ${le(re(n.targetUrl),30)}`:"";return`${s}${a}${i}`;case"message":return n.action?`${re(n.action)}${n.target?` → ${le(re(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${le(re(n.task),40)}"`:"";case"cron":return n.action?re(n.action):"";case"files_read":return n.fileId?`file:${le(re(n.fileId),20)}`:"";case"image":return n.image?le(re(n.image),40):"";default:const o=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(o.length===0)return"";const l=o[0],d=n[l];return typeof d=="string"?`${l}: ${le(d,35)}`:""}}function Rr(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),a=s.length,i=t.length;if(["read","files_read"].includes(n))return`${i.toLocaleString()} chars${a>1?`, ${a} lines`:""}`;if(n==="exec")return a>1?`${a} lines`:le(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),l=o.results?.length??o.count??0;return`${l} result${l!==1?"s":""}`}catch{return le(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":le(t,40):i>100?`${i.toLocaleString()} chars`:le(t,50)}function Er(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Xh(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(a=>{if(!a||typeof a!="object")return null;const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>!!a);return s.length===0?null:s.join(`
`)}function Pr(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Xh(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Wc(n,Jh);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Zh(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function ef(e){if(e.toolStreamOrder.length<=_r)return;const t=e.toolStreamOrder.length-_r,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function tf(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function ui(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),tf(e)}function nf(e,t=!1){if(t){ui(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>ui(e),Yh))}function Qi(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),ui(e)}const sf=5e3;function af(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},sf))}function of(e,t){if(!t)return;if(t.stream==="compaction"){af(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},a=typeof s.toolCallId=="string"?s.toolCallId:"";if(!a)return;const i=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",l=o==="start"?s.args:void 0,d=o==="update"?Pr(s.partialResult):o==="result"?Pr(s.result):void 0,u=Date.now();let h=e.toolStreamById.get(a);h?(h.name=i,l!==void 0&&(h.args=l,h.displayArgs=Cr(i,l)),d!==void 0&&(h.output=d,h.resultSummary=Rr(i,d),h.success=Er(d)),h.updatedAt=u):(h={toolCallId:a,runId:t.runId,sessionKey:n,name:i,args:l,output:d,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:l?Cr(i,l):void 0},e.toolStreamById.set(a,h),e.toolStreamOrder.push(a)),o==="start"?(e.currentToolName=i,e.currentToolInfo={name:i,details:h.displayArgs||void 0,startedAt:h.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,h.completedAt=u,h.resultSummary=Rr(i,h.output),h.success=Er(h.output)),h.message=Zh(h),ef(e),nf(e,o==="result")}const Yi={CHILD:2},Ji=e=>(...t)=>({_$litDirective$:e,values:t});let Xi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class pi extends Xi{constructor(t){if(super(t),this.it=p,t.type!==Yi.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===p||t==null)return this._t=void 0,this.it=t;if(t===ft)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}pi.directiveName="unsafeHTML",pi.resultType=1;const Ae=Ji(pi);const{entries:qc,setPrototypeOf:Lr,isFrozen:rf,getPrototypeOf:lf,getOwnPropertyDescriptor:cf}=Object;let{freeze:ge,seal:Ce,create:hi}=Object,{apply:fi,construct:gi}=typeof Reflect<"u"&&Reflect;ge||(ge=function(t){return t});Ce||(Ce=function(t){return t});fi||(fi=function(t,n){for(var s=arguments.length,a=new Array(s>2?s-2:0),i=2;i<s;i++)a[i-2]=arguments[i];return t.apply(n,a)});gi||(gi=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return new t(...s)});const bs=me(Array.prototype.forEach),df=me(Array.prototype.lastIndexOf),Ir=me(Array.prototype.pop),An=me(Array.prototype.push),uf=me(Array.prototype.splice),Ts=me(String.prototype.toLowerCase),Pa=me(String.prototype.toString),La=me(String.prototype.match),xn=me(String.prototype.replace),pf=me(String.prototype.indexOf),hf=me(String.prototype.trim),Re=me(Object.prototype.hasOwnProperty),pe=me(RegExp.prototype.test),Tn=ff(TypeError);function me(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return fi(e,t,s)}}function ff(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return gi(e,n)}}function z(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ts;Lr&&Lr(e,null);let s=t.length;for(;s--;){let a=t[s];if(typeof a=="string"){const i=n(a);i!==a&&(rf(t)||(t[s]=i),a=i)}e[a]=!0}return e}function gf(e){for(let t=0;t<e.length;t++)Re(e,t)||(e[t]=null);return e}function ze(e){const t=hi(null);for(const[n,s]of qc(e))Re(e,n)&&(Array.isArray(s)?t[n]=gf(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=ze(s):t[n]=s);return t}function _n(e,t){for(;e!==null;){const s=cf(e,t);if(s){if(s.get)return me(s.get);if(typeof s.value=="function")return me(s.value)}e=lf(e)}function n(){return null}return n}const Dr=ge(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ia=ge(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Da=ge(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),mf=ge(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ma=ge(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),vf=ge(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Mr=ge(["#text"]),Or=ge(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Oa=ge(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Fr=ge(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ws=ge(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),yf=Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm),bf=Ce(/<%[\w\W]*|[\w\W]*%>/gm),wf=Ce(/\$\{[\w\W]*/gm),$f=Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/),kf=Ce(/^aria-[\-\w]+$/),jc=Ce(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Sf=Ce(/^(?:\w+script|data):/i),Af=Ce(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Vc=Ce(/^html$/i),xf=Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);var Nr=Object.freeze({__proto__:null,ARIA_ATTR:kf,ATTR_WHITESPACE:Af,CUSTOM_ELEMENT:xf,DATA_ATTR:$f,DOCTYPE_NAME:Vc,ERB_EXPR:bf,IS_ALLOWED_URI:jc,IS_SCRIPT_OR_DATA:Sf,MUSTACHE_EXPR:yf,TMPLIT_EXPR:wf});const Cn={element:1,text:3,progressingInstruction:7,comment:8,document:9},Tf=function(){return typeof window>"u"?null:window},_f=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const a="data-tt-policy-suffix";n&&n.hasAttribute(a)&&(s=n.getAttribute(a));const i="dompurify"+(s?"#"+s:"");try{return t.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Br=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Hc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Tf();const t=F=>Hc(F);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Cn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,a=s.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:d,NodeFilter:u,NamedNodeMap:h=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:f,DOMParser:m,trustedTypes:w}=e,$=d.prototype,c=_n($,"cloneNode"),g=_n($,"remove"),k=_n($,"nextSibling"),A=_n($,"childNodes"),T=_n($,"parentNode");if(typeof o=="function"){const F=n.createElement("template");F.content&&F.content.ownerDocument&&(n=F.content.ownerDocument)}let x,_="";const{implementation:P,createNodeIterator:E,createDocumentFragment:Z,getElementsByTagName:Y}=n,{importNode:I}=s;let M=Br();t.isSupported=typeof qc=="function"&&typeof T=="function"&&P&&P.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:N,ERB_EXPR:U,TMPLIT_EXPR:O,DATA_ATTR:ie,ARIA_ATTR:ke,IS_SCRIPT_OR_DATA:J,ATTR_WHITESPACE:B,CUSTOM_ELEMENT:Fe}=Nr;let{IS_ALLOWED_URI:mn}=Nr,X=null;const qt=z({},[...Dr,...Ia,...Da,...Ma,...Mr]);let V=null;const vn=z({},[...Or,...Oa,...Fr,...ws]);let H=Object.seal(hi(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),it=null,jt=null;const Ve=Object.seal(hi(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Vt=!0,yn=!0,bn=!1,wn=!0,yt=!1,us=!0,bt=!1,ba=!1,wa=!1,Ht=!1,ps=!1,hs=!1,Qo=!0,Yo=!1;const Ep="user-content-";let $a=!0,$n=!1,Gt={},Ne=null;const ka=z({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Jo=null;const Xo=z({},["audio","video","img","source","image","track"]);let Sa=null;const Zo=z({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),fs="http://www.w3.org/1998/Math/MathML",gs="http://www.w3.org/2000/svg",He="http://www.w3.org/1999/xhtml";let Qt=He,Aa=!1,xa=null;const Pp=z({},[fs,gs,He],Pa);let ms=z({},["mi","mo","mn","ms","mtext"]),vs=z({},["annotation-xml"]);const Lp=z({},["title","style","font","a","script"]);let kn=null;const Ip=["application/xhtml+xml","text/html"],Dp="text/html";let ne=null,Yt=null;const Mp=n.createElement("form"),er=function(S){return S instanceof RegExp||S instanceof Function},Ta=function(){let S=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Yt&&Yt===S)){if((!S||typeof S!="object")&&(S={}),S=ze(S),kn=Ip.indexOf(S.PARSER_MEDIA_TYPE)===-1?Dp:S.PARSER_MEDIA_TYPE,ne=kn==="application/xhtml+xml"?Pa:Ts,X=Re(S,"ALLOWED_TAGS")?z({},S.ALLOWED_TAGS,ne):qt,V=Re(S,"ALLOWED_ATTR")?z({},S.ALLOWED_ATTR,ne):vn,xa=Re(S,"ALLOWED_NAMESPACES")?z({},S.ALLOWED_NAMESPACES,Pa):Pp,Sa=Re(S,"ADD_URI_SAFE_ATTR")?z(ze(Zo),S.ADD_URI_SAFE_ATTR,ne):Zo,Jo=Re(S,"ADD_DATA_URI_TAGS")?z(ze(Xo),S.ADD_DATA_URI_TAGS,ne):Xo,Ne=Re(S,"FORBID_CONTENTS")?z({},S.FORBID_CONTENTS,ne):ka,it=Re(S,"FORBID_TAGS")?z({},S.FORBID_TAGS,ne):ze({}),jt=Re(S,"FORBID_ATTR")?z({},S.FORBID_ATTR,ne):ze({}),Gt=Re(S,"USE_PROFILES")?S.USE_PROFILES:!1,Vt=S.ALLOW_ARIA_ATTR!==!1,yn=S.ALLOW_DATA_ATTR!==!1,bn=S.ALLOW_UNKNOWN_PROTOCOLS||!1,wn=S.ALLOW_SELF_CLOSE_IN_ATTR!==!1,yt=S.SAFE_FOR_TEMPLATES||!1,us=S.SAFE_FOR_XML!==!1,bt=S.WHOLE_DOCUMENT||!1,Ht=S.RETURN_DOM||!1,ps=S.RETURN_DOM_FRAGMENT||!1,hs=S.RETURN_TRUSTED_TYPE||!1,wa=S.FORCE_BODY||!1,Qo=S.SANITIZE_DOM!==!1,Yo=S.SANITIZE_NAMED_PROPS||!1,$a=S.KEEP_CONTENT!==!1,$n=S.IN_PLACE||!1,mn=S.ALLOWED_URI_REGEXP||jc,Qt=S.NAMESPACE||He,ms=S.MATHML_TEXT_INTEGRATION_POINTS||ms,vs=S.HTML_INTEGRATION_POINTS||vs,H=S.CUSTOM_ELEMENT_HANDLING||{},S.CUSTOM_ELEMENT_HANDLING&&er(S.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(H.tagNameCheck=S.CUSTOM_ELEMENT_HANDLING.tagNameCheck),S.CUSTOM_ELEMENT_HANDLING&&er(S.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(H.attributeNameCheck=S.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),S.CUSTOM_ELEMENT_HANDLING&&typeof S.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(H.allowCustomizedBuiltInElements=S.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),yt&&(yn=!1),ps&&(Ht=!0),Gt&&(X=z({},Mr),V=[],Gt.html===!0&&(z(X,Dr),z(V,Or)),Gt.svg===!0&&(z(X,Ia),z(V,Oa),z(V,ws)),Gt.svgFilters===!0&&(z(X,Da),z(V,Oa),z(V,ws)),Gt.mathMl===!0&&(z(X,Ma),z(V,Fr),z(V,ws))),S.ADD_TAGS&&(typeof S.ADD_TAGS=="function"?Ve.tagCheck=S.ADD_TAGS:(X===qt&&(X=ze(X)),z(X,S.ADD_TAGS,ne))),S.ADD_ATTR&&(typeof S.ADD_ATTR=="function"?Ve.attributeCheck=S.ADD_ATTR:(V===vn&&(V=ze(V)),z(V,S.ADD_ATTR,ne))),S.ADD_URI_SAFE_ATTR&&z(Sa,S.ADD_URI_SAFE_ATTR,ne),S.FORBID_CONTENTS&&(Ne===ka&&(Ne=ze(Ne)),z(Ne,S.FORBID_CONTENTS,ne)),S.ADD_FORBID_CONTENTS&&(Ne===ka&&(Ne=ze(Ne)),z(Ne,S.ADD_FORBID_CONTENTS,ne)),$a&&(X["#text"]=!0),bt&&z(X,["html","head","body"]),X.table&&(z(X,["tbody"]),delete it.tbody),S.TRUSTED_TYPES_POLICY){if(typeof S.TRUSTED_TYPES_POLICY.createHTML!="function")throw Tn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof S.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Tn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');x=S.TRUSTED_TYPES_POLICY,_=x.createHTML("")}else x===void 0&&(x=_f(w,a)),x!==null&&typeof _=="string"&&(_=x.createHTML(""));ge&&ge(S),Yt=S}},tr=z({},[...Ia,...Da,...mf]),nr=z({},[...Ma,...vf]),Op=function(S){let C=T(S);(!C||!C.tagName)&&(C={namespaceURI:Qt,tagName:"template"});const D=Ts(S.tagName),G=Ts(C.tagName);return xa[S.namespaceURI]?S.namespaceURI===gs?C.namespaceURI===He?D==="svg":C.namespaceURI===fs?D==="svg"&&(G==="annotation-xml"||ms[G]):!!tr[D]:S.namespaceURI===fs?C.namespaceURI===He?D==="math":C.namespaceURI===gs?D==="math"&&vs[G]:!!nr[D]:S.namespaceURI===He?C.namespaceURI===gs&&!vs[G]||C.namespaceURI===fs&&!ms[G]?!1:!nr[D]&&(Lp[D]||!tr[D]):!!(kn==="application/xhtml+xml"&&xa[S.namespaceURI]):!1},Be=function(S){An(t.removed,{element:S});try{T(S).removeChild(S)}catch{g(S)}},wt=function(S,C){try{An(t.removed,{attribute:C.getAttributeNode(S),from:C})}catch{An(t.removed,{attribute:null,from:C})}if(C.removeAttribute(S),S==="is")if(Ht||ps)try{Be(C)}catch{}else try{C.setAttribute(S,"")}catch{}},sr=function(S){let C=null,D=null;if(wa)S="<remove></remove>"+S;else{const ee=La(S,/^[\r\n\t ]+/);D=ee&&ee[0]}kn==="application/xhtml+xml"&&Qt===He&&(S='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+S+"</body></html>");const G=x?x.createHTML(S):S;if(Qt===He)try{C=new m().parseFromString(G,kn)}catch{}if(!C||!C.documentElement){C=P.createDocument(Qt,"template",null);try{C.documentElement.innerHTML=Aa?_:G}catch{}}const de=C.body||C.documentElement;return S&&D&&de.insertBefore(n.createTextNode(D),de.childNodes[0]||null),Qt===He?Y.call(C,bt?"html":"body")[0]:bt?C.documentElement:de},ar=function(S){return E.call(S.ownerDocument||S,S,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},_a=function(S){return S instanceof f&&(typeof S.nodeName!="string"||typeof S.textContent!="string"||typeof S.removeChild!="function"||!(S.attributes instanceof h)||typeof S.removeAttribute!="function"||typeof S.setAttribute!="function"||typeof S.namespaceURI!="string"||typeof S.insertBefore!="function"||typeof S.hasChildNodes!="function")},ir=function(S){return typeof l=="function"&&S instanceof l};function Ge(F,S,C){bs(F,D=>{D.call(t,S,C,Yt)})}const or=function(S){let C=null;if(Ge(M.beforeSanitizeElements,S,null),_a(S))return Be(S),!0;const D=ne(S.nodeName);if(Ge(M.uponSanitizeElement,S,{tagName:D,allowedTags:X}),us&&S.hasChildNodes()&&!ir(S.firstElementChild)&&pe(/<[/\w!]/g,S.innerHTML)&&pe(/<[/\w!]/g,S.textContent)||S.nodeType===Cn.progressingInstruction||us&&S.nodeType===Cn.comment&&pe(/<[/\w]/g,S.data))return Be(S),!0;if(!(Ve.tagCheck instanceof Function&&Ve.tagCheck(D))&&(!X[D]||it[D])){if(!it[D]&&lr(D)&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,D)||H.tagNameCheck instanceof Function&&H.tagNameCheck(D)))return!1;if($a&&!Ne[D]){const G=T(S)||S.parentNode,de=A(S)||S.childNodes;if(de&&G){const ee=de.length;for(let ve=ee-1;ve>=0;--ve){const Qe=c(de[ve],!0);Qe.__removalCount=(S.__removalCount||0)+1,G.insertBefore(Qe,k(S))}}}return Be(S),!0}return S instanceof d&&!Op(S)||(D==="noscript"||D==="noembed"||D==="noframes")&&pe(/<\/no(script|embed|frames)/i,S.innerHTML)?(Be(S),!0):(yt&&S.nodeType===Cn.text&&(C=S.textContent,bs([N,U,O],G=>{C=xn(C,G," ")}),S.textContent!==C&&(An(t.removed,{element:S.cloneNode()}),S.textContent=C)),Ge(M.afterSanitizeElements,S,null),!1)},rr=function(S,C,D){if(Qo&&(C==="id"||C==="name")&&(D in n||D in Mp))return!1;if(!(yn&&!jt[C]&&pe(ie,C))){if(!(Vt&&pe(ke,C))){if(!(Ve.attributeCheck instanceof Function&&Ve.attributeCheck(C,S))){if(!V[C]||jt[C]){if(!(lr(S)&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,S)||H.tagNameCheck instanceof Function&&H.tagNameCheck(S))&&(H.attributeNameCheck instanceof RegExp&&pe(H.attributeNameCheck,C)||H.attributeNameCheck instanceof Function&&H.attributeNameCheck(C,S))||C==="is"&&H.allowCustomizedBuiltInElements&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,D)||H.tagNameCheck instanceof Function&&H.tagNameCheck(D))))return!1}else if(!Sa[C]){if(!pe(mn,xn(D,B,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&S!=="script"&&pf(D,"data:")===0&&Jo[S])){if(!(bn&&!pe(J,xn(D,B,"")))){if(D)return!1}}}}}}}return!0},lr=function(S){return S!=="annotation-xml"&&La(S,Fe)},cr=function(S){Ge(M.beforeSanitizeAttributes,S,null);const{attributes:C}=S;if(!C||_a(S))return;const D={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:V,forceKeepAttr:void 0};let G=C.length;for(;G--;){const de=C[G],{name:ee,namespaceURI:ve,value:Qe}=de,Jt=ne(ee),Ca=Qe;let oe=ee==="value"?Ca:hf(Ca);if(D.attrName=Jt,D.attrValue=oe,D.keepAttr=!0,D.forceKeepAttr=void 0,Ge(M.uponSanitizeAttribute,S,D),oe=D.attrValue,Yo&&(Jt==="id"||Jt==="name")&&(wt(ee,S),oe=Ep+oe),us&&pe(/((--!?|])>)|<\/(style|title|textarea)/i,oe)){wt(ee,S);continue}if(Jt==="attributename"&&La(oe,"href")){wt(ee,S);continue}if(D.forceKeepAttr)continue;if(!D.keepAttr){wt(ee,S);continue}if(!wn&&pe(/\/>/i,oe)){wt(ee,S);continue}yt&&bs([N,U,O],ur=>{oe=xn(oe,ur," ")});const dr=ne(S.nodeName);if(!rr(dr,Jt,oe)){wt(ee,S);continue}if(x&&typeof w=="object"&&typeof w.getAttributeType=="function"&&!ve)switch(w.getAttributeType(dr,Jt)){case"TrustedHTML":{oe=x.createHTML(oe);break}case"TrustedScriptURL":{oe=x.createScriptURL(oe);break}}if(oe!==Ca)try{ve?S.setAttributeNS(ve,ee,oe):S.setAttribute(ee,oe),_a(S)?Be(S):Ir(t.removed)}catch{wt(ee,S)}}Ge(M.afterSanitizeAttributes,S,null)},Fp=function F(S){let C=null;const D=ar(S);for(Ge(M.beforeSanitizeShadowDOM,S,null);C=D.nextNode();)Ge(M.uponSanitizeShadowNode,C,null),or(C),cr(C),C.content instanceof i&&F(C.content);Ge(M.afterSanitizeShadowDOM,S,null)};return t.sanitize=function(F){let S=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,D=null,G=null,de=null;if(Aa=!F,Aa&&(F="<!-->"),typeof F!="string"&&!ir(F))if(typeof F.toString=="function"){if(F=F.toString(),typeof F!="string")throw Tn("dirty is not a string, aborting")}else throw Tn("toString is not a function");if(!t.isSupported)return F;if(ba||Ta(S),t.removed=[],typeof F=="string"&&($n=!1),$n){if(F.nodeName){const Qe=ne(F.nodeName);if(!X[Qe]||it[Qe])throw Tn("root node is forbidden and cannot be sanitized in-place")}}else if(F instanceof l)C=sr("<!---->"),D=C.ownerDocument.importNode(F,!0),D.nodeType===Cn.element&&D.nodeName==="BODY"||D.nodeName==="HTML"?C=D:C.appendChild(D);else{if(!Ht&&!yt&&!bt&&F.indexOf("<")===-1)return x&&hs?x.createHTML(F):F;if(C=sr(F),!C)return Ht?null:hs?_:""}C&&wa&&Be(C.firstChild);const ee=ar($n?F:C);for(;G=ee.nextNode();)or(G),cr(G),G.content instanceof i&&Fp(G.content);if($n)return F;if(Ht){if(ps)for(de=Z.call(C.ownerDocument);C.firstChild;)de.appendChild(C.firstChild);else de=C;return(V.shadowroot||V.shadowrootmode)&&(de=I.call(s,de,!0)),de}let ve=bt?C.outerHTML:C.innerHTML;return bt&&X["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&pe(Vc,C.ownerDocument.doctype.name)&&(ve="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+ve),yt&&bs([N,U,O],Qe=>{ve=xn(ve,Qe," ")}),x&&hs?x.createHTML(ve):ve},t.setConfig=function(){let F=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ta(F),ba=!0},t.clearConfig=function(){Yt=null,ba=!1},t.isValidAttribute=function(F,S,C){Yt||Ta({});const D=ne(F),G=ne(S);return rr(D,G,C)},t.addHook=function(F,S){typeof S=="function"&&An(M[F],S)},t.removeHook=function(F,S){if(S!==void 0){const C=df(M[F],S);return C===-1?void 0:uf(M[F],C,1)[0]}return Ir(M[F])},t.removeHooks=function(F){M[F]=[]},t.removeAllHooks=function(){M=Br()},t}var Dt=Hc();function Zi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var zt=Zi();function Gc(e){zt=e}var Rt={exec:()=>null};function W(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(a,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(fe.caret,"$1"),n=n.replace(a,o),s},getRegex:()=>new RegExp(n,t)};return s}var Cf=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),fe={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Rf=/^(?:[ \t]*(?:\n|$))+/,Ef=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Pf=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,as=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Lf=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,eo=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Qc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Yc=W(Qc).replace(/bull/g,eo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),If=W(Qc).replace(/bull/g,eo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),to=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Df=/^[^\n]+/,no=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Mf=W(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",no).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Of=W(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,eo).getRegex(),na="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",so=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ff=W("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",so).replace("tag",na).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Jc=W(to).replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",na).getRegex(),Nf=W(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Jc).getRegex(),ao={blockquote:Nf,code:Ef,def:Mf,fences:Pf,heading:Lf,hr:as,html:Ff,lheading:Yc,list:Of,newline:Rf,paragraph:Jc,table:Rt,text:Df},Ur=W("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",na).getRegex(),Bf={...ao,lheading:If,table:Ur,paragraph:W(to).replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ur).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",na).getRegex()},Uf={...ao,html:W(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",so).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Rt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:W(to).replace("hr",as).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Yc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},zf=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Kf=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Xc=/^( {2,}|\\)\n(?!\s*$)/,Wf=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,sa=/[\p{P}\p{S}]/u,io=/[\s\p{P}\p{S}]/u,Zc=/[^\s\p{P}\p{S}]/u,qf=W(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,io).getRegex(),ed=/(?!~)[\p{P}\p{S}]/u,jf=/(?!~)[\s\p{P}\p{S}]/u,Vf=/(?:[^\s\p{P}\p{S}]|~)/u,td=/(?![*_])[\p{P}\p{S}]/u,Hf=/(?![*_])[\s\p{P}\p{S}]/u,Gf=/(?:[^\s\p{P}\p{S}]|[*_])/u,Qf=W(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Cf?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),nd=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Yf=W(nd,"u").replace(/punct/g,sa).getRegex(),Jf=W(nd,"u").replace(/punct/g,ed).getRegex(),sd="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Xf=W(sd,"gu").replace(/notPunctSpace/g,Zc).replace(/punctSpace/g,io).replace(/punct/g,sa).getRegex(),Zf=W(sd,"gu").replace(/notPunctSpace/g,Vf).replace(/punctSpace/g,jf).replace(/punct/g,ed).getRegex(),eg=W("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Zc).replace(/punctSpace/g,io).replace(/punct/g,sa).getRegex(),tg=W(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,td).getRegex(),ng="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",sg=W(ng,"gu").replace(/notPunctSpace/g,Gf).replace(/punctSpace/g,Hf).replace(/punct/g,td).getRegex(),ag=W(/\\(punct)/,"gu").replace(/punct/g,sa).getRegex(),ig=W(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),og=W(so).replace("(?:-->|$)","-->").getRegex(),rg=W("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",og).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Fs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,lg=W(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Fs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ad=W(/^!?\[(label)\]\[(ref)\]/).replace("label",Fs).replace("ref",no).getRegex(),id=W(/^!?\[(ref)\](?:\[\])?/).replace("ref",no).getRegex(),cg=W("reflink|nolink(?!\\()","g").replace("reflink",ad).replace("nolink",id).getRegex(),zr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,oo={_backpedal:Rt,anyPunctuation:ag,autolink:ig,blockSkip:Qf,br:Xc,code:Kf,del:Rt,delLDelim:Rt,delRDelim:Rt,emStrongLDelim:Yf,emStrongRDelimAst:Xf,emStrongRDelimUnd:eg,escape:zf,link:lg,nolink:id,punctuation:qf,reflink:ad,reflinkSearch:cg,tag:rg,text:Wf,url:Rt},dg={...oo,link:W(/^!?\[(label)\]\((.*?)\)/).replace("label",Fs).getRegex(),reflink:W(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Fs).getRegex()},mi={...oo,emStrongRDelimAst:Zf,emStrongLDelim:Jf,delLDelim:tg,delRDelim:sg,url:W(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",zr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:W(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",zr).getRegex()},ug={...mi,br:W(Xc).replace("{2,}","*").getRegex(),text:W(mi.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},$s={normal:ao,gfm:Bf,pedantic:Uf},Rn={normal:oo,gfm:mi,breaks:ug,pedantic:dg},pg={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Kr=e=>pg[e];function Ke(e,t){if(t){if(fe.escapeTest.test(e))return e.replace(fe.escapeReplace,Kr)}else if(fe.escapeTestNoEncode.test(e))return e.replace(fe.escapeReplaceNoEncode,Kr);return e}function Wr(e){try{e=encodeURI(e).replace(fe.percentDecode,"%")}catch{return null}return e}function qr(e,t){let n=e.replace(fe.findPipe,(i,o,l)=>{let d=!1,u=o;for(;--u>=0&&l[u]==="\\";)d=!d;return d?"|":" |"}),s=n.split(fe.splitPipe),a=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;a<s.length;a++)s[a]=s[a].trim().replace(fe.slashPipe,"|");return s}function En(e,t,n){let s=e.length;if(s===0)return"";let a=0;for(;a<s&&e.charAt(s-a-1)===t;)a++;return e.slice(0,s-a)}function hg(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function fg(e,t=0){let n=t,s="";for(let a of e)if(a==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=a,n++;return s}function jr(e,t,n,s,a){let i=t.href,o=t.title||null,l=e[1].replace(a.other.outputLinkReplace,"$1");s.state.inLink=!0;let d={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,d}function gg(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let a=s[1];return t.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=a.length?i.slice(a.length):i}).join(`
`)}var Ns=class{options;rules;lexer;constructor(e){this.options=e||zt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:En(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=gg(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=En(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:En(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=En(t[0],`
`).split(`
`),s="",a="",i=[];for(;n.length>0;){let o=!1,l=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))l.push(n[d]),o=!0;else if(!o)l.push(n[d]);else break;n=n.slice(d);let u=l.join(`
`),h=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,a=a?`${a}
${h}`:h;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=f,n.length===0)break;let m=i.at(-1);if(m?.type==="code")break;if(m?.type==="blockquote"){let w=m,$=w.raw+`
`+n.join(`
`),c=this.blockquote($);i[i.length-1]=c,s=s.substring(0,s.length-w.raw.length)+c.raw,a=a.substring(0,a.length-w.text.length)+c.text;break}else if(m?.type==="list"){let w=m,$=w.raw+`
`+n.join(`
`),c=this.list($);i[i.length-1]=c,s=s.substring(0,s.length-m.raw.length)+c.raw,a=a.substring(0,a.length-w.raw.length)+c.raw,n=$.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:a}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,a={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;e;){let d=!1,u="",h="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let f=fg(t[2].split(`
`,1)[0],t[1].length),m=e.split(`
`,1)[0],w=!f.trim(),$=0;if(this.options.pedantic?($=2,h=f.trimStart()):w?$=t[1].length+1:($=f.search(this.rules.other.nonSpaceChar),$=$>4?1:$,h=f.slice($),$+=t[1].length),w&&this.rules.other.blankLine.test(m)&&(u+=m+`
`,e=e.substring(m.length+1),d=!0),!d){let c=this.rules.other.nextBulletRegex($),g=this.rules.other.hrRegex($),k=this.rules.other.fencesBeginRegex($),A=this.rules.other.headingBeginRegex($),T=this.rules.other.htmlBeginRegex($),x=this.rules.other.blockquoteBeginRegex($);for(;e;){let _=e.split(`
`,1)[0],P;if(m=_,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),P=m):P=m.replace(this.rules.other.tabCharGlobal,"    "),k.test(m)||A.test(m)||T.test(m)||x.test(m)||c.test(m)||g.test(m))break;if(P.search(this.rules.other.nonSpaceChar)>=$||!m.trim())h+=`
`+P.slice($);else{if(w||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||k.test(f)||A.test(f)||g.test(f))break;h+=`
`+m}w=!m.trim(),u+=_+`
`,e=e.substring(_.length+1),f=P.slice($)}}a.loose||(o?a.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),a.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),a.raw+=u}let l=a.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let d of a.items){if(this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]),d.task){if(d.text=d.text.replace(this.rules.other.listReplaceTask,""),d.tokens[0]?.type==="text"||d.tokens[0]?.type==="paragraph"){d.tokens[0].raw=d.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),d.tokens[0].text=d.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let h=this.lexer.inlineQueue.length-1;h>=0;h--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)){this.lexer.inlineQueue[h].src=this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(d.raw);if(u){let h={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};d.checked=h.checked,a.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=h.raw+d.tokens[0].raw,d.tokens[0].text=h.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(h)):d.tokens.unshift({type:"paragraph",raw:h.raw,text:h.raw,tokens:[h]}):d.tokens.unshift(h)}}if(!a.loose){let u=d.tokens.filter(f=>f.type==="space"),h=u.length>0&&u.some(f=>this.rules.other.anyLine.test(f.raw));a.loose=h}}if(a.loose)for(let d of a.items){d.loose=!0;for(let u of d.tokens)u.type==="text"&&(u.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:a}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=qr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),a=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of a)i.rows.push(qr(o,i.header.length).map((l,d)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[d]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=En(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=hg(t[2],"()");if(i===-2)return;if(i>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],a="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],a=i[3])}else a=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),jr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=t[s.toLowerCase()];if(!a){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return jr(n,a,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,d=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+a);(s=u.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(o=[...i].length,s[3]||s[4]){l+=o;continue}else if((s[5]||s[6])&&a%3&&!((a+o)%3)){d+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+d);let h=[...s[0]][0].length,f=e.slice(0,a+s.index+h+o);if(Math.min(a,o)%2){let w=f.slice(1,-1);return{type:"em",raw:f,text:w,tokens:this.lexer.inlineTokens(w)}}let m=f.slice(2,-2);return{type:"strong",raw:f,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),a=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&a&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,d=this.rules.inline.delRDelim;for(d.lastIndex=0,t=t.slice(-1*e.length+a);(s=d.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(o=[...i].length,o!==a))continue;if(s[3]||s[4]){l+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l);let u=[...s[0]][0].length,h=e.slice(0,a+s.index+u+o),f=h.slice(a,-a);return{type:"del",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(a!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Le=class vi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||zt,this.options.tokenizer=this.options.tokenizer||new Ns,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:fe,block:$s.normal,inline:Rn.normal};this.options.pedantic?(n.block=$s.pedantic,n.inline=Rn.pedantic):this.options.gfm&&(n.block=$s.gfm,this.options.breaks?n.inline=Rn.breaks:n.inline=Rn.gfm),this.tokenizer.rules=n}static get rules(){return{block:$s,inline:Rn}}static lex(t,n){return new vi(n).lex(t)}static lexInline(t,n){return new vi(n).inlineTokens(t)}lex(t){t=t.replace(fe.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(fe.tabCharGlobal,"    ").replace(fe.spaceLine,""));t;){let a;if(this.options.extensions?.block?.some(o=>(a=o.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let o=n.at(-1);a.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let i=t;if(this.options.extensions?.startBlock){let o=1/0,l=t.slice(1),d;this.options.extensions.startBlock.forEach(u=>{d=u.call({lexer:this},l),typeof d=="number"&&d>=0&&(o=Math.min(o,d))}),o<1/0&&o>=0&&(i=t.substring(0,o+1))}if(this.state.top&&(a=this.tokenizer.paragraph(i))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a),s=i.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,a=null;if(this.tokens.links){let d=Object.keys(this.tokens.links);if(d.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)d.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,a.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(a=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=a[2]?a[2].length:0,s=s.slice(0,a.index+i)+"["+"a".repeat(a[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,l="";for(;t;){o||(l=""),o=!1;let d;if(this.options.extensions?.inline?.some(h=>(d=h.call({lexer:this},t,n))?(t=t.substring(d.raw.length),n.push(d),!0):!1))continue;if(d=this.tokenizer.escape(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.tag(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.link(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(d.raw.length);let h=n.at(-1);d.type==="text"&&h?.type==="text"?(h.raw+=d.raw,h.text+=d.text):n.push(d);continue}if(d=this.tokenizer.emStrong(t,s,l)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.codespan(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.br(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.del(t,s,l)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.autolink(t)){t=t.substring(d.raw.length),n.push(d);continue}if(!this.state.inLink&&(d=this.tokenizer.url(t))){t=t.substring(d.raw.length),n.push(d);continue}let u=t;if(this.options.extensions?.startInline){let h=1/0,f=t.slice(1),m;this.options.extensions.startInline.forEach(w=>{m=w.call({lexer:this},f),typeof m=="number"&&m>=0&&(h=Math.min(h,m))}),h<1/0&&h>=0&&(u=t.substring(0,h+1))}if(d=this.tokenizer.inlineText(u)){t=t.substring(d.raw.length),d.raw.slice(-1)!=="_"&&(l=d.raw.slice(-1)),o=!0;let h=n.at(-1);h?.type==="text"?(h.raw+=d.raw,h.text+=d.text):n.push(d);continue}if(t){let h="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(h);break}else throw new Error(h)}}return n}},Bs=class{options;parser;constructor(e){this.options=e||zt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(fe.notSpaceStart)?.[0],a=e.replace(fe.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ke(s)+'">'+(n?a:Ke(a,!0))+`</code></pre>
`:"<pre><code>"+(n?a:Ke(a,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ke(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),a=Wr(e);if(a===null)return s;e=a;let i='<a href="'+e+'"';return t&&(i+=' title="'+Ke(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let a=Wr(e);if(a===null)return Ke(n);e=a;let i=`<img src="${e}" alt="${Ke(n)}"`;return t&&(i+=` title="${Ke(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ke(e.text)}},ro=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ie=class yi{options;renderer;textRenderer;constructor(t){this.options=t||zt,this.options.renderer=this.options.renderer||new Bs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ro}static parse(t,n){return new yi(n).parse(t)}static parseInline(t,n){return new yi(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let a=t[s];if(this.options.extensions?.renderers?.[a.type]){let o=a,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=l||"";continue}}let i=a;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let a=0;a<t.length;a++){let i=t[a];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let o=i;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Mn=class{options;block;constructor(t){this.options=t||zt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Le.lex:Le.lexInline}provideParser(){return this.block?Ie.parse:Ie.parseInline}},mg=class{defaults=Zi();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ie;Renderer=Bs;TextRenderer=ro;Lexer=Le;Tokenizer=Ns;Hooks=Mn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let a=s;for(let i of a.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of a.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let a=s;n=n.concat(this.walkTokens(a.items,t));break}default:{let a=s;this.defaults.extensions?.childTokens?.[a.type]?this.defaults.extensions.childTokens[a.type].forEach(i=>{let o=a[i].flat(1/0);n=n.concat(this.walkTokens(o,t))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){let i=t.renderers[a.name];i?t.renderers[a.name]=function(...o){let l=a.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:t.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[a.level];i?i.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level==="block"?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level==="inline"&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),s.extensions=t),n.renderer){let a=this.defaults.renderer||new Bs(this.defaults);for(let i in n.renderer){if(!(i in a))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=n.renderer[o],d=a[o];a[o]=(...u)=>{let h=l.apply(a,u);return h===!1&&(h=d.apply(a,u)),h||""}}s.renderer=a}if(n.tokenizer){let a=this.defaults.tokenizer||new Ns(this.defaults);for(let i in n.tokenizer){if(!(i in a))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=n.tokenizer[o],d=a[o];a[o]=(...u)=>{let h=l.apply(a,u);return h===!1&&(h=d.apply(a,u)),h}}s.tokenizer=a}if(n.hooks){let a=this.defaults.hooks||new Mn;for(let i in n.hooks){if(!(i in a))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=n.hooks[o],d=a[o];Mn.passThroughHooks.has(i)?a[o]=u=>{if(this.defaults.async&&Mn.passThroughHooksRespectAsync.has(i))return(async()=>{let f=await l.call(a,u);return d.call(a,f)})();let h=l.call(a,u);return d.call(a,h)}:a[o]=(...u)=>{if(this.defaults.async)return(async()=>{let f=await l.apply(a,u);return f===!1&&(f=await d.apply(a,u)),f})();let h=l.apply(a,u);return h===!1&&(h=d.apply(a,u)),h}}s.hooks=a}if(n.walkTokens){let a=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),a&&(l=l.concat(a.call(this,o))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Le.lex(e,t??this.defaults)}parser(e,t){return Ie.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},a={...this.defaults,...s},i=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(a.hooks&&(a.hooks.options=a,a.hooks.block=e),a.async)return(async()=>{let o=a.hooks?await a.hooks.preprocess(t):t,l=await(a.hooks?await a.hooks.provideLexer():e?Le.lex:Le.lexInline)(o,a),d=a.hooks?await a.hooks.processAllTokens(l):l;a.walkTokens&&await Promise.all(this.walkTokens(d,a.walkTokens));let u=await(a.hooks?await a.hooks.provideParser():e?Ie.parse:Ie.parseInline)(d,a);return a.hooks?await a.hooks.postprocess(u):u})().catch(i);try{a.hooks&&(t=a.hooks.preprocess(t));let o=(a.hooks?a.hooks.provideLexer():e?Le.lex:Le.lexInline)(t,a);a.hooks&&(o=a.hooks.processAllTokens(o)),a.walkTokens&&this.walkTokens(o,a.walkTokens);let l=(a.hooks?a.hooks.provideParser():e?Ie.parse:Ie.parseInline)(o,a);return a.hooks&&(l=a.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Ke(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Mt=new mg;function j(e,t){return Mt.parse(e,t)}j.options=j.setOptions=function(e){return Mt.setOptions(e),j.defaults=Mt.defaults,Gc(j.defaults),j};j.getDefaults=Zi;j.defaults=zt;j.use=function(...e){return Mt.use(...e),j.defaults=Mt.defaults,Gc(j.defaults),j};j.walkTokens=function(e,t){return Mt.walkTokens(e,t)};j.parseInline=Mt.parseInline;j.Parser=Ie;j.parser=Ie.parse;j.Renderer=Bs;j.TextRenderer=ro;j.Lexer=Le;j.lexer=Le.lex;j.Tokenizer=Ns;j.Hooks=Mn;j.parse=j;j.options;j.setOptions;j.use;j.walkTokens;j.parseInline;Ie.parse;Le.lex;j.setOptions({gfm:!0,breaks:!0,mangle:!1});const vg=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,yg=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g");function od(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(yg,s=>{const a=s.endsWith("/");if(!a&&!vg.test(s))return s;const i=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,o=s.replace(/\/+$/,"").split("/");return`[${a?(o.pop()??s)+"/":o.pop()??s}](${i})`}));return t.join("")}const Zn=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],es=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],bi=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let Vr=!1;const bg=14e4,wg=14e4,$g=200,Fa=5e4,Pt=new Map;function kg(e){const t=Pt.get(e);return t===void 0?null:(Pt.delete(e),Pt.set(e,t),t)}function Hr(e,t){if(Pt.set(e,t),Pt.size<=$g)return;const n=Pt.keys().next().value;n&&Pt.delete(n)}function aa(){Vr||(Vr=!0,Dt.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),Dt.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function be(e){const t=e.trim();if(!t)return"";if(aa(),t.length<=Fa){const l=kg(t);if(l!==null)return l}const n=Wc(t,bg),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>wg){const d=`<pre class="code-block">${Eg(`${n.text}${s}`)}</pre>`,u=Dt.sanitize(d,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:bi});return t.length<=Fa&&Hr(t,u),u}const a=od(`${n.text}${s}`),i=j.parse(a),o=Dt.sanitize(i,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:bi});return t.length<=Fa&&Hr(t,o),o}function Sg(e){const t=e.trim();if(!t)return"";aa();const n=j.parse(t);return Dt.sanitize(n,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:bi}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}function rd(e){const t=e.trim();return t?(aa(),Dt.sanitize(t,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}const Ag=[...Zn,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],xg=[...es,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function Tg(e){const t=e.trim();if(!t)return"";aa();const{styles:n,html:s}=_g(t),a=Dt.sanitize(s,{ALLOWED_TAGS:Ag,ALLOWED_ATTR:xg,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),i=".dashboard-render";return n.map(l=>`<style>${Rg(l,i)}</style>`).join(`
`)+a}function _g(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,l)=>(t.push(l),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),i=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:i}}function Cg(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function Rg(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let a=0;for(;a<n.length;){if(/\s/.test(n[a])){s.push(n[a]),a++;continue}if(n[a]==="/"&&n[a+1]==="*"){const h=n.indexOf("*/",a+2),f=h===-1?n.length:h+2;s.push(n.slice(a,f)),a=f;continue}if(n[a]==="}"){s.push("}"),a++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(a,a+30))){const h=Cg(n,a);s.push(n.slice(a,h)),a=h;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(a,a+20))){const h=n.indexOf("{",a);if(h===-1){s.push(n.slice(a));break}s.push(n.slice(a,h+1)),a=h+1;continue}const i=n.indexOf("{",a);if(i===-1){s.push(n.slice(a));break}const o=n.slice(a,i).trim(),l=n.indexOf("}",i);if(l===-1){s.push(n.slice(a));break}const d=n.slice(i+1,l),u=o.split(",").map(h=>{const f=h.trim();if(!f)return h;if(f==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(f))return t;const m=f.replace(/^(html|body|:root)\s+/i,"");return`${t} ${m}`}).join(", ");s.push(`${u} {${d}}`),a=l+1}return s.join("")}function Eg(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Pg=500;let At="",xt="";function ld(e){const t=e.trim();if(!t)return"";if(t.length<Pg)return be(t);const n=Ig(t);if(n<0)return be(t);const s=t.slice(0,n),a=t.slice(n);if(s===At)return xt+be(a);if(s.startsWith(At)&&At.length>0){const i=s.slice(At.length);return xt=xt+be(i),At=s,xt+be(a)}return xt=be(s),At=s,xt+be(a)}function Lg(){At="",xt=""}function Ig(e){let t=!1,n="";const s=[];let a=0;for(;a<e.length;){const i=e.indexOf(`
`,a),o=i===-1?e.length:i,l=e.slice(a,o),d=l.trimStart(),u=d.match(/^(`{3,}|~{3,})/);if(u){const h=u[1];t?h.charAt(0)===n.charAt(0)&&h.length>=n.length&&d.slice(h.length).trim()===""&&(t=!1,n=""):(t=!0,n=h)}if(!t&&l.trim()===""){let h=o+1;for(;h<e.length&&e[h]===`
`;)h++;h<e.length&&(s.length===0||s[s.length-1]!==h)&&s.push(h)}a=i===-1?e.length:i+1}return s.length<2?-1:s[s.length-2]}const q={messageSquare:r`
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
  `},Dg=1500,Mg=2e3,cd="Copy as markdown",Og="Copied",Fg="Copy failed";async function Ng(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function ks(e,t){e.title=t,e.setAttribute("aria-label",t)}function Bg(e){const t=e.label??cd;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const a=await Ng(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!a){s.dataset.error="1",ks(s,Fg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,ks(s,t))},Mg);return}s.dataset.copied="1",ks(s,Og),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,ks(s,t))},Dg)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${q.copy}</span>
        <span class="chat-copy-btn__icon-check">${q.check}</span>
      </span>
    </button>
  `}function Ug(e){return Bg({text:()=>e,label:cd})}const Gr="NO_REPLY",zg=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,Kg=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Na(e){let t=e.replace(zg,"").trim();const n=t.toLowerCase();for(const s of Kg){const a=n.indexOf(s);if(a!==-1){const i=a+s.length,o=t.slice(i),l=o.search(/\n\n(?=[A-Z])/);l!==-1?t=o.slice(l).trim():t="";break}}return t}const Wg=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,qg=/^\s*(\d{3})\s+\{/;function lo(e){const t=e.trim(),n=t.match(qg);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!Wg.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const jg=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,Vg=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,Hg=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function Gg(e){return e.replace(Vg,"").replace(jg,"").replace(Hg,"").trim()}const Qg=/^\[([^\]]+)\]\s*/,Yg=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Ba=new WeakMap,Ua=new WeakMap;function Jg(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Yg.some(t=>e.startsWith(`${t} `))}function _s(e){const t=e.match(Qg);if(!t)return e;const n=t[1]??"";return Jg(n)?e.slice(t[0].length):e}function za(e){const t=e.trim();return t===Gr||t.startsWith(`${Gr}
`)}function un(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const a=Na(s);if(!a)return null;const i=lo(a);if(i)return i;const o=n==="assistant"?Gg(a):a;if(n==="assistant"&&!o)return null;const l=n==="assistant"?Ea(o):_s(a);return za(l)?null:l}if(Array.isArray(s)){const a=s.map(i=>{const o=i;return o.type==="text"&&typeof o.text=="string"?Na(o.text):null}).filter(i=>typeof i=="string"&&i.length>0);if(a.length>0){const i=a.join(`
`),o=n==="assistant"?Ea(i):_s(i);return za(o)?null:o}}if(typeof t.text=="string"){const a=Na(t.text);if(!a)return null;const i=n==="assistant"?Ea(a):_s(a);return za(i)?null:i}return null}function co(e){if(!e||typeof e!="object")return un(e);const t=e;if(Ba.has(t))return Ba.get(t)??null;const n=un(e);return Ba.set(t,n),n}function wi(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const d=l;if(d.type==="thinking"&&typeof d.thinking=="string"){const u=d.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const a=ud(e);if(!a)return null;const o=[...a.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function dd(e){if(!e||typeof e!="object")return wi(e);const t=e;if(Ua.has(t))return Ua.get(t)??null;const n=wi(e);return Ua.set(t,n),n}function ud(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(a=>{const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>typeof a=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function pd(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const Xg=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:ud,extractText:un,extractTextCached:co,extractThinking:wi,extractThinkingCached:dd,formatApiError:lo,formatReasoningMarkdown:pd,stripEnvelope:_s},Symbol.toStringTag,{value:"Module"}));function hd(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",a=t.content,i=Array.isArray(a)?a:null,o=Array.isArray(i)&&i.some(f=>{const m=f,w=(typeof m.type=="string"?m.type:"").toLowerCase();return w==="toolresult"||w==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||l)&&(n="toolResult");let d=[];typeof t.content=="string"?d=[{type:"text",text:t.content}]:Array.isArray(t.content)?d=t.content.map(f=>({type:f.type||"text",text:f.text,name:f.name,args:f.args||f.arguments})):typeof t.text=="string"&&(d=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),h=typeof t.id=="string"?t.id:void 0;return{role:n,content:d,timestamp:u,id:h}}function uo(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function fd(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const Qr={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function gd(e){const t=e.split(".").pop()?.toLowerCase()||"";return Qr[t]??Qr.default}function md(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const Zg={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},em={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},tm={fallback:Zg,tools:em},vd=tm,Yr=vd.fallback??{icon:"puzzle"},nm=vd.tools??{};function sm(e){return(e??"tool").trim()}function am(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function im(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function yd(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>yd(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function om(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function rm(e,t){for(const n of t){const s=om(e,n),a=yd(s);if(a)return a}}function lm(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,a=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&a!==void 0?`${n}:${s}-${s+a}`:n}function cm(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function dm(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function um(e){const t=sm(e.name),n=t.toLowerCase(),s=nm[n],a=s?.icon??Yr.icon??"puzzle",i=s?.title??am(t),o=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,d=typeof l=="string"?l.trim():void 0,u=dm(s,d),h=im(u?.label??d);let f;n==="read"&&(f=lm(e.args)),!f&&(n==="write"||n==="edit"||n==="attach")&&(f=cm(e.args));const m=u?.detailKeys??s?.detailKeys??Yr.detailKeys??[];return!f&&m.length>0&&(f=rm(e.args,m)),!f&&e.meta&&(f=e.meta),f&&(f=hm(f)),{name:t,icon:a,title:i,label:o,verb:h,detail:f}}function pm(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function hm(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const fm=80,gm=2,Jr=100,mm=3;function Xr(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function vm(e){const t=e.split(`
`),n=t.slice(0,gm),s=n.join(`
`);return s.length>Jr?s.slice(0,Jr)+"…":n.length<t.length?s+"…":s}function ym(e){const t=e,n=km(t.content),s=[];for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(i)||typeof a.name=="string"&&a.arguments!=null)&&s.push({kind:"call",name:a.name??"tool",args:Sm(a.arguments??a.args)})}for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();if(i!=="toolresult"&&i!=="tool_result")continue;const o=Am(a);if(el(o))continue;const l=typeof a.name=="string"?a.name:"tool";s.push({kind:"result",name:l,text:o})}if(fd(e)&&!s.some(a=>a.kind==="result")){const a=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",i=co(e)??void 0;el(i)||s.push({kind:"result",name:a,text:i})}return s}const bm=new Set(["write","read","edit","attach"]);function wm(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function $m(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function Zr(e,t,n,s,a){const i=um({name:e.name,args:e.args}),o=pm(i),l=!!e.text?.trim(),d=xm(e.text);if(d?.type==="proof"&&d.slug)return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${q.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${d.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?r`<button class="chat-artifact-card__btn" @click=${A=>{A.stopPropagation(),s(d.slug)}}>Open</button>`:p}
          ${d.filePath&&a?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${A=>{A.stopPropagation(),a(d.filePath)}}>Drive</button>`:p}
        </div>
      </div>
    `;const u=bm.has(e.name.toLowerCase())?wm(e.args)??$m(e.text):null;if(u&&e.kind==="result"){const A=u.split("/").pop()||u,T=A.split(".").pop()?.toLowerCase()||"",x=gd(A),_=md(T,A);return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${x}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${u}>${A}</span>
          <span class="chat-artifact-card__type">${_}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?r`<button class="chat-artifact-card__btn" @click=${P=>{P.stopPropagation(),n(u)}}>Open</button>`:t&&l?r`<button class="chat-artifact-card__btn" @click=${P=>{P.stopPropagation(),t(Xr(e.text))}}>View</button>`:p}
          ${a?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${P=>{P.stopPropagation(),a(u)}}>Drive</button>`:p}
        </div>
      </div>
    `}const h=!!t||!!(n&&u),f=h?A=>{if(A.stopPropagation(),n&&u){n(u);return}if(t&&l){t(Xr(e.text));return}if(t){const T=`## ${i.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(T)}}:void 0,m=e.text?e.text.split(`
`).length:0,w=l&&(e.text?.length??0)<=fm,$=l&&!w&&m>mm,c=l&&!$,g=!l,k=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${k} ${h?"chat-tool-card--clickable":""}"
      @click=${f}
      role=${h?"button":p}
      tabindex=${h?"0":p}
      @keydown=${h?A=>{A.key!=="Enter"&&A.key!==" "||(A.preventDefault(),A.stopPropagation(),f?.(A))}:p}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${q[i.icon]}</span>
          <span>${i.label}</span>
        </div>
        ${h?r`<span class="chat-tool-card__action">${l?"View":""} ${q.check}</span>`:p}
        ${g&&!h?r`<span class="chat-tool-card__status">${q.check}</span>`:p}
      </div>
      ${o?r`<div class="chat-tool-card__detail">${o}</div>`:p}
      ${g?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:p}
      ${$?r`<details class="chat-tool-card__expandable" @click=${A=>A.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${vm(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:p}
      ${c?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:p}
    </div>
  `}function km(e){return Array.isArray(e)?e.filter(Boolean):[]}function Sm(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Am(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function xm(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function el(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}const tl={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function bd(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=tl[t]??tl.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function Tm(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],a=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let i;for(;(i=a.exec(n))!==null;)s.push({fileName:i[1].trim(),fileId:i[2].trim(),size:i[3].trim(),mimeType:i[4].trim()});return s.length>0?s:null}function _m(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${gd(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${md(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function Cm(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}function Rm(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const i=e.indexOf(`

`);return i!==-1?e.slice(i+2).trim():""}let a=e.split(`
`).filter(i=>{const o=i.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;a.startsWith(`
`);)a=a.slice(1);return a.trim()}function Em(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function $i(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"){const l=o.source;if(l?.type==="base64"&&typeof l.data=="string"){const d=l.data,u=l.media_type||"image/png",h=d.startsWith("data:")?d:`data:${u};base64,${d}`;s.push({url:h})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const d=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:d})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const l=o.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,d=o.text.match(l);if(d)for(const u of d)s.push({url:u})}if(Array.isArray(o.content))for(const l of o.content){if(typeof l!="object"||l===null)continue;const d=l;if(d.type==="image"){const u=d.source;if(u?.type==="base64"&&typeof u.data=="string"){const h=u.media_type||"image/png",f=u.data.startsWith("data:")?u.data:`data:${h};base64,${u.data}`;s.push({url:f})}else if(typeof d.data=="string"&&typeof d.mimeType=="string"){const h=d.data.startsWith("data:")?d.data:`data:${d.mimeType};base64,${d.data}`;s.push({url:h})}else d.omitted===!0&&s.push({omitted:!0,bytes:typeof d.bytes=="number"?d.bytes:void 0,mimeType:typeof d.mimeType=="string"?d.mimeType:void 0,alt:typeof d.fileName=="string"?d.fileName:void 0})}}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"&&typeof o.content=="string"){const l=o.mimeType||"image/png",d=o.content.startsWith("data:")?o.content:`data:${l};base64,${o.content}`;s.push({url:d,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function Pm(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="attachment"&&typeof o.content=="string"){const l=o.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:l,content:o.content})}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function Lm(e,t){return r`
    <div class="chat-group assistant">
      ${po("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${bd(t.name)}</span>
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
  `}function Im(e,t,n,s,a){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${po("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${a?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${bd(a.name)}</span>
                    <strong>${a.name}</strong>
                  </span>
                </div>
                ${a.details?r`<span class="chat-working-indicator__details">${a.details}</span>`:p}
              </div>
            `:p}
        ${wd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function Dm(e,t){const n=uo(e.role),s=t.assistantName??"Assistant",a=t.userName??"You",i=n==="user"?a:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${po(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:a,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((d,u)=>wd(d.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function po(e,t){const n=uo(e),s=t?.assistantName?.trim()||"Assistant",a=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",i=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&nl(o)?r`<img
        class="chat-avatar ${l}"
        src="${o}"
        alt="${i}"
      />`:o?r`<div class="chat-avatar ${l}">${o}</div>`:r`<div class="chat-avatar ${l}">${i.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?a&&nl(a)?r`<img
        class="chat-avatar ${l}"
        src="${a}"
        alt="${s}"
      />`:a?r`<div class="chat-avatar ${l}" style="color: var(--accent);">${a}</div>`:r`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${l}">⚙</div>`:r`<div class="chat-avatar ${l}">?</div>`}function nl(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function sl(e,t,n){if(e.length===0)return p;const s=e.map((i,o)=>{if((i.omitted||!i.url)&&n){const l=n(o);if(l)return{...i,resolvedUrl:l}}return i}),a=s.filter(i=>(i.resolvedUrl||i.url)&&!i.omitted||i.resolvedUrl).map(i=>({url:i.resolvedUrl||i.url,alt:i.alt}));return r`
    <div class="chat-message-images">
      ${s.map(i=>{const o=i.resolvedUrl||i.url;if(!o){const d=Em(i.bytes),h=[i.mimeType?i.mimeType.replace("image/","").toUpperCase():null,d].filter(Boolean).join(" · ");return r`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${i.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${h||"Image"}</span>
            </div>
          `}const l=a.findIndex(d=>d.url===o);return r`
          <img
            src=${o}
            alt=${i.alt??"Attached image"}
            class="chat-message-image"
            @error=${d=>{const u=d.target;u.style.display="none"}}
            @click=${()=>{t&&t(o,a,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function Mm(e){return e.length===0?p:r`
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
  `}function wd(e,t,n,s,a,i,o,l){try{return Om(e,t,n,s,a,i,o,l)}catch(d){return console.error("[chat] message render error:",d),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function Om(e,t,n,s,a,i,o,l){const d=e,u=typeof d.role=="string"?d.role:"unknown",h=fd(e)||u.toLowerCase()==="toolresult"||u.toLowerCase()==="tool_result"||typeof d.toolCallId=="string"||typeof d.tool_call_id=="string",f=ym(e),m=f.length>0,w=$i(e),$=w.length>0,c=typeof d._chatIdx=="number"?d._chatIdx:-1,g=o&&c>=0?U=>o(c,U):void 0,k=Pm(e),A=k.length>0,T=co(e),x=t.showReasoning&&u==="assistant"?dd(e):null,_=u==="user"&&T?Tm(T):null,P=_&&_.length>0;let E=T;if(u==="user"&&E&&(E=Rm(E)),E&&(E=E.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),E){const U=lo(E);U&&(E=U)}P&&E&&(E=Cm(E));const Z=E?.trim()?E:null,Y=x?pd(x):null,I=Z,M=u==="assistant"&&!!I?.trim(),N=["chat-bubble",M?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(m&&h)return r`
      ${$?sl(w,i,g):p}
      ${f.map(U=>Zr(U,n,s,a,l))}
    `;if(!I&&!m&&!$&&!A&&!P&&!Y){const U=typeof d.errorMessage=="string"?d.errorMessage:null;if(d.stopReason==="error"&&U){let O=U;const ie=U.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(ie){const ke=parseInt(ie[1]).toLocaleString(),J=parseInt(ie[2]).toLocaleString();O=`Context overflow: ${ke} tokens exceeded the ${J} token limit. The conversation needs to be compacted.`}else U.includes("prompt is too long")&&(O="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${O}</div>
        </div>
      `}return p}return r`
    <div class="${N}">
      ${M?Ug(I):p}
      ${P?_m(_):p}
      ${sl(w,i,g)}
      ${Mm(k)}
      ${Y?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${Ae(be(Y))}</div>
            </details>`:p}
      ${I?r`<div class="chat-text">${Ae(t.isStreaming?ld(I):be(I))}</div>`:p}
      ${f.map(U=>Zr(U,n,s,a,l))}
    </div>
  `}function Fm(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,a=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:p}
      </div>
      <div class="chat-compaction-summary__content">
        ${Ae(be(n))}
      </div>
      ${a?r`<div class="chat-compaction-summary__timestamp">${a}</div>`:p}
    </div>
  `}function Nm(e){return e.isCompactionSummary===!0}async function $d(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function kd(e){if(!(!e.client||!e.connected)&&!e.rosterLoading){e.rosterLoading=!0,e.rosterError=null;try{const t=await e.client.request("queue.roster",{});t?.roster&&(e.rosterData=t.roster)}catch(t){e.rosterError=String(t)}finally{e.rosterLoading=!1}}}const Bm=Object.freeze(Object.defineProperty({__proto__:null,loadAgents:$d,loadRoster:kd},Symbol.toStringTag,{value:"Module"})),Sd=50,Ad=200,Um="Assistant";function Us(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function ki(e){const t=Us(e?.name,Sd)??Um,n=Us(e?.avatar??void 0,Ad)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function zm(){return ki(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const Km="You";function al(e){const t=Us(e?.name,Sd)??Km,n=Us(e?.avatar??void 0,Ad)??null;return{name:t,avatar:n}}function Wm(){return al(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function xd(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const a=await e.client.request("agent.identity.get",s);if(!a)return;const i=ki(a);e.assistantName=i.name,e.assistantAvatar=i.avatar,e.assistantAgentId=i.agentId??null}catch{}}let il=!1;function ol(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function qm(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function jm(){il||(il=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function ia(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),ol(t)}return jm(),ol(qm())}let Tt=null,Cs=null;function Td(){return Cs}const zs=new Map,qe=new Map;function Si(e,t){const n=t.filter(s=>s?.role==="user").length;zs.set(e,n)}async function ho(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return qe.set(t,s),Si(t,s),s}catch{return qe.get(t)??[]}}let Xt=0;async function se(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Xt;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Xt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Si(t,e.chatMessages),qe.set(t,e.chatMessages)}catch{if(n!==Xt||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Xt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Si(t,e.chatMessages),qe.set(t,e.chatMessages)}catch(s){if(n!==Xt||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Xt&&(e.chatLoading=!1)}}async function _d(e,t){const n=[...e.chatMessages],s=n.length;await se(e),e.chatStream=null,!t?.allowShrink&&s>0&&e.chatMessages.length<s&&(e.chatMessages=n,setTimeout(()=>{se(e).then(()=>{e.chatStream=null})},2e3))}function Vm(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function fo(e,t,n,s){if(!e.client||!e.connected)return!1;let a=t.trim();const i=n&&n.length>0;if(!a&&!i)return!1;!a&&i&&(a="[attached]");const o=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(a&&u.push({type:"text",text:a}),i)for(const h of n)h.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:h.mimeType,data:h.dataUrl}}):u.push({type:"attachment",mimeType:h.mimeType,fileName:h.fileName,content:h.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=ia();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=o,Tt={message:a,attachments:i?n:void 0};let d;if(i){const u=[],h=[];for(const f of n){const m=Vm(f.dataUrl);if(m)if(m.mimeType.startsWith("image/"))u.push({type:"image",mimeType:m.mimeType,content:m.content,fileName:f.fileName});else{const w=f.fileName||"file";h.push(`<document>
<source>${w}</source>
<mime_type>${m.mimeType}</mime_type>
<content encoding="base64">
${m.content}
</content>
</document>`)}}if(u.length>0&&(d=u),h.length>0&&(a=`${h.join(`

`)}

${a}`),u.length>0){const f=e.chatMessages.length-1,m=e.sessionKey,w=e.client.request("images.cache",{images:u.map($=>({data:$.content,mimeType:$.mimeType,fileName:$.fileName})),sessionKey:m}).then($=>{if($?.cached&&$.cached.length>0){const c=$.cached.map((g,k)=>({messageIndex:f,imageIndex:k,hash:g.hash,mimeType:g.mimeType,bytes:g.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:m,images:c}).catch(()=>{})}}).catch(()=>{});Cs=w,w.finally(()=>{Cs===w&&(Cs=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:a,deliver:!1,idempotencyKey:l,attachments:d}),!0}catch(u){const h=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=h,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+h}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Cd(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,fo(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function Hm(e){e.pendingRetry=null}async function go(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Rd(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&Lg(),t.state==="delta"){const n=un(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,Tt=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,Tt=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&Tt&&(e.pendingRetry={message:Tt.message,attachments:Tt.attachments,timestamp:Date.now()}),Tt=null;let a=n;if(s){const i=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(i){const o=parseInt(i[1]).toLocaleString(),l=parseInt(i[2]).toLocaleString();a=`⚠️ Context overflow: ${o} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else a='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:a}],timestamp:Date.now(),isError:!0}]}return t.state}const Je=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:go,clearPendingRetry:Hm,getPendingImageCache:Td,handleChatEvent:Rd,laneMessageCache:qe,loadChatHistory:se,loadChatHistoryAfterFinal:_d,loadLaneHistory:ho,retryPendingMessage:Cd,sendChatMessage:fo,sessionTurnCounts:zs},Symbol.toStringTag,{value:"Module"})),Ed="godmode.device.auth.v1";function mo(e){return e.trim()}function Gm(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function vo(){try{const e=window.localStorage.getItem(Ed);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Pd(e){try{window.localStorage.setItem(Ed,JSON.stringify(e))}catch{}}function Qm(e){const t=vo();if(!t||t.deviceId!==e.deviceId)return null;const n=mo(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Ld(e){const t=mo(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=vo();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const a={token:e.token,role:t,scopes:Gm(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=a,Pd(n),a}function Id(e){const t=vo();if(!t||t.deviceId!==e.deviceId)return;const n=mo(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Pd(s)}const Dd={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:ue,n:Rs,Gx:rl,Gy:ll,a:Ka,d:Wa,h:Ym}=Dd,Ot=32,yo=64,Jm=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},ae=(e="")=>{const t=new Error(e);throw Jm(t,ae),t},Xm=e=>typeof e=="bigint",Zm=e=>typeof e=="string",ev=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",gt=(e,t,n="")=>{const s=ev(e),a=e?.length,i=t!==void 0;if(!s||i&&a!==t){const o=n&&`"${n}" `,l=i?` of length ${t}`:"",d=s?`length=${a}`:`type=${typeof e}`;ae(o+"expected Uint8Array"+l+", got "+d)}return e},oa=e=>new Uint8Array(e),Md=e=>Uint8Array.from(e),Od=(e,t)=>e.toString(16).padStart(t,"0"),Fd=e=>Array.from(gt(e)).map(t=>Od(t,2)).join(""),Ye={_0:48,_9:57,A:65,F:70,a:97,f:102},cl=e=>{if(e>=Ye._0&&e<=Ye._9)return e-Ye._0;if(e>=Ye.A&&e<=Ye.F)return e-(Ye.A-10);if(e>=Ye.a&&e<=Ye.f)return e-(Ye.a-10)},Nd=e=>{const t="hex invalid";if(!Zm(e))return ae(t);const n=e.length,s=n/2;if(n%2)return ae(t);const a=oa(s);for(let i=0,o=0;i<s;i++,o+=2){const l=cl(e.charCodeAt(o)),d=cl(e.charCodeAt(o+1));if(l===void 0||d===void 0)return ae(t);a[i]=l*16+d}return a},Bd=()=>globalThis?.crypto,tv=()=>Bd()?.subtle??ae("crypto.subtle must be defined, consider polyfill"),ts=(...e)=>{const t=oa(e.reduce((s,a)=>s+gt(a).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},nv=(e=Ot)=>Bd().getRandomValues(oa(e)),Ks=BigInt,_t=(e,t,n,s="bad number: out of range")=>Xm(e)&&t<=e&&e<n?e:ae(s),L=(e,t=ue)=>{const n=e%t;return n>=0n?n:t+n},Ud=e=>L(e,Rs),sv=(e,t)=>{(e===0n||t<=0n)&&ae("no inverse n="+e+" mod="+t);let n=L(e,t),s=t,a=0n,i=1n;for(;n!==0n;){const o=s/n,l=s%n,d=a-i*o;s=n,n=l,a=i,i=d}return s===1n?L(a,t):ae("no inverse")},av=e=>{const t=qd[e];return typeof t!="function"&&ae("hashes."+e+" not set"),t},qa=e=>e instanceof Te?e:ae("Point expected"),Ai=2n**256n;class Te{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,a){const i=Ai;this.X=_t(t,0n,i),this.Y=_t(n,0n,i),this.Z=_t(s,1n,i),this.T=_t(a,0n,i),Object.freeze(this)}static CURVE(){return Dd}static fromAffine(t){return new Te(t.x,t.y,1n,L(t.x*t.y))}static fromBytes(t,n=!1){const s=Wa,a=Md(gt(t,Ot)),i=t[31];a[31]=i&-129;const o=Kd(a);_t(o,0n,n?Ai:ue);const d=L(o*o),u=L(d-1n),h=L(s*d+1n);let{isValid:f,value:m}=ov(u,h);f||ae("bad point: y not sqrt");const w=(m&1n)===1n,$=(i&128)!==0;return!n&&m===0n&&$&&ae("bad point: x==0, isLastByteOdd"),$!==w&&(m=L(-m)),new Te(m,o,1n,L(m*o))}static fromHex(t,n){return Te.fromBytes(Nd(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=Ka,n=Wa,s=this;if(s.is0())return ae("bad point: ZERO");const{X:a,Y:i,Z:o,T:l}=s,d=L(a*a),u=L(i*i),h=L(o*o),f=L(h*h),m=L(d*t),w=L(h*L(m+u)),$=L(f+L(n*L(d*u)));if(w!==$)return ae("bad point: equation left != right (1)");const c=L(a*i),g=L(o*l);return c!==g?ae("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:a}=this,{X:i,Y:o,Z:l}=qa(t),d=L(n*l),u=L(i*a),h=L(s*l),f=L(o*a);return d===u&&h===f}is0(){return this.equals(sn)}negate(){return new Te(L(-this.X),this.Y,this.Z,L(-this.T))}double(){const{X:t,Y:n,Z:s}=this,a=Ka,i=L(t*t),o=L(n*n),l=L(2n*L(s*s)),d=L(a*i),u=t+n,h=L(L(u*u)-i-o),f=d+o,m=f-l,w=d-o,$=L(h*m),c=L(f*w),g=L(h*w),k=L(m*f);return new Te($,c,k,g)}add(t){const{X:n,Y:s,Z:a,T:i}=this,{X:o,Y:l,Z:d,T:u}=qa(t),h=Ka,f=Wa,m=L(n*o),w=L(s*l),$=L(i*f*u),c=L(a*d),g=L((n+s)*(o+l)-m-w),k=L(c-$),A=L(c+$),T=L(w-h*m),x=L(g*k),_=L(A*T),P=L(g*T),E=L(k*A);return new Te(x,_,E,P)}subtract(t){return this.add(qa(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return sn;if(_t(t,1n,Rs),t===1n)return this;if(this.equals(Ft))return vv(t).p;let s=sn,a=Ft;for(let i=this;t>0n;i=i.double(),t>>=1n)t&1n?s=s.add(i):n&&(a=a.add(i));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(sn))return{x:0n,y:1n};const a=sv(s,ue);L(s*a)!==1n&&ae("invalid inverse");const i=L(t*a),o=L(n*a);return{x:i,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=zd(n);return s[31]|=t&1n?128:0,s}toHex(){return Fd(this.toBytes())}clearCofactor(){return this.multiply(Ks(Ym),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(Rs/2n,!1).double();return Rs%2n&&(t=t.add(this)),t.is0()}}const Ft=new Te(rl,ll,1n,L(rl*ll)),sn=new Te(0n,1n,1n,0n);Te.BASE=Ft;Te.ZERO=sn;const zd=e=>Nd(Od(_t(e,0n,Ai),yo)).reverse(),Kd=e=>Ks("0x"+Fd(Md(gt(e)).reverse())),Ue=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=ue;return n},iv=e=>{const n=e*e%ue*e%ue,s=Ue(n,2n)*n%ue,a=Ue(s,1n)*e%ue,i=Ue(a,5n)*a%ue,o=Ue(i,10n)*i%ue,l=Ue(o,20n)*o%ue,d=Ue(l,40n)*l%ue,u=Ue(d,80n)*d%ue,h=Ue(u,80n)*d%ue,f=Ue(h,10n)*i%ue;return{pow_p_5_8:Ue(f,2n)*e%ue,b2:n}},dl=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,ov=(e,t)=>{const n=L(t*t*t),s=L(n*n*t),a=iv(e*s).pow_p_5_8;let i=L(e*n*a);const o=L(t*i*i),l=i,d=L(i*dl),u=o===e,h=o===L(-e),f=o===L(-e*dl);return u&&(i=l),(h||f)&&(i=d),(L(i)&1n)===1n&&(i=L(-i)),{isValid:u||h,value:i}},xi=e=>Ud(Kd(e)),bo=(...e)=>qd.sha512Async(ts(...e)),rv=(...e)=>av("sha512")(ts(...e)),Wd=e=>{const t=e.slice(0,Ot);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Ot,yo),s=xi(t),a=Ft.multiply(s),i=a.toBytes();return{head:t,prefix:n,scalar:s,point:a,pointBytes:i}},wo=e=>bo(gt(e,Ot)).then(Wd),lv=e=>Wd(rv(gt(e,Ot))),cv=e=>wo(e).then(t=>t.pointBytes),dv=e=>bo(e.hashable).then(e.finish),uv=(e,t,n)=>{const{pointBytes:s,scalar:a}=e,i=xi(t),o=Ft.multiply(i).toBytes();return{hashable:ts(o,s,n),finish:u=>{const h=Ud(i+xi(u)*a);return gt(ts(o,zd(h)),yo)}}},pv=async(e,t)=>{const n=gt(e),s=await wo(t),a=await bo(s.prefix,n);return dv(uv(s,a,n))},qd={sha512Async:async e=>{const t=tv(),n=ts(e);return oa(await t.digest("SHA-512",n.buffer))},sha512:void 0},hv=(e=nv(Ot))=>e,fv={getExtendedPublicKeyAsync:wo,getExtendedPublicKey:lv,randomSecretKey:hv},Ws=8,gv=256,jd=Math.ceil(gv/Ws)+1,Ti=2**(Ws-1),mv=()=>{const e=[];let t=Ft,n=t;for(let s=0;s<jd;s++){n=t,e.push(n);for(let a=1;a<Ti;a++)n=n.add(t),e.push(n);t=n.double()}return e};let ul;const pl=(e,t)=>{const n=t.negate();return e?n:t},vv=e=>{const t=ul||(ul=mv());let n=sn,s=Ft;const a=2**Ws,i=a,o=Ks(a-1),l=Ks(Ws);for(let d=0;d<jd;d++){let u=Number(e&o);e>>=l,u>Ti&&(u-=i,e+=1n);const h=d*Ti,f=h,m=h+Math.abs(u)-1,w=d%2!==0,$=u<0;u===0?s=s.add(pl(w,t[f])):n=n.add(pl($,t[m]))}return e!==0n&&ae("invalid wnaf"),{p:n,f:s}},ja="godmode-device-identity-v1";function _i(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Vd(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),a=new Uint8Array(s.length);for(let i=0;i<s.length;i+=1)a[i]=s.charCodeAt(i);return a}function yv(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Hd(e){const t=await crypto.subtle.digest("SHA-256",e);return yv(new Uint8Array(t))}async function bv(){const e=fv.randomSecretKey(),t=await cv(e);return{deviceId:await Hd(t),publicKey:_i(t),privateKey:_i(e)}}async function $o(){try{const n=localStorage.getItem(ja);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const a=await Hd(Vd(s.publicKey));if(a!==s.deviceId){const i={...s,deviceId:a};return localStorage.setItem(ja,JSON.stringify(i)),{deviceId:a,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await bv(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(ja,JSON.stringify(t)),e}async function wv(e,t){const n=Vd(e),s=new TextEncoder().encode(t),a=await pv(s,n);return _i(a)}async function mt(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function $v(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await mt(e)}catch(n){e.devicesError=String(n)}}async function kv(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await mt(e)}catch(s){e.devicesError=String(s)}}async function Sv(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await $o(),a=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Ld({deviceId:s.deviceId,role:a,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await mt(e)}catch(n){e.devicesError=String(n)}}async function Av(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await $o();t.deviceId===s.deviceId&&Id({deviceId:s.deviceId,role:t.role}),await mt(e)}catch(s){e.devicesError=String(s)}}function Ci(e){return typeof e=="object"&&e!==null}function xv(e){if(!Ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Ci(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const a=typeof e.createdAtMs=="number"?e.createdAtMs:0,i=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!a||!i?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:a,expiresAtMs:i}}function Tv(e){if(!Ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Gd(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function _v(e,t){const n=Gd(e).filter(s=>s.id!==t.id);return n.push(t),n}function hl(e,t){return Gd(e).filter(n=>n.id!==t)}async function ra(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const De=new Map;async function te(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,a=t?.activeMinutes??Os(e.sessionsFilterActive,0),i=t?.limit??Os(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};a>0&&(o.activeMinutes=a),i>0&&(o.limit=i);const l=await e.client.request("sessions.list",o);if(l){if(l.sessions){const d=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&d.set(u.key,u.displayName);l.sessions=l.sessions.map(u=>{if(u.label||u.displayName)return u;let h=De.get(u.key);if(!h){const m=u.key.split(":").pop();if(m&&m.length>=4){for(const[w,$]of De)if(w===u.key||w.endsWith(`:${m}`)||u.key.endsWith(`:${w.split(":").pop()}`)){h=$;break}}}if(h)return{...u,displayName:h};const f=d.get(u.key);return f?{...u,displayName:f}:u})}e.sessionsResult=l}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Es(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:a}=await R(async()=>{const{safeRequest:o}=await Promise.resolve().then(()=>Uv);return{safeRequest:o}},void 0,import.meta.url),i=await a(e.client,"sessions.patch",s);return i.ok?{ok:!0,canonicalKey:i.data?.key??t}:(e.sessionsError=i.error,{ok:!1})}catch(a){return e.sessionsError=String(a),{ok:!1}}}async function Qd(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await te(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Nt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function Yd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Nt(e),await te(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function Jd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Nt(e),await te(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function Xd(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Nt(e),await te(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const Pn=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:Yd,autoTitleCache:De,deleteSession:Qd,loadArchivedSessions:Nt,loadSessions:te,patchSession:Es,triggerAutoArchive:Xd,unarchiveSession:Jd},Symbol.toStringTag,{value:"Module"})),Cv=1800*1e3;function Zd(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function eu(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function tu(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Zd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=eu(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function fl(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Zd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=eu(t),e.updateLastChecked=Date.now()}catch{}}}function Rv(e){e.updatePollInterval==null&&(fl(e),e.updatePollInterval=window.setInterval(()=>{fl(e)},Cv))}function Ev(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function Pv(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const a=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,a),tu(e)}catch{}}const nu={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},gl=nu,Ri={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(nu));new Set(Object.values(Ri));function Lv(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",a=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&a.push(e.nonce??""),a.join("|")}const Iv=4008;class Dv{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let a=null,i=!1,o=this.opts.token;if(t){a=await $o();const h=Qm({deviceId:a.deviceId,role:s})?.token;o=h??this.opts.token,i=!!(h&&this.opts.token)}const l=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let d;if(t&&a){const h=Date.now(),f=this.connectNonce??void 0,m=Lv({deviceId:a.deviceId,clientId:this.opts.clientName??gl.CONTROL_UI,clientMode:this.opts.mode??Ri.WEBCHAT,role:s,scopes:n,signedAtMs:h,token:o??null,nonce:f}),w=await wv(a.privateKey,m);d={id:a.deviceId,publicKey:a.publicKey,signature:w,signedAt:h,nonce:f}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??gl.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Ri.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:d,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(h=>{h?.auth?.deviceToken&&a&&Ld({deviceId:a.deviceId,role:h.auth.role??s,token:h.auth.deviceToken,scopes:h.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(h)}).catch(()=>{i&&a&&Id({deviceId:a.deviceId,role:s}),this.ws?.close(Iv,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const a=n;if(a.event==="connect.challenge"){const o=a.payload,l=o&&typeof o.nonce=="string"?o.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const i=typeof a.seq=="number"?a.seq:null;i!==null&&(this.lastSeq!==null&&i>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:i}),this.lastSeq=i);try{this.opts.onEvent?.(a)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const a=n,i=this.pending.get(a.id);if(!i)return;this.pending.delete(a.id),a.ok?i.resolve(a.payload):i.reject(new Error(a.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=ia(),a={type:"req",id:s,method:t,params:n},i=new Promise((o,l)=>{this.pending.set(s,{resolve:d=>o(d),reject:l})});return this.ws.send(JSON.stringify(a)),i}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const su={displayName:"label",sessionKey:"conversationId"},au={};for(const[e,t]of Object.entries(su))au[t]=e;const Mv={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},Bt=new Map;function Ov(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))Bt.set(n,s)}}catch{}}function ml(){try{const e={};for(const[t,n]of Bt)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}Ov();function Fv(e,t){const n=Bt.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const a={...t};for(const[i,o]of Object.entries(n.fieldRenames))i in a&&!(o in a)&&(a[o]=a[i],delete a[i]);return{method:s,params:a}}return{method:s,params:t}}function Nv(e,t,n){const s=n.toLowerCase(),a=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(a){const i=a[1],o=su[i];if(o&&t&&typeof t=="object"){const l={...t};if(i in l)return l[o]=l[i],delete l[i],console.log(`[safe-request] Self-heal: ${e} — rewrote "${i}" → "${o}"`),{method:e,params:l,renames:{[i]:o}}}}if(s.includes("unknown method")||s.includes("method not found")){const i=Mv[e];if(i&&i.length>0){const o=i[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const i={...t};let o=!1;const l={};for(const[d,u]of Object.entries(au))d in i&&(i[u]=i[d],delete i[d],l[d]=u,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${d}" → "${u}"`));if(o)return{method:e,params:i,renames:l}}return null}async function qs(e,t,n,s){const a=s?.timeout??3e4;let{method:i,params:o}=s?.raw?{method:t,params:n}:Fv(t,n);const l=async(d,u)=>Promise.race([e.request(d,u),new Promise((h,f)=>setTimeout(()=>f(new Error(`Request timeout (${a}ms): ${d}`)),a))]);try{return{ok:!0,data:await l(i,o),method:i,healed:i!==t}}catch(d){const u=String(d instanceof Error?d.message:d);if(s?.raw)return{ok:!1,error:u,method:t};const h=Nv(i,o,u);if(h)try{const f=await l(h.method,h.params);return Bt.set(t,{resolvedMethod:h.method,fieldRenames:h.renames,ts:Date.now()}),ml(),{ok:!0,data:f,method:h.method,healed:!0}}catch(f){return{ok:!1,error:String(f instanceof Error?f.message:f),method:h.method,healed:!0}}if(s?.fallbacks)for(const f of s.fallbacks)try{const m=await l(f,o);return Bt.set(t,{resolvedMethod:f,fieldRenames:{},ts:Date.now()}),ml(),{ok:!0,data:m,method:f,healed:!0}}catch{continue}return{ok:!1,error:u,method:i}}}function iu(){Bt.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function Bv(){const e={};for(const[t,n]of Bt)e[t]=n;return e}const Uv=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:iu,getHealingEntries:Bv,safeRequest:qs},Symbol.toStringTag,{value:"Module"}));let $e=null;function ou(e,t){iu();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;$e={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const a=sessionStorage.getItem("godmode:host-compat");if(a){const i=JSON.parse(a);if(i.hostVersion===n&&i.methods)return $e.methods=i.methods,$e.probing=!1,$e}}catch{}return zv(t).catch(()=>{}),$e}async function zv(e){if(!$e)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(a){const i=String(a instanceof Error?a.message:a),o=i.toLowerCase(),l=o.includes("unknown method")||o.includes("not found")&&o.includes("method");s.available=!l,l&&(s.error="method not available");const d=i.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);d&&(s.fields=d[1].split(",").map(u=>u.trim().replace(/['"]/g,"")))}$e.methods[n.method]=s}$e.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify($e))}catch{}}function ru(e){if(!$e)return;const t=$e.methods[e];if(t)return t.available}function Kv(){return $e?.hostVersion??"unknown"}function Wv(){return $e}function qv(){return $e?.probing??!1}async function lu(e,t,n){const s=await qs(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await qs(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function jv(e,t,n){if(ru("sessions.autoTitle")!==!1){const l=await qs(e,"sessions.autoTitle",{sessionKey:t});if(l.ok)return{ok:!0,title:l.data?.title}}const a=n.find(l=>l.role==="user");if(!a)return{ok:!1,error:"No user message to derive title from"};const i=Vv(a.content),o=await lu(e,t,i);return o.ok?{ok:!0,title:i}:{ok:!1,error:o.error}}function Vv(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),a=s.lastIndexOf(" ");t=(a>30?s.slice(0,a):s)+"..."}return t}function Hv(e){return String(e.label??e.displayName??e.key??"Untitled")}const Gv=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:Wv,getHostVersion:Kv,hasMethod:ru,hostAutoTitle:jv,hostPatchSession:lu,initHostCompat:ou,isProbing:qv,readSessionName:Hv},Symbol.toStringTag,{value:"Module"})),Ei=new Map;let vl=null,Va=!1;function Qv(e,t,n){return Ei.get(`${e}:${t}:${n}`)??null}async function cu(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const a=e.chatMessages[s],i=$i(a);for(let o=0;o<i.length;o++)if(i[o].url&&!i[o].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(i[o].url);l&&n.push({data:l[2],mimeType:l[1],messageIndex:s,imageIndex:o,role:a.role||"unknown",timestamp:typeof a.timestamp=="number"?a.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(a=>({data:a.data,mimeType:a.mimeType})),sessionKey:t});if(s?.cached){const a=n.map((i,o)=>({messageIndex:i.messageIndex,imageIndex:i.imageIndex,hash:s.cached[o]?.hash,mimeType:i.mimeType,bytes:s.cached[o]?.bytes??0,role:i.role,timestamp:i.timestamp})).filter(i=>!!i.hash);a.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:a})}}catch{}if(!Va){Va=!0;try{const s=Td();s&&await s.catch(()=>{});const a=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){vl!==t&&Ei.clear();for(const[l,d]of Object.entries(o.images))Ei.set(`${t}:${l}`,d);return vl=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await a()&&e.chatMessages?.some(o=>$i(o).some(d=>d.omitted||!d.url))){for(const o of[500,1500,3e3])if(await new Promise(l=>setTimeout(l,o)),await a()||e.sessionKey!==t)break}}catch{}finally{Va=!1}}}let yl=null;function Yv(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,a=Array.isArray(s.content)?s.content:[];for(const i of a){const o=i,l=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(l)try{const d=JSON.parse(l);if(d._sidebarAction?.type==="proof"&&d._sidebarAction.slug){const u=d._sidebarAction.slug;if(u===yl)return;yl=u,e.handleOpenProofDoc(u);return}}catch{}}}}function js(e){cu(e)}const On=[];function Jv(){return[...On]}let ut=null;const Xv=10,Zv=1e3,Ee=new Map;function Ha(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const a=t.mainKey?.trim()||"main",i=t.defaultAgentId?.trim();return n==="main"||n===a||i&&(n===`agent:${i}:main`||n===`agent:${i}:${a}`)?s:n}function ey(e,t){if(!t?.mainSessionKey)return;const n="main",s=h=>(h??"").trim()===n||(h??"").trim()==="",a=s(e.sessionKey)?e.sessionKey:Ha(e.sessionKey,t),i=s(e.settings.sessionKey)?e.settings.sessionKey:Ha(e.settings.sessionKey,t),o=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:Ha(e.settings.lastActiveSessionKey,t),l=a||i||e.sessionKey,d={...e.settings,sessionKey:i||l,lastActiveSessionKey:o||l},u=d.sessionKey!==e.settings.sessionKey||d.lastActiveSessionKey!==e.settings.lastActiveSessionKey;l!==e.sessionKey&&(e.sessionKey=l),u&&et(e,d)}function ty(e){ut&&(clearTimeout(ut),ut=null);const t=(e.reconnectAttempt??0)+1;if(t>Xv){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Zv*Math.pow(2,t-1),3e4);ut=setTimeout(()=>{ut=null,e.connected||ko(e)},n)}async function ny(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function sy(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const a=e;if(a.showSetupTab=!0,n.identity?.name){a.setupQuickDone=!0;const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}}else s.onboardingActive=!1,s.onboardingData=n??null}catch{}}function ay(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const du=new Set;function iy(){du.clear()}async function oy(e,t){}function ko(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,iy();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),ut&&(clearTimeout(ut),ut=null),e.client?.stop(),e.client=new Dv({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const i=e;"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const l=new Date,d=`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==d&&(o.todaySelectedDate=d)}e.workingSessions.clear(),e.requestUpdate?.();for(const l of Ee.values())clearTimeout(l);Ee.clear()}ou(n,e.client),py(e,n),xd(e),$d(e),ra(e,{quiet:!0}),mt(e,{quiet:!0}),te(e),rs(e),ny(e).then(()=>sy(e)),cy(e),dy(e),Rv(e),Pv(e),uy(e)},onClose:({code:n,reason:s})=>{e.connected=!1,Ev(e);const a=e;"chatSending"in a&&(a.chatSending=!1),"chatSendingSessionKey"in a&&(a.chatSendingSessionKey=null),"chatRunId"in a&&(a.chatRunId=null),"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const i=e;"sessionsLoading"in i&&(i.sessionsLoading=!1),"agentsLoading"in i&&(i.agentsLoading=!1),"nodesLoading"in i&&(i.nodesLoading=!1),"devicesLoading"in i&&(i.devicesLoading=!1),"channelsLoading"in i&&(i.channelsLoading=!1),"presenceLoading"in i&&(i.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),ty(e)},onEvent:n=>ry(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function ry(e,t){try{ly(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function ly(e,t){if(On.unshift({ts:Date.now(),event:t.event,payload:t.payload}),On.length>250&&(On.length=250),e.tab==="debug"&&(e.eventLog=[...On]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),of(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Mo(e,n.sessionKey),n.state==="delta"){const i=Ee.get(n.sessionKey);i&&(clearTimeout(i),Ee.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const o=`safety:${n.sessionKey}`,l=Ee.get(o);l&&clearTimeout(l),Ee.set(o,setTimeout(()=>{Ee.delete(o),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const i=Ee.get(n.sessionKey);i&&(clearTimeout(i),Ee.delete(n.sessionKey));const o=`safety:${n.sessionKey}`,l=Ee.get(o);l&&(clearTimeout(l),Ee.delete(o)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&ay(e,n.sessionKey);const s=Rd(e,n),a=n?.sessionKey===Q||(n?.sessionKey?.endsWith(`:${Q}`)??!1);if(n&&a){const i=e,o=e.tab==="chat"&&e.sessionKey===Q;if(n.state==="delta"){const l=un(n.message);if(!o){if(typeof l=="string"){const d=i.allyStream??"";(!d||l.length>=d.length)&&(i.allyStream=l)}i.allyWorking=!0,i.requestUpdate?.()}}else if(n.state==="final"){i.allyStream=null,i.allyWorking=!1,!i.allyPanelOpen&&e.tab!=="chat"&&(i.allyUnread=(i.allyUnread??0)+1);const l=e;l._loadAllyHistory().then(()=>{i.allyPanelOpen&&l._scrollAllyToBottom(),i.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const l=un(n.message),d=n.state==="aborted"?"Response was stopped.":l||"Something went wrong — try again.";i.allyMessages=[...i.allyMessages??[],{role:"assistant",content:`*${d}*`,timestamp:Date.now()}],i.allyStream=null,i.allyWorking=!1,i.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await oy(e,n.sessionKey);try{await te(e,{activeMinutes:0})}catch{}})(),s==="final"||s==="error"||s==="aborted"){if(Qi(e),Bu(e),s==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const i=e;i.autoRetryAfterCompact&&i.pendingRetry?(i.autoRetryAfterCompact=!1,setTimeout(()=>{i.handleRetryMessage?.()},500)):(i.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{i.handleSendChat?.("Continue where you left off.")},800))}(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(s==="final"){const i=!!e.compactionStatus?.completedAt;_d(e,{allowShrink:i}).then(()=>{cu(e),e.loadSessionResources?.(),Yv(e);const l=e;if(!l.compactionStatus?.active){const u=[...Array.isArray(l.chatMessages)?l.chatMessages:[]].reverse().find(h=>typeof h=="object"&&h!==null&&h.role==="user");if(u){const h=u.content;let f="";typeof h=="string"?f=h:Array.isArray(h)&&(f=h.filter(m=>typeof m?.text=="string").map(m=>m.text).join(" ")),(f.includes("Pre-compaction memory flush")||f.includes("pre-compaction memory flush"))&&(l.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{l.handleSendChat?.("Continue where you left off.")},800))}}});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===n.sessionKey&&R(async()=>{const{loadDashboard:l}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:l}},[],import.meta.url).then(({loadDashboard:l})=>{l(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&fa(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&mt(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=xv(t.payload);if(n){e.execApprovalQueue=_v(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=hl(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,a=n.status==="completed"?"✓":"✗",i=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${a} Process ${o} ${n.status} (${s})`,i,5e3)}return}if(t.event==="exec.approval.resolved"){const n=Tv(t.payload);n&&(e.execApprovalQueue=hl(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const i={...e.dynamicSlots};delete i[n.tabId],e.dynamicSlots=i}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const a=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:a,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===Q&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:a,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const a=e;(!a.userName||!a.settings.userName)&&(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,a={role:"assistant",content:n.summary||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],a],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const i=["queue-complete","queue-needs-review","queue-failed","cron-result"];n.type&&i.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&i.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),De.set(n.sessionKey,n.title),du.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function cy(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function dy(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function uy(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const a=await e.client.request("tasks.openSession",{taskId:n});if(a?.sessionKey){e.sessionKey=a.sessionKey,e.tab="chat";const{loadChatHistory:i}=await R(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>Je);return{loadChatHistory:o}},void 0,import.meta.url);await i(e,a.sessionKey)}}catch(a){console.error("[GodMode] Failed to open task session:",a)}}function py(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&ey(e,n.sessionDefaults)}async function la(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,a]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const i=s;e.debugModels=Array.isArray(i?.models)?i?.models:[],e.debugHeartbeat=a}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function hy(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const fy=2e3,gy=new Set(["trace","debug","info","warn","error","fatal"]);function my(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function vy(e){if(typeof e!="string")return null;const t=e.toLowerCase();return gy.has(t)?t:null}function yy(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,a=vy(n?.logLevelName??n?.level),i=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=my(i);let l=null;o&&(typeof o.subsystem=="string"?l=o.subsystem:typeof o.module=="string"&&(l=o.module)),!l&&i&&i.length<120&&(l=i);let d=null;return typeof t[1]=="string"?d=t[1]:!o&&typeof t[0]=="string"?d=t[0]:typeof t.message=="string"&&(d=t.message),{raw:e,time:s,level:a,subsystem:l,message:d??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function So(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),i=(Array.isArray(s.lines)?s.lines.filter(l=>typeof l=="string"):[]).map(yy),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?i:[...e.logsEntries,...i].slice(-fy),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const uu={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Team"};function Ga(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):uu[t??e]??e}function Ao(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const a=Math.floor(s/60),i=s%60;if(a<60)return`${a}m ${i}s`;const o=Math.floor(a/60),l=a%60;return`${o}h ${l}m`}function by(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function wy(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function $y(e,t){const n=[],s=new Set;for(const a of t){a.childSessionKey&&s.add(a.childSessionKey);const i=a.swarm?.enabled===!0,o=a.status==="review";n.push({id:a.id,type:i?"swarm":"coding",task:a.description,status:wy(a.status),model:a.model??null,startedAt:a.startedAt??a.createdAt,endedAt:a.completedAt??null,branch:a.branch,prUrl:a.prUrl,swarmStage:i?a.swarm.currentStage:void 0,swarmStages:i?a.swarm.stages:void 0,error:a.error,canCancel:a.status==="running"||a.status==="validating"||a.status==="queued",roleName:i?"Swarm":"Builder",childSessionKey:a.childSessionKey,isReview:o})}for(const a of e)s.has(a.childSessionKey)||n.push({id:a.runId,type:"subagent",task:a.task,status:a.endedAt?a.outcome?.status==="error"?"failed":"done":"active",model:a.model,startedAt:a.startedAt??a.createdAt,endedAt:a.endedAt,label:a.label,error:a.outcome?.error??void 0,roleName:a.label??"Sub-Agent",childSessionKey:a.childSessionKey});return n.sort((a,i)=>{const o={active:0,queued:1,failed:2,done:3},l=o[a.status]-o[i.status];return l!==0?l:(i.startedAt??0)-(a.startedAt??0)}),n}function ky(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function Sy(e,t=0,n=0){const s=by();let a=0,i=0,o=0,l=0;for(const u of e)u.status==="active"&&a++,u.status==="done"&&u.endedAt&&u.endedAt>=s&&i++,u.status==="failed"&&u.endedAt&&u.endedAt>=s&&o++,u.type==="swarm"&&(u.status==="active"||u.status==="queued")&&l++;const d=e.filter(u=>u.isReview&&(u.type==="coding"||u.type==="swarm")).length;return{activeNow:a,completedToday:i,failed:o,swarmPipelines:l,queueDepth:t,queueReview:n+d}}async function vt(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}let a=[],i=[];try{a=(await e.client.request("subagents.list",{limit:200})).runs??[]}catch{}try{i=(await e.client.request("coding.list",{})).tasks??[]}catch{}const o=$y(a,i),l=s?.items??[],d=[];let u=0;for(const $ of l)$.status==="processing"?o.push({id:$.id,type:"queue",task:$.title,status:"active",model:null,startedAt:$.startedAt??$.createdAt,endedAt:null,error:$.error,roleName:Ga($.type,void 0,$.personaHint),queueItemType:$.type,outputPath:$.result?.outputPath,sourceTaskId:$.sourceTaskId,retryCount:$.retryCount,prUrl:$.result?.prUrl}):$.status==="review"?(u++,o.push({id:$.id,type:"queue",task:$.title,status:"done",model:null,startedAt:$.startedAt??$.createdAt,endedAt:$.completedAt??null,roleName:Ga($.type,void 0,$.personaHint),queueItemType:$.type,outputPath:$.result?.outputPath,sourceTaskId:$.sourceTaskId,retryCount:$.retryCount,prUrl:$.result?.prUrl,isReview:!0})):$.status==="failed"?o.push({id:$.id,type:"queue",task:$.title,status:"failed",model:null,startedAt:$.startedAt??$.createdAt,endedAt:$.completedAt??null,error:$.error,roleName:Ga($.type,void 0,$.personaHint),queueItemType:$.type,outputPath:$.result?.outputPath,sourceTaskId:$.sourceTaskId,retryCount:$.retryCount}):$.status==="pending"&&d.push($);o.sort(($,c)=>{const g={active:0,queued:1,failed:2,done:3},k=g[$.status]-g[c.status];return k!==0?k:(c.startedAt??0)-($.startedAt??0)});const h=d.length,f=Sy(o,h,u),m=ky(o);let w={projects:[],selectedProjectId:null,detail:null,feed:[],running:!1};try{const $=await e.client.request("godmode.delegation.projects",{});if($?.running&&$.projects.length>0){const c=$.projects,g=n.missionControlData?.swarm?.selectedProjectId,k=g&&c.some(x=>x.projectId===g)?g:c.find(x=>x.status==="in_progress")?.projectId??c[0].projectId;let A=null,T=[];if(k){try{A=await e.client.request("godmode.delegation.status",{projectId:k})}catch{}try{T=(await e.client.request("godmode.delegation.feed",{projectId:k}))?.events??[]}catch{}}w={projects:c,selectedProjectId:k,detail:A,feed:T,running:!0}}}catch{}n.missionControlData={agents:o,stats:f,activityFeed:m,lastRefreshedAt:Date.now(),queueItems:d,swarm:w}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function Ay(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await vt(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function xy(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,a=n?.item?.title??"task";if(s){const i=s.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase());e.showToast(`Approved! How did ${i} do on "${a}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await vt(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function Ty(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await vt(e),!0):!1}catch{return!1}}async function _y(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.retry",{id:t}),e.showToast("Retrying...","success",2e3),await vt(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function Cy(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}async function Ry(e,t){const n=e;n.missionControlData?.swarm&&(n.missionControlData={...n.missionControlData,swarm:{...n.missionControlData.swarm,selectedProjectId:t}}),await vt(e,{quiet:!0})}async function Ey(e,t,n,s){if(!e.client||!e.connected)return!1;try{const a=await e.client.request("godmode.delegation.steer",{projectId:t,issueTitle:n,instructions:s});return a?.success?(e.showToast("Steering sent","success",2e3),await vt(e,{quiet:!0}),!0):(e.showToast(a?.error??"Failed to steer","error"),!1)}catch(a){return e.showToast("Failed to send steering","error"),console.error("[MissionControl] steer error:",a),!1}}const ot=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:uu,approveCodingTask:Ty,approveQueueItem:xy,cancelCodingTask:Ay,formatDuration:Ao,loadAgentDetail:Cy,loadMissionControl:vt,retryQueueItem:_y,selectSwarmProject:Ry,steerSwarmAgent:Ey},Symbol.toStringTag,{value:"Module"}));function xo(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ra(e,{quiet:!0})},5e3))}function To(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function _o(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&So(e,{quiet:!0})},2e3))}function Co(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function Ro(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&la(e)},3e3))}function Eo(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function pu(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&vt(e,{quiet:!0})},5e3))}function hu(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function is(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function ca(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function Py(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Os(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function Ly(e){if(e.payloadKind==="systemEvent"){const a=e.payloadText.trim();if(!a)throw new Error("System event text required.");return{kind:"systemEvent",text:a}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Os(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function Iy(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Py(e.cronForm),n=Ly(e.cronForm),s=e.cronForm.agentId.trim(),a={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!a.name)throw new Error("Name required.");await e.client.request("cron.add",a),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ca(e),await is(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function Dy(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await ca(e),await is(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function My(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await fu(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Oy(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ca(e),await is(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function fu(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Kt(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function Fy(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const a=e.guardrailsData?.gates.find(i=>i.id===t)?.name??t;e.showToast(`${a} ${n?"enabled":"disabled"}`,"success",2e3),await Kt(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function Ny(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Kt(e)}catch(a){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",a)}}async function By(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Kt(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function Uy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Kt(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function zy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Kt(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const Zt=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:zy,deleteCustomGuardrail:Uy,loadGuardrails:Kt,toggleCustomGuardrail:By,toggleGuardrail:Fy,updateGuardrailThreshold:Ny},Symbol.toStringTag,{value:"Module"}));function Ky(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Wy(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function Po(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Ky(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);qy(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function qy(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=It(t.file??{}))}async function jy(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},a=Wy(t,{file:s,baseHash:n});if(!a){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(a.method,a.params),e.execApprovalsDirty=!1,await Po(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Vy(e,t,n){const s=It(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Dc(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Hy(e,t){const n=It(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Mc(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}const Gy=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Qy(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Gy]}function Yy(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function gu(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function mu(e,t,n){const s=t||ce(),a="agentLog.get";try{const i=await e.request(a,{date:s});if(i?.content?.trim()&&i?.sourcePath)return{date:i.date||s,content:i.content,updatedAt:i.updatedAt||new Date().toISOString(),sourcePath:i.sourcePath}}catch(i){console.warn(`[MyDay] ${a} unavailable, falling back to files.read:`,i)}return Jy(e,s)}async function Jy(e,t){const n=Qy(t),s=a=>a.includes("AGENT-DAY.md");for(const a of n)try{const i=await e.request("files.read",{path:a,maxSize:1e6});if(!i?.content?.trim()||!Yy(i.content)||s(a)&&typeof i.modifiedAt=="number"&&ce(new Date(i.modifiedAt))!==t)continue;return{date:t,content:i.content,updatedAt:typeof i.modifiedAt=="number"?new Date(i.modifiedAt).toISOString():new Date().toISOString(),sourcePath:a}}catch{}return null}function Ln(e,t,n){return new Promise((s,a)=>{const i=setTimeout(()=>a(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(i),s(o)},o=>{clearTimeout(i),a(o)})})}const Xy={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function vu(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??ce(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),a=new Map;for(const o of s.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&a.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Xy[o.type]??o.type,queueItemId:o.id});const i=(n.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:a.get(o.id)??null}));return e.todayTasks=i,i}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function yu(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function Zy(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(a=>!(a.status!=="review"&&a.status!=="needs-review"&&a.status!=="done"||a.status==="done"&&(a.completedAt??0)<s)).sort((a,i)=>(i.completedAt??0)-(a.completedAt??0)).map(a=>({id:a.id,title:a.title,summary:a.result?.summary??a.description??"",status:a.status==="needs-review"?"review":a.status,completedAt:a.completedAt,outputPath:a.result?.outputPath,prUrl:a.result?.prUrl,sourceTaskId:a.sourceTaskId,persona:a.personaHint??void 0,source:a.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function eb(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function Fn(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await gu(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function tb(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await mu(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function bu(e){const t=e||ce(),n="VAULT",s=`01-Daily/${t}`,a=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(a,"_blank")}async function Vs(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?Ln(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([Ln(gu(e.client,t),1e4,"Daily Brief"),n,Ln(mu(e.client,t),1e4,"Agent Log"),Ln(vu(e),8e3,"Today Tasks"),Ln(yu(e),5e3,"Inbox")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const a=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox"],i=s.map((o,l)=>o.status==="rejected"?{section:a[l],reason:o.reason}:null).filter(Boolean);if(i.length>0){for(const o of i)console.warn(`[MyDay] ${o.section} failed:`,o.reason);i.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const Nn=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:tb,loadBriefOnly:Fn,loadInboxItems:yu,loadMyDay:Vs,loadTodayQueueResults:Zy,loadTodayTasksWithQueueStatus:vu,openBriefInObsidian:bu,syncTodayTasks:eb},Symbol.toStringTag,{value:"Module"}));async function Lo(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function pn(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function da(e){return e instanceof Error?e.message:String(e)}async function os(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=da(n)}finally{e.skillsLoading=!1}}}async function Pi(e){if(!(!e.client||!e.connected)){e.godmodeSkillsLoading=!0;try{const t=await e.client.request("godmode.skills.list",{});e.godmodeSkills=t??null}catch(t){console.error("[Skills] Failed to load GodMode skills:",t),e.godmodeSkills=null}finally{e.godmodeSkillsLoading=!1}}}function nb(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function sb(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await os(e),pn(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const a=da(s);e.skillsError=a,pn(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function ab(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await os(e),pn(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=da(n);e.skillsError=s,pn(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function ib(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const a=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await os(e),pn(e,t,{kind:"success",message:a?.message??"Installed"})}catch(a){const i=da(a);e.skillsError=i,pn(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function wu(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function ob(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const a=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:a}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function $u(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function rb(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function lb(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function ua(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Io(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ua(e.lastUpdated,e.lastScanned)}}function Qa(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ua(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function bl(e){return{id:e.id,key:e.key,title:e.title,created:ua(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function Wt(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function ku(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ua(t.modified):void 0,children:t.children?ku(t.children):void 0}))}function cb(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function pa(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Io),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=cb(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function ha(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Io(n.workspace),pinned:(n.pinned??[]).map(Qa),pinnedSessions:(n.pinnedSessions??[]).map(bl),outputs:(n.outputs??[]).map(Qa),folderTree:n.folderTree?ku(n.folderTree):void 0,sessions:(n.sessions??[]).map(bl),tasks:(n.tasks??[]).map(Wt),memory:(n.memory??[]).map(Qa)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function db(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function ub(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await pa(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function pb(e,t){if(!t){e.selectedWorkspace=null;return}const n=await ha(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function hb(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const a=await ha(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] pin toggle failed:",a),!1}}async function fb(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const a=await ha(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] session pin toggle failed:",a),!1}}async function gb(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",a=String(t.path??"").trim();try{const i=await e.client.request("workspaces.create",{name:n,type:s,...a?{path:a}:{}});if(!i.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=Io(i.workspace),l=e.workspaces??[],d=new Map(l.map(u=>[u.id,u]));return d.set(o.id,o),e.workspaces=Array.from(d.values()).toSorted((u,h)=>h.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,o}catch(i){return console.error("[Workspaces] create failed:",i),e.workspacesError=i instanceof Error?i.message:"Failed to create workspace",null}}async function mb(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function vb(e,t){e.workspacesSearchQuery=t}function yb(e){e.selectedWorkspace=null}async function bb(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function wb(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function $b(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(Wt)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function kb(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(Wt)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const Sb={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function Ab(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const a of n.items)a.sourceTaskId&&(a.status==="processing"||a.status==="review"||a.status==="needs-review"||a.status==="failed")&&s.set(a.sourceTaskId,{status:a.status==="needs-review"?"review":a.status,type:a.type,roleName:Sb[a.type]??a.type,queueItemId:a.id});return(t.tasks??[]).map(a=>({...Wt(a),queueStatus:s.get(a.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function xb(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const a=await e.client.request("tasks.update",{id:t,status:s});return Wt(a)}catch(a){return console.error("[Workspaces] toggleTaskComplete failed:",a),null}}async function Tb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return Wt(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function _b(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function Cb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return Wt(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function Rb(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function Eb(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(a){return console.error("[Workspaces] search failed:",a),[]}}async function Pb(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function Lb(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(a){return console.error("[Workspaces] moveFile failed:",a),!1}}async function Ib(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(a){return console.error("[Workspaces] renameFile failed:",a),!1}}const he=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:Rb,clearWorkspaceSelection:yb,createTask:Cb,createWorkspace:gb,createWorkspaceFolder:Pb,deleteWorkspace:mb,getWorkspace:ha,loadAllTasks:kb,loadAllTasksWithQueueStatus:Ab,loadWorkspaceTasks:$b,loadWorkspaces:pa,moveWorkspaceFile:Lb,readWorkspaceFile:db,renameWorkspaceFile:Ib,scanWorkspaces:ub,searchWorkspaceFiles:Eb,selectWorkspace:pb,setWorkspacesSearchQuery:vb,startTask:_b,startTeamSetup:bb,toggleTaskComplete:xb,toggleWorkspaceFolder:wb,toggleWorkspacePin:hb,toggleWorkspaceSessionPin:fb,updateTask:Tb},Symbol.toStringTag,{value:"Module"})),Su="godmode.ui.settings.v1";function Db(){const e=new URLSearchParams(location.search),t=(()=>{const a=e.get("gatewayUrl");return a||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const a=localStorage.getItem(Su);if(!a)return s;const i=JSON.parse(a);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof i.gatewayUrl=="string"&&i.gatewayUrl.trim()?i.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof i.token=="string"?i.token:""),sessionKey:typeof i.sessionKey=="string"&&i.sessionKey.trim()?i.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof i.lastActiveSessionKey=="string"&&i.lastActiveSessionKey.trim()?i.lastActiveSessionKey.trim():typeof i.sessionKey=="string"&&i.sessionKey.trim()||s.lastActiveSessionKey,theme:i.theme==="light"||i.theme==="dark"||i.theme==="system"||i.theme==="lifetrack"?i.theme:s.theme,chatFocusMode:typeof i.chatFocusMode=="boolean"?i.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof i.chatShowThinking=="boolean"?i.chatShowThinking:s.chatShowThinking,splitRatio:typeof i.splitRatio=="number"&&i.splitRatio>=.4&&i.splitRatio<=.7?i.splitRatio:s.splitRatio,navCollapsed:typeof i.navCollapsed=="boolean"?i.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof i.navGroupsCollapsed=="object"&&i.navGroupsCollapsed!==null?i.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(i.openTabs)&&i.openTabs.every(o=>typeof o=="string")?i.openTabs:s.openTabs,tabLastViewed:typeof i.tabLastViewed=="object"&&i.tabLastViewed!==null?i.tabLastViewed:s.tabLastViewed,userName:typeof i.userName=="string"?i.userName.trim().slice(0,50):s.userName,userAvatar:typeof i.userAvatar=="string"?i.userAvatar.trim():s.userAvatar,chatParallelView:typeof i.chatParallelView=="boolean"?i.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(i.parallelLanes)&&i.parallelLanes.length===4?i.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function Mb(e){localStorage.setItem(Su,JSON.stringify(e))}const Ob=56,Fb="quantum-particles",Nb="quantum-particle";let pt=null,Kn=null;function xe(e,t){return Math.random()*(t-e)+e}function Au(){if(xu(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Kn=requestAnimationFrame(()=>{Kn=null,Au()});return}pt=document.createElement("div"),pt.className=Fb,Object.assign(pt.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<Ob;t++){const n=document.createElement("div");n.className=Nb;const s=xe(2,5),a=xe(.3,.65),i=xe(15,35),o=xe(0,12),l=xe(5,95),d=xe(5,95),u=xe(-150,150),h=xe(-200,200),f=xe(-250,250),m=xe(-350,350),w=xe(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${l}%`,top:`${d}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${xe(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${a*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${i}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(a)),n.style.setProperty("--drift-x",`${u}px`),n.style.setProperty("--drift-y",`${h}px`),n.style.setProperty("--drift-end-x",`${f}px`),n.style.setProperty("--drift-end-y",`${m}px`),n.style.setProperty("--particle-scale-mid",String(w)),pt.appendChild(n)}e.prepend(pt)}function xu(){Kn!==null&&(cancelAnimationFrame(Kn),Kn=null),pt&&(pt.remove(),pt=null)}function Bb(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function Do(e){return e==="system"?Bb():e==="light"?"lifetrack":e}const Ss=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Ub=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,In=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},zb=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const a=globalThis.document??null;if(!a){t();return}const i=a.documentElement,o=a,l=Ub();if(!!o.startViewTransition&&!l){let u=.5,h=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=Ss(n.pointerClientX/window.innerWidth),h=Ss(n.pointerClientY/window.innerHeight);else if(n?.element){const m=n.element.getBoundingClientRect();m.width>0&&m.height>0&&typeof window<"u"&&(u=Ss((m.left+m.width/2)/window.innerWidth),h=Ss((m.top+m.height/2)/window.innerHeight))}i.style.setProperty("--theme-switch-x",`${u*100}%`),i.style.setProperty("--theme-switch-y",`${h*100}%`),i.classList.add("theme-transition");const f=setTimeout(()=>{In(i)},1e3);try{const m=o.startViewTransition?.(()=>{t()});m?.finished?m.finished.finally(()=>{clearTimeout(f),In(i)}):(clearTimeout(f),In(i))}catch{clearTimeout(f),In(i),t()}return}t(),In(i)};function Kb(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function Wb(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const a=n.trim();!a||typeof s!="number"||!Number.isFinite(s)||(t[a]=Math.max(t[a]??0,s))}return t}function et(e,t){const n=t.sessionKey.trim()||"main",s=Kb(t.openTabs,n),a=Wb(t.tabLastViewed),i={...t,sessionKey:n,openTabs:s,tabLastViewed:a,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=i,Mb(i),i.theme!==e.theme&&(e.theme=i.theme,ls(e,Do(i.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Mo(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&et(e,{...e.settings,lastActiveSessionKey:n})}function Tu(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),a=t.get("session"),i=t.get("gatewayUrl");let o=!1;if(n!=null){const d=n.trim();d&&d!==e.settings.token&&et(e,{...e.settings,token:d}),t.delete("token"),o=!0}if(s!=null){const d=s.trim();d&&(e.password=d),t.delete("password"),o=!0}if(a!=null){const d=a.trim();if(d){e.sessionKey=d;const u=d.toLowerCase(),f=u==="main"||u==="agent:main:main"||u.endsWith(":main")||e.settings.openTabs.includes(d)?e.settings.openTabs:[...e.settings.openTabs,d];et(e,{...e.settings,sessionKey:d,lastActiveSessionKey:d,openTabs:f})}}if(i!=null){const d=i.trim();d&&d!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=d),t.delete("gatewayUrl"),o=!0}if(!o)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function Oo(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===Q&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const a=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=a}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?xo(e):To(e),t==="logs"?_o(e):Co(e),t==="debug"?Ro(e):Eo(e),t==="mission-control"?pu(e):hu(e),rs(e),No(e,t,!1)}function _u(e,t,n){zb({nextTheme:t,applyTheme:()=>{e.theme=t,et(e,{...e.settings,theme:t}),ls(e,Do(t))},context:n,currentTheme:e.theme})}async function rs(e){if(e.tab==="overview"&&await Bo(e),(e.tab==="today"||e.tab==="my-day")&&(await Vs(e),R(()=>Promise.resolve().then(()=>Nn),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([wu(e),$u(e)]),e.tab==="workspaces"&&(await pa(e),R(()=>Promise.resolve().then(()=>he),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await Du(e),e.tab==="instances"&&await Lo(e),e.tab==="sessions"&&(await te(e),await Nt(e)),e.tab==="cron"&&await fa(e),e.tab==="skills"&&(await os(e),await Pi(e)),e.tab==="agents"){const{loadRoster:t}=await R(async()=>{const{loadRoster:n}=await Promise.resolve().then(()=>Bm);return{loadRoster:n}},void 0,import.meta.url);await t(e)}if(e.tab==="nodes"&&(await ra(e),await mt(e),await Ze(e),await Po(e)),e.tab==="chat"&&(await Ko(e),we(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Kt(t)),n.push(te(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e,n=t.secondBrainSubtab;n==="intel"?typeof t.handleIntelLoad=="function"&&await t.handleIntelLoad():n==="files"?typeof t.handleSecondBrainFileTreeRefresh=="function"&&await t.handleSecondBrainFileTreeRefresh():typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await Oc(e),await Ze(e)),e.tab==="debug"&&(await la(e),e.eventLog=Jv()),e.tab==="logs"&&(e.logsAtBottom=!0,await So(e,{reset:!0}),Uc(e,!0))}function Cu(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?ta(e):Kh(window.location.pathname)}function Ru(e){e.theme=e.settings.theme??"system",ls(e,Do(e.theme))}function ls(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?Au():xu()}function Eu(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&ls(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Pu(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Lu(e,t){if(typeof window>"u")return;const n=Kc(window.location.pathname,e.basePath)??"chat";Fo(e,n),No(e,n,t)}function Iu(e){if(typeof window>"u")return;const t=Kc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const a=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];et(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:a})}Fo(e,t)}function Fo(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?xo(e):To(e),t==="logs"?_o(e):Co(e),t==="debug"?Ro(e):Eo(e),t==="mission-control"?pu(e):hu(e),e.connected&&rs(e)}function No(e,t,n){if(typeof window>"u")return;const s=Qn(Hi(t,e.basePath)),a=Qn(window.location.pathname),i=new URL(window.location.href);t==="chat"&&e.sessionKey?i.searchParams.set("session",e.sessionKey):i.searchParams.delete("session"),a!==s&&(i.pathname=s),n?window.history.replaceState({},"",i.toString()):window.history.pushState({},"",i.toString())}function ye(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function Bo(e){await Promise.all([Oe(e,!1),Lo(e),te(e),is(e),la(e)])}async function Du(e){await Promise.all([Oe(e,!0),Oc(e),Ze(e)])}async function fa(e){await Promise.all([Oe(e,!1),is(e),ca(e)])}const qb=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:ls,applySettings:et,applySettingsFromUrl:Tu,attachThemeListener:Eu,detachThemeListener:Pu,inferBasePath:Cu,loadChannelsTab:Du,loadCron:fa,loadOverview:Bo,onPopState:Iu,refreshActiveTab:rs,setLastActiveSessionKey:Mo,setTab:Oo,setTabFromRoute:Fo,setTheme:_u,syncTabWithLocation:Lu,syncThemeWithSettings:Ru,syncUrlWithSessionKey:ye,syncUrlWithTab:No},Symbol.toStringTag,{value:"Module"}));function Hs(e){return e.chatSending||!!e.chatRunId}function Se(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:a,...i}=e.chatDrafts;e.chatDrafts=i}}function Pe(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Mu(e,t){const n=t??e.sessionKey,{[n]:s,...a}=e.chatDrafts;e.chatDrafts=a,n===e.sessionKey&&(e.chatMessage="")}function Ou(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function jb(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function Uo(e){e.connected&&(e.chatMessage="",await go(e))}function Vb(e,t,n){const s=t.trim(),a=!!(n&&n.length>0);if(!s&&!a)return;const i=Date.now();e.chatQueue=[...e.chatQueue,{id:ia(),text:s,createdAt:i,attachments:a?n?.map(l=>({...l})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),a&&n)for(const l of n)o.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:i}],we(e,!0)}async function Li(e,t,n){Qi(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{we(e,!0)});const a=await fo(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!a&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!a&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),a&&(Mo(e,e.sessionKey),e.chatAttachments=[]),a&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),a&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),we(e,!0),a&&!e.chatRunId&&zo(e),a&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),a}async function zo(e){if(!e.connected||Hs(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Li(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Fu(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function Nu(e,t,n){if(!e.connected)return;const s=e.chatMessage,a=(t??e.chatMessage).trim(),i=e.chatAttachments??[],o=t==null?i:[],l=o.length>0;if(!a&&!l)return;if(Ou(a)){await Uo(e);return}const d=jb(a);if(t==null&&(e.chatMessage="",Mu(e)),n?.queue){Vb(e,a,o),Hs(e)||await zo(e);return}if(Hs(e)){await go(e),await new Promise(u=>setTimeout(u,50)),await Li(e,a,{attachments:l?o:void 0,refreshSessions:d});return}await Li(e,a,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?o:void 0,previousAttachments:t==null?i:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:d})}async function Ko(e){await Promise.all([se(e),te(e,{activeMinutes:0}),Gs(e)]),we(e,!0)}const Bu=zo;function Hb(e){const t=Bc(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Gb(e,t){const n=ta(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Gs(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Hb(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Gb(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const a=await s.json(),i=typeof a.avatarUrl=="string"?a.avatarUrl.trim():"";e.chatAvatarUrl=i||null}catch{e.chatAvatarUrl=null}}const Ya=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Mu,flushChatQueueForEvent:Bu,handleAbortChat:Uo,handleSendChat:Nu,isChatBusy:Hs,isChatStopCommand:Ou,refreshChat:Ko,refreshChatAvatar:Gs,removeQueuedMessage:Fu,restoreDraft:Pe,saveDraft:Se},Symbol.toStringTag,{value:"Module"})),Qb={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Yb={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:Jb}=oh,wl=e=>e,Xb=e=>e.strings===void 0,$l=()=>document.createComment(""),Dn=(e,t,n)=>{const s=e._$AA.parentNode,a=t===void 0?e._$AB:t._$AA;if(n===void 0){const i=s.insertBefore($l(),a),o=s.insertBefore($l(),a);n=new Jb(i,o,e,e.options)}else{const i=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let d;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(d=e._$AU)!==o._$AU&&n._$AP(d)}if(i!==a||l){let d=n._$AA;for(;d!==i;){const u=wl(d).nextSibling;wl(s).insertBefore(d,a),d=u}}}return n},kt=(e,t,n=e)=>(e._$AI(t,n),e),Zb={},ew=(e,t=Zb)=>e._$AH=t,tw=e=>e._$AH,Ja=e=>{e._$AR(),e._$AA.remove()};const kl=(e,t,n)=>{const s=new Map;for(let a=t;a<=n;a++)s.set(e[a],a);return s},ga=Ji(class extends Xi{constructor(e){if(super(e),e.type!==Yi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const a=[],i=[];let o=0;for(const l of e)a[o]=s?s(l,o):o,i[o]=n(l,o),o++;return{values:i,keys:a}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const a=tw(e),{values:i,keys:o}=this.dt(t,n,s);if(!Array.isArray(a))return this.ut=o,i;const l=this.ut??=[],d=[];let u,h,f=0,m=a.length-1,w=0,$=i.length-1;for(;f<=m&&w<=$;)if(a[f]===null)f++;else if(a[m]===null)m--;else if(l[f]===o[w])d[w]=kt(a[f],i[w]),f++,w++;else if(l[m]===o[$])d[$]=kt(a[m],i[$]),m--,$--;else if(l[f]===o[$])d[$]=kt(a[f],i[$]),Dn(e,d[$+1],a[f]),f++,$--;else if(l[m]===o[w])d[w]=kt(a[m],i[w]),Dn(e,a[f],a[m]),m--,w++;else if(u===void 0&&(u=kl(o,w,$),h=kl(l,f,m)),u.has(l[f]))if(u.has(l[m])){const c=h.get(o[w]),g=c!==void 0?a[c]:null;if(g===null){const k=Dn(e,a[f]);kt(k,i[w]),d[w]=k}else d[w]=kt(g,i[w]),Dn(e,a[f],g),a[c]=null;w++}else Ja(a[m]),m--;else Ja(a[f]),f++;for(;w<=$;){const c=Dn(e,d[$+1]);kt(c,i[w]),d[w++]=c}for(;f<=m;){const c=a[f++];c!==null&&Ja(c)}return this.ut=o,ew(e,d),ft}});function Wo(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function nw(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function ma(e){Se(e);const n=`agent:main:webchat-${ia().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,n,!0),se(e),Wo(),nw()}function Ii(e,t){const n=Hi(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Yn(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${Wh(t)}</span>
      <span class="nav-item__text">${Yn(t)}</span>
    </a>
  `}function Uu(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,a=e.onboarding?!0:e.settings.chatFocusMode,i=r`
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
        @click=${()=>ma(e)}
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
        ${e.sessionPickerOpen?iw(e):p}
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
        ${e.sessionSearchOpen?aw(e):p}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Ko(e)}}
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
  `}function sw(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=n),yesterday:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=s&&new Date(a.updatedAt)<n),older:e.filter(a=>!a.updatedAt||new Date(a.updatedAt)<s)}}let Xa=null;function aw(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=a=>{const i=a.target.value;e.sessionSearchQuery=i,Xa&&clearTimeout(Xa),Xa=setTimeout(()=>{e.handleSessionSearchQuery(i)},300)},n=a=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Se(e),e.settings.openTabs.includes(a)?(e.sessionKey=a,e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,a],sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.sessionKey=a),Pe(e,a),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,a,!0),se(e).then(()=>{ea(e),we(e,!0)})},s=a=>{const i=a.label??a.displayName??a.key,o=a.matches.length>0;return r`
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
  `}function iw(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(m=>!e.settings.openTabs.includes(m.key));t&&(n=n.filter(m=>[m.label,m.displayName,m.key].filter(Boolean).some($=>$.toLowerCase().includes(t))));const s=50,a=n.length,i=n.slice(0,s),o=sw(i),l=m=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Se(e),e.settings.openTabs.includes(m)?(e.sessionKey=m,e.applySettings({...e.settings,sessionKey:m,lastActiveSessionKey:m,tabLastViewed:{...e.settings.tabLastViewed,[m]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,m],sessionKey:m,lastActiveSessionKey:m,tabLastViewed:{...e.settings.tabLastViewed,[m]:Date.now()}}),e.sessionKey=m),Pe(e,m),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,m,!0),se(e).then(()=>{ea(e),we(e,!0)})},d=async(m,w)=>{if(m.stopPropagation(),!!window.confirm(`Delete session "${w}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(c=>c.key!==w)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:w,deleteTranscript:!0}),te(e)}catch(c){console.error("Failed to delete session:",c),te(e)}},u=m=>r`
    <div class="session-picker-item" @click=${()=>l(m.key)}>
      <span class="session-picker-item__status ${m.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${m.label??m.displayName??m.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${m.updatedAt?r`<span class="session-picker-item__time">${Qh(m.updatedAt)}</span>`:p}
        <button
          class="session-picker-item__close"
          @click=${w=>d(w,m.key)}
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
  `,h=(m,w)=>w.length===0?p:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${m}</div>
        ${ga(w,$=>$.key,u)}
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
          @input=${m=>{e.sessionPickerSearch=m.target.value}}
          @click=${m=>m.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${f===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${h("Today",o.today)}
              ${h("Yesterday",o.yesterday)}
              ${h("Older",o.older)}
              ${a>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${a} sessions. Use search to find more.
                  </div>`:p}
            `}
      </div>
    </div>
  `}const ow=["system","light","dark","lifetrack"];function zu(e){const t=Math.max(0,ow.indexOf(e.theme)),n=s=>a=>{const o={element:a.currentTarget};(a.clientX||a.clientY)&&(o.pointerClientX=a.clientX,o.pointerClientY=a.clientY),e.setTheme(s,o)};return r`
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
          ${cw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${rw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${lw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${dw()}
        </button>
      </div>
    </div>
  `}function rw(){return r`
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
  `}function lw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function cw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function dw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const rt=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:ma,renderChatControls:Uu,renderTab:Ii,renderThemeToggle:zu,scrollActiveTabIntoView:Wo},Symbol.toStringTag,{value:"Module"})),Za=new Set;function Sl(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const a=Me(e.sessionsResult?.sessions,n)?.key??n;if(qe.has(n)||qe.has(a)||Za.has(a))continue;Za.add(a);const o=e.client;ho(o,a).then(l=>{a!==n&&l.length>0&&qe.set(n,l)}).finally(()=>{Za.delete(a),e.applySettings({...e.settings})})}}function uw(e){e.basePath=Cu(),e._urlSettingsApplied||(Tu(e),e._urlSettingsApplied=!0),Lu(e,!0),Ru(e),Eu(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),ma(e);return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="h"){t.preventDefault(),e.handleConsciousnessFlush();return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const a=s[n];a!==e.sessionKey&&(t.preventDefault(),Se(e),e.sessionKey=a,Pe(e,a),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.loadAssistantIdentity(),ye(e,a,!0),se(e).then(()=>{js(e)}))},window.addEventListener("keydown",e.keydownHandler),ko(e),e.tab==="nodes"&&xo(e),e.tab==="logs"&&_o(e),e.tab==="debug"&&Ro(e)}function pw(e){Bh(e)}function hw(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),To(e),Co(e),Eo(e),Pu(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Me(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),a=s[s.length-1];if(a&&a.length>=4){const o=e.find(l=>l.key===a||l.key.endsWith(`:${a}`));if(o)return o}const i=t.replace(/^webchat:/,"");if(i!==t){const o=e.find(l=>l.key.endsWith(i)||l.key.endsWith(`:${i}`));if(o)return o}}function fw(e,t){if(!t||t.length===0)return;const n=d=>{const u=d.toLowerCase();return u==="main"||u==="agent:main:main"||u.endsWith(":main")},s=(d,u)=>{const h=d?.sessionId?.trim();if(h)return`session:${h}`;if(d){const m=[d.kind,d.surface,d.subject,d.room,d.space,d.label,d.displayName].map(w=>String(w??"").trim().toLowerCase()).join("|");if(m.replace(/\|/g,"").length>0)return`meta:${m}`}return`key:${u}`};let a=!1;const i=new Map,o=[];for(const d of e.settings.openTabs){const u=d.trim();if(!u){a=!0;continue}if(n(u)){a=!0;continue}const h=Me(t,u),f=h?.key??u;f!==d&&(a=!0);const m=s(h,f);if(i.has(m)){a=!0;continue}i.set(m,f),o.push(f)}const l=o.length!==e.settings.openTabs.length;if(a||l){const d={};for(const[$,c]of Object.entries(e.settings.tabLastViewed)){const g=$.trim();if(!g||typeof c!="number"||!Number.isFinite(c))continue;const k=Me(t,g),A=s(k,k?.key??g),T=i.get(A)??k?.key??g;d[T]=Math.max(d[T]??0,c)}const u=Me(t,e.sessionKey),h=s(u,u?.key??e.sessionKey.trim()),f=i.get(h)??u?.key??(e.sessionKey.trim()||o[0]||"main"),w=f==="main"||f.endsWith(":main")||o.includes(f)?f:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:w,lastActiveSessionKey:w,tabLastViewed:d}),e.sessionKey!==w&&(e.sessionKey=w)}}function gw(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&fw(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&Sl(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,a=!n||n.parallelLanes.some((i,o)=>i!==e.settings.parallelLanes[o]);(s||a)&&Sl(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-picker-container"),i=s.closest(".session-picker-dropdown");!a&&!i&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-search-container"),i=s.closest(".session-search-dropdown");!a&&!i&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&se(e).then(()=>{js(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&rs(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),a=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let i=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(i=!0)}t.has("chatStream")&&(i=!1),(n||s||a)&&ea(e),we(e,n||s||a||i||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Uc(e,t.has("tab")||t.has("logsAutoFollow"))}async function Al(e,t){return!1}async function mw(e,t){return null}function xl(e){return e.charAt(0).toUpperCase()||"A"}function Tl(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),a=n>=12?"PM":"AM";return`${n%12||12}:${s} ${a}`}function vw(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function Ku(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function Wu(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const _l=new WeakMap;function yw(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=_l.get(n),a=s??{lastMsgCount:0,lastStreamLen:0},i=e.messages.length,o=e.stream?.length??0,l=i!==a.lastMsgCount||o>a.lastStreamLen;_l.set(n,{lastMsgCount:i,lastStreamLen:o}),l&&(!s||Ku(n,120))&&Wu(t)})}function bw(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!Ku(t))}function qu(e,t){return e.allyAvatar?r`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?r`<span class="ally-panel__header-initial">${xl(e.allyName)}</span>`:r`${xl(e.allyName)}`}function Cl(e){if(e.role==="assistant"&&e.content){const t=be(e.content);return r`<div class="ally-msg__content chat-text">${Ae(t)}</div>`}return r`<span class="ally-msg__content">${e.content}</span>`}function ww(e,t){return!e.actions||e.actions.length===0?p:r`
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
  `}function $w(e,t,n){if(e.isNotification)return r`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${Cl(e)}
        ${ww(e,n)}
        ${e.timestamp?r`<div class="ally-msg__time">${Tl(e.timestamp)}</div>`:p}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return r`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${Cl(e)}
      ${e.timestamp?r`<div class="ally-msg__time">${Tl(e.timestamp)}</div>`:p}
    </div>
  `}function kw(e){if(!e)return p;const t=ld(e);return r`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${Ae(t)}</div>
    </div>
  `}function Sw(e){return e.connected?p:r`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function Aw(){return r`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function xw(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const a of Array.from(n)){if(!a.type.startsWith("image/"))continue;const i=a.getAsFile();if(!i)continue;e.preventDefault();const o=new FileReader,l=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const d=o.result;t.onAttachmentsChange([...t.attachments,{id:l,dataUrl:d,mimeType:i.type,fileName:i.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(i),s.push({id:l,dataUrl:"",mimeType:i.type,fileName:i.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function Tw(e){return e.attachments.length===0?p:r`
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
  `}function _w(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return r`
    ${Tw(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const a=s.target;vw(a),e.onDraftChange(a.value)}}
        @paste=${s=>xw(s,e)}
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
  `}function Cw(e){return r`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${qu(e,"bubble")}
        ${e.isWorking?r`<span class="ally-bubble__working"></span>`:p}
      </button>
      ${e.unreadCount>0?r`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:p}
    </div>
  `}function ju(e){return yw(e),r`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${qu(e,"header")}
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

    ${Sw(e)}

    <div class="ally-panel__messages" @scroll=${bw}>
      ${e.messages.length===0&&!e.stream?r`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:p}
      ${e.messages.map((t,n)=>$w(t,n,e.onAction))}
      ${e.stream?kw(e.stream):p}
      ${(e.isWorking||e.sending)&&!e.stream?Aw():p}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&Wu(n)}}
      >${q.chevronDown}</button>
    </div>

    ${_w(e)}
  `}function Rw(e){return e.open?r`
    <div class="ally-panel">
      ${ju(e)}
    </div>
  `:Cw(e)}function Ew(e){return e.open?r`
    <div class="ally-inline">
      ${ju(e)}
    </div>
  `:p}function je(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Vu(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(je(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function va(e){return e.filter(t=>typeof t=="string").join(".")}function _e(e,t){const n=va(e),s=t[n];if(s)return s;const a=n.split(".");for(const[i,o]of Object.entries(t)){if(!i.includes("*"))continue;const l=i.split(".");if(l.length!==a.length)continue;let d=!0;for(let u=0;u<a.length;u+=1)if(l[u]!=="*"&&l[u]!==a[u]){d=!1;break}if(d)return o}}function st(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function Pw(e){const t=va(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function rn(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const Lw=new Set(["title","description","default","nullable"]);function Iw(e){return Object.keys(e??{}).filter(n=>!Lw.has(n)).length===0}function Dw(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const ns={chevronDown:r`
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
  `};function tt(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,d=e.showLabel??!0,u=je(t),h=_e(s,a),f=h?.label??t.title??st(String(s.at(-1))),m=h?.help??t.description,w=va(s);if(i.has(w))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const c=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(c.length===1)return tt({...e,schema:c[0]});const g=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},k=c.map(g),A=k.every(_=>_!==void 0);if(A&&k.length>0&&k.length<=5){const _=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${f}</label>`:p}
          ${m?r`<div class="cfg-field__help">${m}</div>`:p}
          <div class="cfg-segmented">
            ${k.map((P,E)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${P===_||rn(P)===rn(_)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,P)}
              >
                ${rn(P)}
              </button>
            `)}
          </div>
        </div>
      `}if(A&&k.length>5)return El({...e,options:k,value:n??t.default});const T=new Set(c.map(_=>je(_)).filter(Boolean)),x=new Set([...T].map(_=>_==="integer"?"number":_));if([...x].every(_=>["string","number","boolean"].includes(_))){const _=x.has("string"),P=x.has("number");if(x.has("boolean")&&x.size===1)return tt({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||P)return Rl({...e,inputType:P&&!_?"number":"text"})}}if(t.enum){const $=t.enum;if($.length<=5){const c=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${f}</label>`:p}
          ${m?r`<div class="cfg-field__help">${m}</div>`:p}
          <div class="cfg-segmented">
            ${$.map(g=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${g===c||String(g)===String(c)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,g)}
              >
                ${String(g)}
              </button>
            `)}
          </div>
        </div>
      `}return El({...e,options:$,value:n??t.default})}if(u==="object")return Ow(e);if(u==="array")return Fw(e);if(u==="boolean"){const $=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${f}</span>
          ${m?r`<span class="cfg-toggle-row__help">${m}</span>`:p}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${$}
            ?disabled=${o}
            @change=${c=>l(s,c.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?Mw(e):u==="string"?Rl({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function Rl(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o,inputType:l}=e,d=e.showLabel??!0,u=_e(s,a),h=u?.label??t.title??st(String(s.at(-1))),f=u?.help??t.description,m=u?.sensitive??Pw(s),w=u?.placeholder??(m?"••••":t.default!==void 0?`Default: ${rn(t.default)}`:""),$=n??"";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${h}</label>`:p}
      ${f?r`<div class="cfg-field__help">${f}</div>`:p}
      <div class="cfg-input-wrap">
        <input
          type=${m?"password":l}
          class="cfg-input"
          placeholder=${w}
          .value=${rn($)}
          ?disabled=${i}
          @input=${c=>{const g=c.target.value;if(l==="number"){if(g.trim()===""){o(s,void 0);return}const k=Number(g);o(s,Number.isNaN(k)?g:k);return}o(s,g)}}
          @change=${c=>{if(l==="number")return;const g=c.target.value;o(s,g.trim())}}
        />
        ${t.default!==void 0?r`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${i}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:p}
      </div>
    </div>
  `}function Mw(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o}=e,l=e.showLabel??!0,d=_e(s,a),u=d?.label??t.title??st(String(s.at(-1))),h=d?.help??t.description,f=n??t.default??"",m=typeof f=="number"?f:0;return r`
    <div class="cfg-field">
      ${l?r`<label class="cfg-field__label">${u}</label>`:p}
      ${h?r`<div class="cfg-field__help">${h}</div>`:p}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,m-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${rn(f)}
          ?disabled=${i}
          @input=${w=>{const $=w.target.value,c=$===""?void 0:Number($);o(s,c)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,m+1)}
        >+</button>
      </div>
    </div>
  `}function El(e){const{schema:t,value:n,path:s,hints:a,disabled:i,options:o,onPatch:l}=e,d=e.showLabel??!0,u=_e(s,a),h=u?.label??t.title??st(String(s.at(-1))),f=u?.help??t.description,m=n??t.default,w=o.findIndex(c=>c===m||String(c)===String(m)),$="__unset__";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${h}</label>`:p}
      ${f?r`<div class="cfg-field__help">${f}</div>`:p}
      <select
        class="cfg-select"
        ?disabled=${i}
        .value=${w>=0?String(w):$}
        @change=${c=>{const g=c.target.value;l(s,g===$?void 0:o[Number(g)])}}
      >
        <option value=${$}>Select...</option>
        ${o.map((c,g)=>r`
          <option value=${String(g)}>${String(c)}</option>
        `)}
      </select>
    </div>
  `}function Ow(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e;e.showLabel;const d=_e(s,a),u=d?.label??t.title??st(String(s.at(-1))),h=d?.help??t.description,f=n??t.default,m=f&&typeof f=="object"&&!Array.isArray(f)?f:{},w=t.properties??{},c=Object.entries(w).toSorted((T,x)=>{const _=_e([...s,T[0]],a)?.order??0,P=_e([...s,x[0]],a)?.order??0;return _!==P?_-P:T[0].localeCompare(x[0])}),g=new Set(Object.keys(w)),k=t.additionalProperties,A=!!k&&typeof k=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${c.map(([T,x])=>tt({schema:x,value:m[T],path:[...s,T],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${A?Pl({schema:k,value:m,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:g,onPatch:l}):p}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${ns.chevronDown}</span>
      </summary>
      ${h?r`<div class="cfg-object__help">${h}</div>`:p}
      <div class="cfg-object__content">
        ${c.map(([T,x])=>tt({schema:x,value:m[T],path:[...s,T],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${A?Pl({schema:k,value:m,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:g,onPatch:l}):p}
      </div>
    </details>
  `}function Fw(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,d=e.showLabel??!0,u=_e(s,a),h=u?.label??t.title??st(String(s.at(-1))),f=u?.help??t.description,m=Array.isArray(t.items)?t.items[0]:t.items;if(!m)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${h}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const w=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?r`<span class="cfg-array__label">${h}</span>`:p}
        <span class="cfg-array__count">${w.length} item${w.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const $=[...w,Vu(m)];l(s,$)}}
        >
          <span class="cfg-array__add-icon">${ns.plus}</span>
          Add
        </button>
      </div>
      ${f?r`<div class="cfg-array__help">${f}</div>`:p}

      ${w.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${w.map(($,c)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${c+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const g=[...w];g.splice(c,1),l(s,g)}}
                >
                  ${ns.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${tt({schema:m,value:$,path:[...s,c],hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:l})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Pl(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:l,onPatch:d}=e,u=Iw(t),h=Object.entries(n??{}).filter(([f])=>!l.has(f));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const f={...n};let m=1,w=`custom-${m}`;for(;w in f;)m+=1,w=`custom-${m}`;f[w]=u?{}:Vu(t),d(s,f)}}
        >
          <span class="cfg-map__add-icon">${ns.plus}</span>
          Add Entry
        </button>
      </div>

      ${h.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${h.map(([f,m])=>{const w=[...s,f],$=Dw(m);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${f}
                    ?disabled=${o}
                    @change=${c=>{const g=c.target.value.trim();if(!g||g===f)return;const k={...n};g in k||(k[g]=k[f],delete k[f],d(s,k))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?r`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${$}
                          ?disabled=${o}
                          @change=${c=>{const g=c.target,k=g.value.trim();if(!k){d(w,void 0);return}try{d(w,JSON.parse(k))}catch{g.value=$}}}
                        ></textarea>
                      `:tt({schema:t,value:m,path:w,hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const c={...n};delete c[f],d(s,c)}}
                >
                  ${ns.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Ll={env:r`
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
  `},qo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Il(e){return Ll[e]??Ll.default}function Nw(e,t,n){if(!n)return!0;const s=n.toLowerCase(),a=qo[e];return e.toLowerCase().includes(s)||a&&(a.label.toLowerCase().includes(s)||a.description.toLowerCase().includes(s))?!0:Bn(t,s)}function Bn(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,a]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||Bn(a,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const a of s)if(a&&Bn(a,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&Bn(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&Bn(s,t))return!0}return!1}function Bw(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(je(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),a=t.properties,i=e.searchQuery??"",o=e.activeSection,l=e.activeSubsection??null,u=Object.entries(a).toSorted((f,m)=>{const w=_e([f[0]],e.uiHints)?.order??50,$=_e([m[0]],e.uiHints)?.order??50;return w!==$?w-$:f[0].localeCompare(m[0])}).filter(([f,m])=>!(o&&f!==o||i&&!Nw(f,m,i)));let h=null;if(o&&l&&u.length===1){const f=u[0]?.[1];f&&je(f)==="object"&&f.properties&&f.properties[l]&&(h={sectionKey:o,subsectionKey:l,schema:f.properties[l]})}return u.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${q.search}</div>
        <div class="config-empty__text">
          ${i?`No settings match "${i}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${h?(()=>{const{sectionKey:f,subsectionKey:m,schema:w}=h,$=_e([f,m],e.uiHints),c=$?.label??w.title??st(m),g=$?.help??w.description??"",k=n[f],A=k&&typeof k=="object"?k[m]:void 0,T=`config-section-${f}-${m}`;return r`
              <section class="config-section-card" id=${T}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Il(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${c}</h3>
                    ${g?r`<p class="config-section-card__desc">${g}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${tt({schema:w,value:A,path:[f,m],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([f,m])=>{const w=qo[f]??{label:f.charAt(0).toUpperCase()+f.slice(1),description:m.description??""};return r`
              <section class="config-section-card" id="config-section-${f}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Il(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${w.label}</h3>
                    ${w.description?r`<p class="config-section-card__desc">${w.description}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${tt({schema:m,value:n[f],path:[f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Uw=new Set(["title","description","default","nullable"]);function zw(e){return Object.keys(e??{}).filter(n=>!Uw.has(n)).length===0}function Hu(e){const t=e.filter(a=>a!=null),n=t.length!==e.length,s=[];for(const a of t)s.some(i=>Object.is(i,a))||s.push(a);return{enumValues:s,nullable:n}}function Gu(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Wn(e,[])}function Wn(e,t){const n=new Set,s={...e},a=va(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const l=Kw(e,t);return l||{schema:e,unsupportedPaths:[a]}}const i=Array.isArray(e.type)&&e.type.includes("null"),o=je(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=i||e.nullable,s.enum){const{enumValues:l,nullable:d}=Hu(s.enum);s.enum=l,d&&(s.nullable=!0),l.length===0&&n.add(a)}if(o==="object"){const l=e.properties??{},d={};for(const[u,h]of Object.entries(l)){const f=Wn(h,[...t,u]);f.schema&&(d[u]=f.schema);for(const m of f.unsupportedPaths)n.add(m)}if(s.properties=d,e.additionalProperties===!0)n.add(a);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!zw(e.additionalProperties)){const u=Wn(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(a)}}else if(o==="array"){const l=Array.isArray(e.items)?e.items[0]:e.items;if(!l)n.add(a);else{const d=Wn(l,[...t,"*"]);s.items=d.schema??l,d.unsupportedPaths.length>0&&n.add(a)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(a);return{schema:s,unsupportedPaths:Array.from(n)}}function Kw(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],a=[];let i=!1;for(const l of n){if(!l||typeof l!="object")return null;if(Array.isArray(l.enum)){const{enumValues:d,nullable:u}=Hu(l.enum);s.push(...d),u&&(i=!0);continue}if("const"in l){if(l.const==null){i=!0;continue}s.push(l.const);continue}if(je(l)==="null"){i=!0;continue}a.push(l)}if(s.length>0&&a.length===0){const l=[];for(const d of s)l.some(u=>Object.is(u,d))||l.push(d);return{schema:{...e,enum:l,nullable:i,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(a.length===1){const l=Wn(a[0],t);return l.schema&&(l.schema.nullable=i||l.schema.nullable),l}const o=new Set(["string","number","integer","boolean"]);return a.length>0&&s.length===0&&a.every(l=>l.type&&o.has(String(l.type)))?{schema:{...e,nullable:i},unsupportedPaths:[]}:null}function Ww(e,t){let n=e;for(const s of t){if(!n)return null;const a=je(n);if(a==="object"){const i=n.properties??{};if(typeof s=="string"&&i[s]){n=i[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(a==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function qw(e,t){const s=(e.channels??{})[t],a=e[t];return(s&&typeof s=="object"?s:null)??(a&&typeof a=="object"?a:null)??{}}function jw(e){const t=Gu(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Ww(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const a=e.configValue??{},i=qw(a,e.channelId);return r`
    <div class="config-form">
      ${tt({schema:s,value:i,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function at(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:jw({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function Vw(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Hw(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Gw(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Dl(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Qw(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:a,profileFormState:i,profileFormCallbacks:o,onEditProfile:l}=e,d=s[0],u=n?.configured??d?.configured??!1,h=n?.running??d?.running??!1,f=n?.publicKey??d?.publicKey,m=n?.lastStartAt??d?.lastStartAt??null,w=n?.lastError??d?.lastError??null,$=s.length>1,c=i!=null,g=A=>{const T=A.publicKey,x=A.profile,_=x?.displayName??x?.name??A.name??A.accountId;return r`
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
            <span class="monospace" title="${T??""}">${Dl(T)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${A.lastInboundAt?K(A.lastInboundAt):"n/a"}</span>
          </div>
          ${A.lastError?r`
                <div class="account-card-error">${A.lastError}</div>
              `:p}
        </div>
      </div>
    `},k=()=>{if(c&&o)return $h({state:i,callbacks:o,accountId:s[0]?.accountId??"default"});const A=d?.profile??n?.profile,{name:T,displayName:x,about:_,picture:P,nip05:E}=A??{},Z=T||x||_||P||E;return r`
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
              `:p}
        </div>
        ${Z?r`
              <div class="status-list">
                ${P?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${P}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${Y=>{Y.target.style.display="none"}}
                        />
                      </div>
                    `:p}
                ${T?r`<div><span class="label">Name</span><span>${T}</span></div>`:p}
                ${x?r`<div><span class="label">Display Name</span><span>${x}</span></div>`:p}
                ${_?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:p}
                ${E?r`<div><span class="label">NIP-05</span><span>${E}</span></div>`:p}
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

      ${$?r`
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
                <span>${h?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${f??""}"
                  >${Dl(f)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${m?K(m):"n/a"}</span>
              </div>
            </div>
          `}

      ${w?r`<div class="callout danger" style="margin-top: 12px;">${w}</div>`:p}

      ${k()}

      ${at({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Yw(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function Jw(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const a=s[e],i=typeof a?.configured=="boolean"&&a.configured,o=typeof a?.running=="boolean"&&a.running,l=typeof a?.connected=="boolean"&&a.connected,u=(n.channelAccounts?.[e]??[]).some(h=>h.configured||h.running||h.connected);return i||o||l||u}function Xw(e,t){return t?.[e]?.length??0}function Qu(e,t){const n=Xw(e,t);return n<2?p:r`<div class="account-count">Accounts (${n})</div>`}function Zw(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function e$(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function t$(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:a}=e,i=s.length>1,o=l=>{const u=l.probe?.bot?.username,h=l.name||l.accountId;return r`
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
          ${l.lastError?r`
                <div class="account-card-error">
                  ${l.lastError}
                </div>
              `:p}
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
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${at({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function n$(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
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
            ${n?.authAgeMs!=null?Yw(n.authAgeMs):"n/a"}
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

      ${at({channelId:"whatsapp",props:t})}
    </div>
  `}function s$(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,a=t?.discord??null;t?.googlechat;const i=t?.slack??null,o=t?.signal??null,l=t?.imessage??null,d=t?.nostr??null,h=a$(e.snapshot).map((f,m)=>({key:f,enabled:Jw(f,e),order:m})).toSorted((f,m)=>f.enabled!==m.enabled?f.enabled?-1:1:f.order-m.order);return r`
    <section class="grid grid-cols-2">
      ${h.map(f=>i$(f.key,e,{whatsapp:n,telegram:s,discord:a,slack:i,signal:o,imessage:l,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
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
          </div>`:p}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function a$(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function i$(e,t,n){const s=Qu(e,n.channelAccounts);switch(e){case"whatsapp":return n$({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return t$({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Vw({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return Hw({props:t,accountCountLabel:s});case"slack":return e$({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Zw({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Gw({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const a=n.channelAccounts?.nostr??[],i=a[0],o=i?.accountId??"default",l=i?.profile??null,d=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=d?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Qw({props:t,nostr:n.nostr,nostrAccounts:a,accountCountLabel:s,profileFormState:d,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,l)})}default:return o$(e,t,n.channelAccounts??{})}}function o$(e,t,n){const s=l$(t.snapshot,e),a=t.snapshot?.channels?.[e],i=typeof a?.configured=="boolean"?a.configured:void 0,o=typeof a?.running=="boolean"?a.running:void 0,l=typeof a?.connected=="boolean"?a.connected:void 0,d=typeof a?.lastError=="string"?a.lastError:void 0,u=n[e]??[],h=Qu(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${h}

      ${u.length>0?r`
            <div class="account-card-list">
              ${u.map(f=>p$(f))}
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

      ${d?r`<div class="callout danger" style="margin-top: 12px;">
            ${d}
          </div>`:p}

      ${at({channelId:e,props:t})}
    </div>
  `}function r$(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function l$(e,t){return r$(e)[t]?.label??e?.channelLabels?.[t]??t}const c$=600*1e3;function Yu(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<c$:!1}function d$(e){return e.running?"Yes":Yu(e)?"Active":"No"}function u$(e){return e.connected===!0?"Yes":e.connected===!1?"No":Yu(e)?"Active":"n/a"}function p$(e){const t=d$(e),n=u$(e);return r`
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
            `:p}
      </div>
    </div>
  `}const qn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),qn(s,t);return!0},Qs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Ju=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),g$(t)}};function h$(e){this._$AN!==void 0?(Qs(this),this._$AM=e,Ju(this)):this._$AM=e}function f$(e,t=!1,n=0){const s=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(s))for(let i=n;i<s.length;i++)qn(s[i],!1),Qs(s[i]);else s!=null&&(qn(s,!1),Qs(s));else qn(this,e)}const g$=e=>{e.type==Yi.CHILD&&(e._$AP??=f$,e._$AQ??=h$)};class m$ extends Xi{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Ju(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(qn(this,t),Qs(this))}setValue(t){if(Xb(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const ei=new WeakMap,v$=Ji(class extends m${render(e){return p}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),p}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=ei.get(t);n===void 0&&(n=new WeakMap,ei.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?ei.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function y$(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const b$=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function w$(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=y$(e).trim();if(!n)return!1;let s=n;if((n.startsWith("<system-context")||n.startsWith("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const a=s.toLowerCase();return b$.filter(i=>a.includes(i)).length>=2}const Ml=25*1024*1024,Ol=50*1024*1024,Fl=20;function ti(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function jo(e,t=0){const n=[],s=[];let a=t;const i=Array.from(e);for(const o of i){if(n.length>=Fl){s.push(`Maximum ${Fl} files allowed per upload`);break}if(o.size>Ml){s.push(`"${o.name}" is too large (${ti(o.size)}). Max ${ti(Ml)}. For larger files, mention the file path instead.`);continue}if(a+o.size>Ol){s.push(`Total upload size exceeds ${ti(Ol)} limit`);break}a+=o.size,n.push(o)}return{validFiles:n,errors:s}}const $$=new Set(["md","markdown","mdx"]),k$=new Set(["htm","html"]),S$=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function Xu(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function A$(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?$$.has(n)?"text/markdown":k$.has(n)?"text/html":S$.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function Zu(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return A$(e.filePath??null)??"text/markdown"}function x$(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function T$(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const a=s.getAttribute("href");if(!a)return;const i=x$(a);i&&(e.preventDefault(),e.stopPropagation(),t(i))}function _$(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=Zu(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${Xu(e.filePath??"Image preview")} />
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
      @load=${o=>{URL.revokeObjectURL(i);const l=o.target;try{const d=l.contentDocument?.documentElement?.scrollHeight;d&&(l.style.height=`${d}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const a=od(n);return r`<div
      class="sidebar-markdown"
      @click=${i=>T$(i,e.onOpenFile)}
    >${Ae(be(a))}</div>`}return r`<pre class="sidebar-plain">${n}</pre>`}function C$(e){const t=Zu(e);return t==="text/html"||t==="application/xhtml+xml"}function R$(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Di(e){const t=e.title?.trim()||"Tool Output",n=C$(e)&&e.content;return r`
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
                @click=${()=>R$(e.content)}
              >Open in Browser</button>`:p}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${q.x}
          </button>
        </div>
      </div>
      ${E$(e)}
      <div class="sidebar-content">${_$(e)}</div>
    </div>
  `}function E$(e){if(e.resource)return r`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||Xu(e.filePath);return r`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return p}function Mi(e){const t=e.title?.trim()||e.slug,n=e.viewUrl||"",s=!!e.fallbackMarkdown,a=s?be(e.fallbackMarkdown):"";return r`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          <div class="sidebar-path" title=${n}>
            ${s?"Local copy — Proof is temporarily unavailable":"Live co-editing via Proof"}
          </div>
        </div>
        <div class="sidebar-header-actions">
          ${!s&&n?r`<button
                class="btn sidebar-open-browser-btn"
                title="Copy shareable link"
                @click=${async()=>{try{await navigator.clipboard.writeText(n)}catch{window.prompt("Copy Proof link",n)}}}
              >Share</button>`:p}
          ${e.filePath&&e.onPushToDrive?r`<button
                class="btn sidebar-open-browser-btn"
                title="Upload the Proof markdown mirror to Google Drive"
                @click=${()=>e.onPushToDrive?.(e.filePath)}
              >Drive</button>`:p}
          ${s?p:r`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser"
                @click=${()=>window.open(n,"_blank","noopener,noreferrer")}
              >Open</button>`}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${q.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        ${s?r`
              <div style="padding: 4px 16px; background: #fff3cd; color: #856404; font-size: 12px; border-bottom: 1px solid #ffc107;">
                Proof is temporarily unavailable. Showing your last-synced local copy.
              </div>
              <div class="markdown-body" style="padding: 16px; overflow-y: auto; flex: 1;">
                ${Ae(a)}
              </div>`:n?r`<iframe
                src=${n}
                class="proof-iframe"
                style="width: 100%; height: 100%; border: none; flex: 1;"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              ></iframe>`:r`<div style="padding: 24px; color: #888;">No Proof URL available. Is the Proof API reachable?</div>`}
      </div>
    </div>
  `}var P$=Object.defineProperty,L$=Object.getOwnPropertyDescriptor,cs=(e,t,n,s)=>{for(var a=s>1?void 0:s?L$(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&P$(t,n,a),a};let Ut=class extends on{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((n?e.clientY:e.clientX)-this.startPos)/s;let l=this.startRatio+o;l=Math.max(this.minRatio,Math.min(this.maxRatio,l)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:l},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Ut.styles=zp`
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
  `;cs([ss({type:Number})],Ut.prototype,"splitRatio",2);cs([ss({type:Number})],Ut.prototype,"minRatio",2);cs([ss({type:Number})],Ut.prototype,"maxRatio",2);cs([ss({type:String})],Ut.prototype,"direction",2);Ut=cs([Ic("resizable-divider")],Ut);const I$=5e3;function D$(e){const t=(e??"").trim();if(!t||t==="/")return"/consciousness-icon.webp";const n=t.startsWith("/")?t:`/${t}`;return`${n.endsWith("/")?n.slice(0,-1):n}/consciousness-icon.webp`}function Nl(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function M$(e){const t=e.sessions?.sessions?.find(a=>a.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function O$(e){const t=M$(e);if(t===null)return p;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",a=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),i=a?.totalTokens??0,o=a?.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return r`
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
  `}function F$(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${q.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<I$?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${q.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:p:p}function Vo(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function N$(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function B$(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function U$(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function z$(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=jo(s,i);for(const h of l)t.showToast?.(h,"error");if(o.length===0)return;const d=[];let u=o.length;for(const h of o){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;d.push({id:Vo(),dataUrl:m,mimeType:h.type||"application/octet-stream",fileName:h.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...d])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${h.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...a,...d])}),f.readAsDataURL(h)}}function K$(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let h=0;h<n.length;h++){const f=n[h];if(f.type.startsWith("image/")){const m=f.getAsFile();m&&s.push(m)}}if(s.length===0)return;e.preventDefault();const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=jo(s,i);for(const h of l)t.showToast?.(h,"error");if(o.length===0)return;const d=[];let u=o.length;for(const h of o){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;d.push({id:Vo(),dataUrl:m,mimeType:h.type,fileName:h.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...a,...d])}),f.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...a,...d])}),f.readAsDataURL(h)}}function W$(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((h,f)=>h+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=jo(s,i);for(const h of l)t.showToast?.(h,"error");if(o.length===0){n.value="";return}const d=[];let u=o.length;for(const h of o){const f=new FileReader;f.addEventListener("load",()=>{const m=f.result;d.push({id:Vo(),dataUrl:m,mimeType:h.type||"application/octet-stream",fileName:h.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...d])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${h.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...a,...d])}),f.readAsDataURL(h)}n.value=""}function q$(e){const t=e.attachments??[];return t.length===0?p:r`
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
  `}function j$(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function V$(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function H$(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function G$(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!j$(e))return;const a=s.closest("a");if(a instanceof HTMLAnchorElement){if(a.hasAttribute("download"))return;const d=a.getAttribute("href");if(!d)return;if(t.onOpenProof)try{const h=d.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(h){e.preventDefault(),t.onOpenProof(h[1]);return}}catch{}try{const h=new URL(d,window.location.href);if(/^https?:$/.test(h.protocol)&&h.origin!==window.location.origin){e.preventDefault(),window.open(h.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(d)||V$(a);return}const i=s.closest("code");if(!(i instanceof HTMLElement))return;const o=(i.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const l=H$(o);l&&(e.preventDefault(),await t.onMessageLinkClick(l))}const Q$={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function Y$(e){const t=e.sessionResources;if(!t||t.length===0)return p;if(e.sessionResourcesCollapsed)return r`
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
              <span>${Q$[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function J$(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const a=e.sessions?.sessions?.find(w=>w.key===e.sessionKey)?.reasoningLevel??"off",i=e.showThinking&&a!=="off",o={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,d=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",u=e.splitRatio??.6,h=!!(e.sidebarOpen&&e.onCloseSidebar),f=D$(e.basePath),m=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${w=>{G$(w,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:p}
      ${ga(tk(e),w=>w.key,w=>{try{if(w.kind==="reading-indicator")return Lm(o,e.currentToolInfo);if(w.kind==="stream")return Im(w.text,w.startedAt,e.onOpenSidebar,o,e.currentToolInfo);if(w.kind==="compaction-summary")return Fm(w.message);if(w.kind==="group"){const $=e.resolveImageUrl?(c,g)=>e.resolveImageUrl(c,g):void 0;return Dm(w,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:$,showReasoning:i,assistantName:e.assistantName,assistantAvatar:o.avatar,userName:e.userName,userAvatar:e.userAvatar})}return p}catch($){return console.error("[chat] item render error:",$,w.key),p}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${N$}
      @dragenter=${w=>B$(w,w.currentTarget)}
      @dragleave=${w=>U$(w,w.currentTarget)}
      @drop=${w=>z$(w,e)}
    >
      ${e.privateMode?r`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:p}

      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:p}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:p}

      ${F$(e.compactionStatus)}

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
              ${q.x}
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
                .splitRatio=${u}
                @resize=${w=>e.onSplitRatioChange?.(w.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?r`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Mi({slug:e.sidebarProofSlug,title:e.sidebarTitle??null,viewUrl:e.sidebarProofUrl??null,filePath:e.sidebarFilePath??null,fallbackMarkdown:e.sidebarProofHtml??null,onClose:e.onCloseSidebar,onPushToDrive:e.onPushToDrive}):Di({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${Ew(e.allyProps)}
                    </div>
                  </div>
                `:r`
                  <div class="chat-sidebar">
                    ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Mi({slug:e.sidebarProofSlug,title:e.sidebarTitle??null,viewUrl:e.sidebarProofUrl??null,filePath:e.sidebarFilePath??null,fallbackMarkdown:e.sidebarProofHtml??null,onClose:e.onCloseSidebar,onPushToDrive:e.onPushToDrive}):Di({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:p}
      </div>

      ${e.queue.length?r`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(w=>r`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${w.text||(w.attachments?.length?`Image (${w.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(w.id)}
                      >
                        ${q.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:p}

      ${Y$(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${w=>W$(w,e)}
          />
          ${q$(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${v$(w=>w&&Nl(w))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${w=>{if(w.key!=="Enter"||w.isComposing||w.keyCode===229||w.shiftKey||!e.connected)return;w.preventDefault();const $=w.ctrlKey||w.metaKey;t&&e.onSend($)}}
              @input=${w=>{const $=w.target;Nl($),e.onDraftChange($.value)}}
              @paste=${w=>K$(w,e)}
              placeholder=${d}
            ></textarea>

            <div class="chat-compose__actions">
              ${O$(e)}

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
                `:p}

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
                `:p}

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
  `}const Bl=200;function X$(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const a=hd(s.message),i=uo(a.role),o=a.timestamp||Date.now();!n||n.role!==i?(n&&t.push(n),n={kind:"group",key:`group:${i}:${s.key}`,role:i,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Z$(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const a=s;if(a.type==="image")return!0;if(Array.isArray(a.content)){for(const i of a.content)if(!(typeof i!="object"||i===null)&&i.type==="image")return!0}}return!1}function ek(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const a=s,i=typeof a.type=="string"?a.type:"";if(i!=="toolCall"&&i!=="tool_use"&&i!=="thinking")return!1}return!0}function tk(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],a=Math.max(0,n.length-Bl);a>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Bl} messages (${a} hidden).`,timestamp:Date.now()}});for(let i=a;i<n.length;i++){const o=n[i];if(o._chatIdx=i,Nm(o)){t.push({kind:"compaction-summary",key:`compaction:${i}`,message:o});continue}if(w$(o))continue;const l=hd(o);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Z$(o)||!e.showThinking&&l.role.toLowerCase()==="assistant"&&ek(o)||t.push({kind:"message",key:Ul(o,i),message:o})}if(e.showThinking)for(let i=0;i<s.length;i++)t.push({kind:"message",key:Ul(s[i],i+n.length),message:s[i]});if(e.stream!==null){const i=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:i,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:i})}else if(e.isWorking){const i=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}else if(e.sending||e.canAbort){const i=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}return X$(t)}function Ul(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const a=typeof n.id=="string"?n.id:"";if(a)return`msg:${a}`;const i=typeof n.messageId=="string"?n.messageId:"";if(i)return`msg:${i}`;const o=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";if(o!=null){const d=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${l}:${o}:${d||t}`}return`msg:${l}:${t}`}function nk(e,t=128){return new Promise((n,s)=>{const a=new Image;a.addEventListener("load",()=>{const i=document.createElement("canvas");i.width=t,i.height=t;const o=i.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const l=Math.min(a.width,a.height),d=(a.width-l)/2,u=(a.height-l)/2;o.drawImage(a,d,u,l,l,0,0,t,t),n(i.toDataURL("image/png"))}),a.addEventListener("error",()=>s(new Error("Failed to load image"))),a.src=URL.createObjectURL(e)})}let tn="",Un=null,Ct=null,zl=!1,ct=!1;function sk(e){zl||(tn=e.userName||"",Un=e.userAvatar||null,Ct=e.userAvatar||null,zl=!0,ct=!1)}function ak(e){sk(e);const t=d=>{tn=d.target.value,ct=!0},n=async d=>{const h=d.target.files?.[0];if(h){if(!h.type.startsWith("image/")){alert("Please select an image file");return}if(h.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const f=await nk(h,128);Un=f,Ct=f,ct=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(f){console.error("Failed to process image:",f),alert("Failed to process image")}}},s=()=>{Un=null,Ct=null,ct=!0;const d=document.getElementById("user-avatar-input");d&&(d.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},a=()=>{e.onUpdate(tn,Un||""),ct=!1;const d=document.querySelector(".user-settings__save");d&&(d.textContent="Saved!",setTimeout(()=>{d.textContent="Save"},1500))},i=()=>{tn=e.userName||"",Un=e.userAvatar||null,Ct=e.userAvatar||null,ct=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=tn||"You",l=Ct?r`<img src="${Ct}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
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
                  ${Ct?r`
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
                .value=${tn}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${ct?r`
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
                ?disabled=${!ct}
                @click=${a}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Oi={all:r`
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
  `},ni=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Kl=new Set(["user","model"]),Wl="__all__";function ql(e){return Oi[e]??Oi.default}function ik(e,t){const n=qo[e];return n||{label:t?.title??st(e),description:t?.description??""}}function ok(e){const{key:t,schema:n,uiHints:s}=e;if(!n||je(n)!=="object"||!n.properties)return[];const a=Object.entries(n.properties).map(([i,o])=>{const l=_e([t,i],s),d=l?.label??o.title??st(i),u=l?.help??o.description??"",h=l?.order??50;return{key:i,label:d,description:u,order:h}});return a.sort((i,o)=>i.order!==o.order?i.order-o.order:i.key.localeCompare(o.key)),a}function rk(e,t){if(!e||!t)return[];const n=[];function s(a,i,o){if(a===i)return;if(typeof a!=typeof i){n.push({path:o,from:a,to:i});return}if(typeof a!="object"||a===null||i===null){a!==i&&n.push({path:o,from:a,to:i});return}if(Array.isArray(a)&&Array.isArray(i)){JSON.stringify(a)!==JSON.stringify(i)&&n.push({path:o,from:a,to:i});return}const l=a,d=i,u=new Set([...Object.keys(l),...Object.keys(d)]);for(const h of u)s(l[h],d[h],o?`${o}.${h}`:h)}return s(e,t,""),n}function jl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const Vl={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function lk(e){const t=[],n=e.models,s=e.agents,a=n?.providers;if(a&&typeof a=="object")for(const[o,l]of Object.entries(a)){const d=l;for(const u of d.models??[])t.push({id:`${o}/${u.id}`,name:u.name??u.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:u.reasoning??!1,contextWindow:u.contextWindow??0})}const i=s?.defaults?.models;if(i&&typeof i=="object")for(const o of Object.keys(i)){if(t.some(d=>d.id===o))continue;const l=o.split("/");t.push({id:o,name:l.slice(1).join("/"),provider:l[0]??"unknown",providerLabel:(l[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function ck(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function dk(e){const t=e.formValue;if(!t)return r`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",a=n?.defaults?.model?.fallbacks??[],i=lk(t),o=new Map;for(const d of i){const u=o.get(d.provider)??[];u.push(d),o.set(d.provider,u)}const l=e.saving||e.applying;return r`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${a.length>0?r`<div class="model-picker__fallback">Fallback: ${a.join(", ")}</div>`:p}
      </div>

      ${l?r`<div class="model-picker__status">Switching model...</div>`:p}

      ${Array.from(o.entries()).map(([d,u])=>r`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${Vl[d]??"var(--accent)"}"></span>
              ${u[0]?.providerLabel??d}
            </div>
            <div class="model-picker__cards">
              ${u.map(h=>{const f=h.id===s,m=Vl[h.provider]??"var(--accent)";return r`
                  <button
                    class="model-card ${f?"model-card--active":""}"
                    style="--model-accent: ${m}"
                    ?disabled=${l}
                    @click=${()=>{f||!e.onModelSwitch||e.onModelSwitch(h.id,ck(h.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${h.name||h.id}</div>
                      ${h.reasoning?r`<span class="model-card__tag">reasoning</span>`:p}
                      ${h.contextWindow>0?r`<span class="model-card__ctx">${Math.round(h.contextWindow/1e3)}k ctx</span>`:p}
                    </div>
                    ${f?r`<span class="model-card__check">Active</span>`:p}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function uk(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Gu(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,a=n.schema?.properties??{},i=ni.filter(E=>E.key in a&&!Kl.has(E.key)),o=new Set(ni.map(E=>E.key)),l=Object.keys(a).filter(E=>!o.has(E)).map(E=>({key:E,label:E.charAt(0).toUpperCase()+E.slice(1)})),d=ni.filter(E=>Kl.has(E.key)),u=[...i,...l,...d],h=e.activeSection&&n.schema&&je(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,f=e.activeSection?ik(e.activeSection,h):null,m=e.activeSection?ok({key:e.activeSection,schema:h,uiHints:e.uiHints}):[],w=e.formMode==="form"&&!!e.activeSection&&m.length>0,$=e.activeSubsection===Wl,c=e.searchQuery||$?null:e.activeSubsection??m[0]?.key??null,g=e.formMode==="form"?rk(e.originalValue,e.formValue):[],k=e.formMode==="raw"&&e.raw!==e.originalRaw,A=e.formMode==="form"?g.length>0:k,T=!!e.formValue&&!e.loading&&!!n.schema,x=e.connected&&!e.saving&&A&&(e.formMode==="raw"?!0:T),_=e.connected&&!e.applying&&!e.updating&&A&&(e.formMode==="raw"?!0:T),P=e.connected&&!e.applying&&!e.updating;return r`
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
            <span class="config-nav__icon">${Oi.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${u.map(E=>r`
            <button
              class="config-nav__item ${e.activeSection===E.key?"active":""}"
              @click=${()=>e.onSectionChange(E.key)}
            >
              <span class="config-nav__icon">${ql(E.key)}</span>
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
              ?disabled=${!P}
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
              ${g.map(E=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${E.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${jl(E.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${jl(E.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:p}

        ${f&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${ql(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${f.label}</div>
                  ${f.description?r`<div class="config-section-hero__desc">${f.description}</div>`:p}
                </div>
              </div>
            `:p}

        ${w?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${c===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Wl)}
                >
                  All
                </button>
                ${m.map(E=>r`
                    <button
                      class="config-subnav__item ${c===E.key?"active":""}"
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
          ${e.activeSection==="model"?dk(e):e.activeSection==="user"?ak({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Bw({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:c})}
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
                      @input=${E=>e.onRawChange(E.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:p}
      </main>
    </div>
  `}function pk(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",a=e.version??"";return`${t} ${n} ${s} ${a}`.trim()}function hk(e){const t=e.ts??null;return t?K(t):"n/a"}function ep(e){return e?`${Jn(e)} (${K(e)})`:"n/a"}function fk(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function gk(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function mk(e){const t=e.state??{},n=t.nextRunAtMs?Jn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Jn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function vk(e){const t=e.schedule;return t.kind==="at"?`At ${Jn(t.atMs)}`:t.kind==="every"?`Every ${Gi(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function yk(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function bk(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(a=>s.has(a)?!1:(s.add(a),!0))}function wk(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function $k(e){const t=bk(e);return r`
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
            <div class="stat-value">${ep(e.status?.nextWakeAtMs??null)}</div>
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
        ${kk(e)}
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
              ${e.jobs.map(n=>Sk(n,e))}
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
                ${e.runs.map(n=>Ak(n))}
              </div>
            `}
    </section>
  `}function kk(e){const t=e.form;return t.scheduleKind==="at"?r`
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
  `}function Sk(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${vk(e)}</div>
        <div class="muted">${yk(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:p}
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
  `}function Ak(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Jn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:p}
      </div>
    </div>
  `}function xk(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,a=n?.warn??0,i=n?.info??0,o=s>0?"danger":a>0?"warn":"success",l=s>0?`${s} critical`:a>0?`${a} warnings`:"No critical issues";return r`
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
                      <pre class="code-block">${gk(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function Tk(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function St(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:p}function _k(e){const t=e.execApprovalQueue[0];if(!t)return p;const n=t.request,s=t.expiresAtMs-Date.now(),a=s>0?`expires in ${Tk(s)}`:"expired",i=e.execApprovalQueue.length;return r`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${a}</div>
          </div>
          ${i>1?r`<div class="exec-approval-queue">${i} pending</div>`:p}
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
  `}function Ck(e){const{pendingGatewayUrl:t}=e;return t?r`
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
  `:p}function Rk(e){if(!e.gatewayRestartPending)return p;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return r`
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
  `}function Ek(e){return r`
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
              `:e.entries.map(t=>Pk(t))}
      </div>
    </section>
  `}function Pk(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],a=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],i=a.length>0?a.length>3?`${a.length} scopes`:`scopes: ${a.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${pk(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>r`<span class="chip">${o}</span>`)}
          ${i?r`<span class="chip">${i}</span>`:p}
          ${e.platform?r`<span class="chip">${e.platform}</span>`:p}
          ${e.deviceFamily?r`<span class="chip">${e.deviceFamily}</span>`:p}
          ${e.modelIdentifier?r`<span class="chip">${e.modelIdentifier}</span>`:p}
          ${e.version?r`<span class="chip">${e.version}</span>`:p}
        </div>
      </div>
      <div class="list-meta">
        <div>${hk(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const Hl=["trace","debug","info","warn","error","fatal"];function Lk(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function Ik(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function Dk(e){const t=e.filterText.trim().toLowerCase(),n=Hl.some(i=>!e.levelFilters[i]),s=e.entries.filter(i=>i.level&&!e.levelFilters[i.level]?!1:Ik(i,t)),a=t||n?"filtered":"visible";return r`
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
        ${Hl.map(i=>r`
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

      ${e.file?r`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:p}
      ${e.truncated?r`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:p}
      ${e.error?r`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:p}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?r`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(i=>r`
                <div class="log-row">
                  <div class="log-time mono">${Lk(i.time)}</div>
                  <div class="log-level ${i.level??""}">${i.level??""}</div>
                  <div class="log-subsystem mono">${i.subsystem??""}</div>
                  <div class="log-message mono">${i.message??i.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const Mk=/(^~\/|^\/|^\.\.?\/|[\\/])/;function Gl(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!Mk.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function Ok(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const a=n.getAttribute("href")??"";let i=a;if(a.includes("%"))try{i=decodeURIComponent(a)}catch{i=a}return Gl(i)}const s=t.closest("code");return!s||s.closest("pre")?null:Gl(s.textContent??"")}function Fk(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const a=We(n,{listDepth:0,orderedIndex:[]});return Bk(a)}function Fi(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${Xe(n,t)}

`;case"h2":return`## ${Xe(n,t)}

`;case"h3":return`### ${Xe(n,t)}

`;case"h4":return`#### ${Xe(n,t)}

`;case"h5":return`##### ${Xe(n,t)}

`;case"h6":return`###### ${Xe(n,t)}

`;case"p":return`${We(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${We(n,t)}**`;case"em":case"i":return`*${We(n,t)}*`;case"del":return`~~${We(n,t)}~~`;case"a":{const a=n.getAttribute("href")??"",i=We(n,t);return!a||a===i?i:`[${i}](${a})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const a=n.querySelector("code"),i=a?a.textContent??"":n.textContent??"",o=a?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${i}
\`\`\`

`}case"blockquote":return We(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return Ql(n,t,!1);case"ol":return Ql(n,t,!0);case"li":return tp(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return Nk(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return We(n,t);default:return We(n,t)}}function We(e,t){let n="";for(const s of Array.from(e.childNodes))n+=Fi(s,t);return n}function Xe(e,t){return We(e,t).replace(/\n+/g," ").trim()}function Ql(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),a="  ".repeat(t.listDepth);let i="";for(let o=0;o<s.length;o++){const l=s[o],d={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},u=n?`${o+1}. `:"- ",h=tp(l,d);i+=`${a}${u}${h}
`}return t.listDepth===0&&(i+=`
`),i}function tp(e,t){let n="";for(const s of Array.from(e.childNodes)){const a=s.tagName?.toLowerCase();a==="ul"||a==="ol"?n+=`
`+Fi(s,t):n+=Fi(s,t)}return n.trim()}function Nk(e,t){const n=[],s=e.querySelector("thead tr"),a=e.querySelectorAll("tbody tr");if(s){const u=Array.from(s.querySelectorAll("th, td")).map(h=>Xe(h,t));n.push(u)}for(const u of Array.from(a)){const h=Array.from(u.querySelectorAll("td, th")).map(f=>Xe(f,t));n.push(h)}if(n.length===0){const u=e.querySelectorAll("tr");for(const h of Array.from(u)){const f=Array.from(h.querySelectorAll("td, th")).map(m=>Xe(m,t));n.push(f)}}if(n.length===0)return"";const i=Math.max(...n.map(u=>u.length)),o=[];for(let u=0;u<i;u++)o[u]=Math.max(3,...n.map(h=>(h[u]??"").length));let l="";const d=u=>`| ${o.map((f,m)=>(u[m]??"").padEnd(f)).join(" | ")} |`;l+=d(n[0])+`
`,l+=`| ${o.map(u=>"-".repeat(u)).join(" | ")} |
`;for(let u=1;u<n.length;u++)l+=d(n[u])+`
`;return l+`
`}function Bk(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function Uk(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function zk(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function Kk(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let jn=null,hn=null;function Yl(e,t,n=1500){jn&&clearTimeout(jn),jn=setTimeout(()=>{e!==hn&&(hn=e,t(e))},n)}function Wk(e,t){jn&&clearTimeout(jn),e!==hn&&(hn=e,t(e))}function si(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return Fk(e.innerHTML)}function qk(e){const{data:t,loading:n,error:s,onRefresh:a,onGenerate:i,onOpenInObsidian:o,onSaveBrief:l,onToggleCheckbox:d,onOpenFile:u}=e;if(n)return r`
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
            ${a?r`<button class="retry-button" @click=${a}>Retry</button>`:p}
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
            ${i?r`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:a?r`<button class="brief-generate-btn" @click=${a}>Generate Brief Now</button>`:p}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;hn===null&&(hn=t.content);const h=g=>{const k=g.currentTarget;if(l){const A=si(k);Yl(A,l)}},f=g=>{if((g.ctrlKey||g.metaKey)&&g.key==="s"){g.preventDefault();const k=g.currentTarget;if(l){const A=si(k);Wk(A,l)}}if((g.ctrlKey||g.metaKey)&&g.key==="l"){g.preventDefault();const k=window.getSelection();if(!k||k.rangeCount===0)return;const A=k.focusNode,T=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");if(T){const x=T.querySelector('input[type="checkbox"]');if(x)x.nextSibling?.nodeType===Node.TEXT_NODE&&x.nextSibling.textContent===" "&&x.nextSibling.remove(),x.remove();else{const P=document.createElement("input");P.type="checkbox",T.insertBefore(document.createTextNode(" "),T.firstChild),T.insertBefore(P,T.firstChild)}const _=g.currentTarget;if(l){const P=si(_);Yl(P,l)}}}if(g.key==="Enter"&&!g.shiftKey){const k=window.getSelection();if(!k||k.rangeCount===0)return;const A=k.focusNode,T=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");T&&T.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const x=window.getSelection();if(!x||x.rangeCount===0)return;const _=x.focusNode,P=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");if(P&&P!==T&&!P.querySelector('input[type="checkbox"]')){const E=document.createElement("input");E.type="checkbox",P.insertBefore(E,P.firstChild),P.insertBefore(document.createTextNode(" "),E.nextSibling);const Z=document.createRange();Z.setStartAfter(E.nextSibling),Z.collapse(!0),x.removeAllRanges(),x.addRange(Z)}},0)}},m=g=>{const k=g.target;if(k.tagName==="INPUT"&&k.getAttribute("type")==="checkbox"){const x=k,_=g.currentTarget;if(d&&_){const E=Array.from(_.querySelectorAll('input[type="checkbox"]')).indexOf(x);E>=0&&d(E,x.checked)}return}const A=Ok(g.target);if(A&&u){g.preventDefault(),u(A);return}const T=k.closest?.("a")??k.parentElement?.closest("a");if(T){const x=T.getAttribute("href")??"";/^https?:\/\//i.test(x)&&(g.preventDefault(),window.open(x,"_blank","noopener,noreferrer"))}},w=Sg(Uk(t.content)),$=t.summary.readiness!=null?r`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:p,c=t.summary.tasks.total>0?r`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:p;return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${$}
          ${c}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${zk(t.updatedAt)}</span>
          ${o?r`
                <a
                  href="${Kk(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${g=>{g.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:p}
          ${a?r`
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
            @input=${h}
            @keydown=${f}
            @click=${m}
          >${Ae(w)}</div>
        </div>
      </div>
    </div>
  `}function np(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function jk(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function Vk(e){return e<=2?"Poor":e<=4?"Below expectations":e<=6?"Okay":e<=8?"Good":"Excellent"}function sp(e,t){if(e.scoringId!==t.id)return p;const n=e.scoringValue??7,s=e.feedbackText??"",a=n<=4,i=n<=4||n>=9;return r`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${n<=4?"low":n>=9?"high":""}">${n}/10 — ${Vk(n)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="inbox-score-btn${o===n?" active":""}${o<=4?" low":o>=9?" high":""}"
              @click=${()=>e.onSetScoring(t.id,o)}
            >${o}</button>
          `)}
      </div>
      ${i?r`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${a?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${s}
                @input=${o=>e.onFeedbackChange(o.target.value)}
              ></textarea>
            </div>
          `:p}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${a&&!s.trim()}
          @click=${()=>e.onScore(t.id,n,s.trim()||void 0)}
        >Submit ${n}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${()=>e.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function Hk(e,t){const n=t.deliverables??[];return r`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${np(t.createdAt)}</span>
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
      ${sp(e,t)}
    </div>
  `}function Gk(e,t){if(t.type==="project-completion")return Hk(e,t);const n=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return r`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${jk(t)}</span>
        <span class="inbox-card-time">${np(t.createdAt)}</span>
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
      ${sp(e,t)}
    </div>
  `}function Qk(e){const t=e.sortOrder??"newest",n=e.items.filter(a=>a.status==="pending").sort((a,i)=>{const o=new Date(i.createdAt).getTime()-new Date(a.createdAt).getTime();return t==="oldest"?-o:o}),s=e.count??n.length;return e.loading?r`<div class="inbox-loading">Loading inbox…</div>`:s===0?r`
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
          ${n.map(a=>Gk(e,a))}
        </div>
      </div>
    </div>
  `}function ap(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Ho(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function Jl(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function ip(e){return`ws-task-priority ws-task-priority--${e}`}function op(e){return e==="high"?"High":e==="low"?"Low":"Med"}function rp(e){if(!e)return"";const t=ce();return e===t?"Today":e<t?`Overdue (${e})`:e}function lp(e){if(!e)return"ws-task-due";const t=ce();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Ys(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,a)=>{if(t==="priority"){const i=n[s.priority]-n[a.priority];return i!==0?i:s.dueDate&&a.dueDate?s.dueDate.localeCompare(a.dueDate):s.dueDate&&!a.dueDate?-1:!s.dueDate&&a.dueDate?1:0}if(t==="newest")return(a.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&a.dueDate){const i=s.dueDate.localeCompare(a.dueDate);if(i!==0)return i}else{if(s.dueDate&&!a.dueDate)return-1;if(!s.dueDate&&a.dueDate)return 1}return n[s.priority]-n[a.priority]})}function Xl(e,t,n,s,a,i,o){const l=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const h=u.currentTarget,f=h.querySelector(".ws-task-edit-input"),m=h.querySelector(".ws-task-date-input"),w=f.value.trim();w&&(i?.(e.id,{title:w,dueDate:m.value||null}),a?.(null))}}
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
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${ip(e.priority)}>${op(e.priority)}</span>
      ${e.dueDate?r`<span class=${lp(e.dueDate)}>${rp(e.dueDate)}</span>`:p}
      ${!l&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!l&&e.queueStatus?.status==="review"&&n?r`<button
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
              `:!l&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:p}
    </div>
  `}function Ni(e,t,n,s,a,i,o){const l=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const h=u.currentTarget,f=h.querySelector(".ws-task-edit-input"),m=h.querySelector(".ws-task-date-input"),w=f.value.trim();w&&(i?.(e.id,{title:w,dueDate:m.value||null}),a?.(null))}}
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
      ${e.project?r`<span class="ws-task-project">${e.project}</span>`:p}
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${ip(e.priority)}>${op(e.priority)}</span>
      ${e.dueDate?r`<span class=${lp(e.dueDate)}>${rp(e.dueDate)}</span>`:p}
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
                    >View Output</button>`:p}
                ${n?r`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:p}
              `:!l&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:p}
    </div>
  `}function Yk(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function Zl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function ec(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function cp(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,a)=>{if(a.type==="file")(a.name.toLowerCase().includes(n)||a.path.toLowerCase().includes(n))&&s.push(a);else{const i=cp(e,a.children??[]);i.length>0&&s.push({...a,children:i})}return s},[])}function dp(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=dp(n.children));return t}const Jk=10;function Xk(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const n=t.match(/#+ (.+?)(?:\s#|$)/);return n?n[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function Zk(e,t=Jk){return[...e].sort((n,s)=>s.modified.getTime()-n.modified.getTime()).slice(0,t)}function up(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return r`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Ho(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?r`<span class="ws-list-meta">${ap(e.size)}</span>`:p}
          ${e.modified?r`<span class="ws-list-meta">${K(e.modified.getTime())}</span>`:p}
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
          `:p}
    </div>
  `}function e0(e,t,n){return r`
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
          >&times;</button>`:p}
    </div>
  `}function ai(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${Ho(n.type)}</span>
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
  `}function t0(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e,o=Xk(n);return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${Ho(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${K(n.modified.getTime())}</span>
        ${o?r`<span class="ws-list-desc">${o}</span>`:p}
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>i?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function n0(e,t){return r`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>r`
          ${s>0?r`<span class="breadcrumb-sep">/</span>`:p}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function s0(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:a,onBrowseFolder:i,onBrowseSearch:o,onBrowseBack:l,onCreateFolder:d,onItemClick:u}=e,h=a??t??[];return r`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>l?.()}>
          &larr; Back
        </button>
        ${n?n0(n,f=>i?.(f)):p}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${f=>{const m=f.target;o?.(m.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const f=prompt("New folder name:");if(f?.trim()){const m=n?.[n.length-1]?.path??".";d?.(`${m}/${f.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${h.length===0?r`<div class="workspace-browse-empty">No files found</div>`:h.map(f=>r`
              <button
                class="workspace-browse-entry"
                @click=${()=>{f.type==="folder"?i?.(f.path):u&&u({path:f.path,name:f.name,type:f.fileType??"text",size:f.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${f.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${f.name}</span>
                ${f.excerpt?r`<span class="browse-entry-excerpt">${f.excerpt}</span>`:p}
              </button>
            `)}
      </div>
    </div>
  `}function a0(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:a=!1,onItemSearch:i,onBack:o,onItemClick:l,onSessionClick:d,onPinToggle:u,onPinSessionToggle:h,onToggleFolder:f,onToggleTaskComplete:m,onCreateTask:w,onToggleCompletedTasks:$,onStartTask:c,editingTaskId:g,onEditTask:k,onUpdateTask:A,onBatchPushToDrive:T}=e,x=Zl(n,t.pinned).toSorted((B,Fe)=>Fe.modified.getTime()-B.modified.getTime()),_=ec(n,t.pinnedSessions),P=Zl(n,t.outputs).filter(B=>!t.pinned.some(Fe=>Fe.path===B.path)),E=(t.folderTree?.length??0)>0,Z=E?cp(n,t.folderTree):[],Y=ec(n,t.sessions),I=new Set(t.pinnedSessions.map(B=>B.key)),M=new Set(t.pinned.map(B=>B.path)),N=n.trim().length>0,U=x.length>0||_.length>0,O=Y.length>0||t.sessions.length===0||N,ie=Zk(t.outputs),ke=ie.length>0&&!N,J={expandedFolders:s,pinnedPaths:M,workspaceId:t.id,onToggleFolder:f,onItemClick:l,onPinToggle:u};return r`
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
        ${e.browsePath!=null?s0(e):p}

        ${U?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${x.length+_.length}</span>
                  </div>
                  <div class="ws-list">
                    ${_.map(B=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>d?.(B)}>
                            <span class=${Jl(B.status)}></span>
                            <span class="ws-list-title">${B.title}</span>
                            <span class="ws-list-meta">${K(B.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>h?.(t.id,B.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${x.map(B=>ai({workspaceId:t.id,entry:B,pinned:!0,onOpen:l,onPinToggle:u}))}
                  </div>
                </section>
              `:p}

        ${i0({tasks:t.tasks??[],workspaceName:t.name,showCompleted:a,onToggleTaskComplete:m,onCreateTask:w,onToggleCompletedTasks:$,onStartTask:c,editingTaskId:g,onEditTask:k,onUpdateTask:A})}

        ${ke?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${ie.length}</span>
                </div>
                <div class="ws-list">
                  ${ie.map(B=>t0({workspaceId:t.id,entry:B,pinned:M.has(B.path),onOpen:l,onPinToggle:u}))}
                </div>
              </section>
            `:p}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${E?Z.length:P.length}</span>
            ${T&&P.length>0?r`<button class="ws-export-drive-btn" @click=${()=>{const B=P.map(Fe=>Fe.path);T(B)}}>Export to Drive</button>`:p}
          </div>
          <div class="ws-list ws-list--scroll">
            ${E?Z.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:Z.map(B=>up(B,0,J)):P.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:P.map(B=>ai({workspaceId:t.id,entry:B,pinned:!1,onOpen:l,onPinToggle:u}))}
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
                                <button class="ws-list-main ws-list-row--button" @click=${()=>d?.(B)}>
                                  <span class=${Jl(B.status)}></span>
                                  <span class="ws-list-title">${B.title}</span>
                                  <span class="ws-list-meta">${K(B.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${I.has(B.key)?"active":""}"
                                  @click=${()=>h?.(t.id,B.key,I.has(B.key))}
                                  title=${I.has(B.key)?"Unpin":"Pin"}
                                >
                                  ${I.has(B.key)?"Unpin":"Pin"}
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
                  ${t.memory.map(B=>ai({workspaceId:t.id,entry:B,pinned:M.has(B.path),onOpen:l,onPinToggle:u}))}
                </div>
              </section>
            `:p}
      </div>
    </div>
  `}function i0(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:a,onCreateTask:i,onToggleCompletedTasks:o,onStartTask:l,editingTaskId:d,onEditTask:u,onUpdateTask:h}=e,f=Ys(t.filter(w=>w.status==="pending")),m=Ys(t.filter(w=>w.status==="complete"));return r`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${f.length} open${m.length>0?`, ${m.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${f.length===0&&m.length===0?r`<div class="ws-empty">No tasks</div>`:p}
        ${f.map(w=>Xl(w,a,l,d,u,h))}
        ${m.length>0?r`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${m.length} completed
              </button>
              ${s?m.map(w=>Xl(w,a,l,d,u,h)):p}
            `:p}
      </div>
      ${i?r`
            <form
              class="ws-task-create-form"
              @submit=${w=>{w.preventDefault();const c=w.currentTarget.querySelector("input"),g=c.value.trim();g&&(i(g,n),c.value="")}}
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
  `}function o0(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:a,itemSearchQuery:i,expandedFolders:o,loading:l,createLoading:d,error:u,allTasks:h=[],taskFilter:f="outstanding",taskSort:m="due",taskSearch:w="",showCompletedTasks:$=!1,editingTaskId:c,workspaceNames:g=[],onSearch:k,onItemSearch:A,onSelectWorkspace:T,onBack:x,onItemClick:_,onSessionClick:P,onPinToggle:E,onPinSessionToggle:Z,onCreateWorkspace:Y,onDeleteWorkspace:I,onToggleFolder:M,onTeamSetup:N,onToggleTaskComplete:U,onCreateTask:O,onSetTaskFilter:ie,onSetTaskSort:ke,onSetTaskSearch:J,onToggleCompletedTasks:B,onStartTask:Fe,onEditTask:mn,onUpdateTask:X}=e,qt=n.filter(V=>Yk(a,`${V.name} ${V.path} ${V.type}`));return s?a0({workspace:s,itemSearchQuery:i??"",expandedFolders:o,showCompletedTasks:$,onItemSearch:A,onBack:x,onItemClick:_,onSessionClick:P,onPinToggle:E,onPinSessionToggle:Z,onToggleFolder:M,onToggleTaskComplete:U,onCreateTask:O,onToggleCompletedTasks:B,onStartTask:Fe,editingTaskId:c,onEditTask:mn,onUpdateTask:X,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):r`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async V=>{if(V.preventDefault(),d||!Y)return;const vn=V.currentTarget,H=new FormData(vn),it=H.get("name"),jt=(typeof it=="string"?it:"").trim();if(!jt)return;const Ve=H.get("type"),Vt=(typeof Ve=="string"?Ve:"project").trim().toLowerCase(),yn=Vt==="team"||Vt==="personal"?Vt:"project",bn=H.get("path"),wn=(typeof bn=="string"?bn:"").trim();await Y({name:jt,type:yn,...wn?{path:wn}:{}})!==!1&&vn.reset()}}
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
            .value=${a}
            @input=${V=>k?.(V.target.value)}
          />
          <span class="workspaces-count">${qt.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${N?r`<button class="ws-team-setup-btn" @click=${()=>N()}>Team Setup</button>`:p}
      </div>

      ${u?r`<div class="callout danger" style="margin: 16px;">${u}</div>`:p}

      ${l?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${qt.length===0?r`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?r`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:p}
                          </div>
                        `:qt.map(V=>e0(V,T,I))}
                </div>

                ${r0({tasks:h,taskFilter:f,taskSort:m,taskSearch:w,onToggleTaskComplete:U,onSetTaskFilter:ie,onSetTaskSort:ke,onSetTaskSearch:J,onCreateTask:O,workspaceNames:g,onStartTask:Fe,editingTaskId:c,onEditTask:mn,onUpdateTask:X})}
              </div>
            `}
    </div>
  `}function r0(e){const{tasks:t,taskFilter:n,taskSort:s="due",taskSearch:a="",onToggleTaskComplete:i,onSetTaskFilter:o,onSetTaskSort:l,onSetTaskSearch:d,onCreateTask:u,workspaceNames:h=[],onStartTask:f,editingTaskId:m,onEditTask:w,onUpdateTask:$}=e;if(t.length===0&&!u)return r``;let c;if(n==="outstanding")c=t.filter(k=>k.status==="pending");else if(n==="today"){const k=ce();c=t.filter(A=>A.status==="pending"&&A.dueDate!=null&&A.dueDate<=k)}else n==="complete"?c=t.filter(k=>k.status==="complete"):c=t;if(a){const k=a.toLowerCase();c=c.filter(A=>A.title.toLowerCase().includes(k)||A.project?.toLowerCase().includes(k))}const g=Ys(c,s);return r`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${d?r`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${a}
                  @input=${k=>d(k.target.value)}
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
              @change=${k=>l?.(k.target.value)}
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
                @submit=${k=>{k.preventDefault();const A=k.currentTarget,T=A.querySelector(".ws-task-create-input"),x=A.querySelector(".ws-task-create-project"),_=T.value.trim();if(!_)return;const P=x?.value||h[0]||"";u(_,P),T.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${h.length>0?r`
                      <select class="ws-task-create-project">
                        ${h.map(k=>r`<option value=${k}>${k}</option>`)}
                      </select>
                    `:p}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:p}
        <div class="ws-list ws-list--scroll">
          ${g.length===0?r`<div class="ws-empty">No tasks</div>`:g.map(k=>Ni(k,i,f,m,w,$))}
        </div>
      </section>
    </div>
  `}function l0(e){return e===ce()}function c0(e){const t=new Date(e+"T12:00:00");return d0(t)}function d0(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],a=n[e.getMonth()],i=e.getDate();return`${s}, ${a} ${i}`}function u0(e){return r`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),a=s.value.trim();a&&(e(a),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function p0(e){const t=Ys(e.todayTasks??[],"due"),n=t.filter(a=>a.status==="pending"),s=t.filter(a=>a.status==="complete");return r`
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
              ${e.onCreateTask?u0(e.onCreateTask):p}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?r`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(a=>Ni(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${s.length>0?r`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?r`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(a=>Ni(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:p}
                  `:p}
            `}
      </div>
    </div>
  `}function h0(e){const t=ce(),n=e.selectedDate??t,s=l0(n),a=c0(n),i=e.viewMode??"brief";return r`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:p}
        <span class="today-date-label ${s?"":"past-date"}">${a}</span>
        ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:p}
        ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:p}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${i==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${i==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${i==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?r`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:p}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:p:e.onEveningCapture?r`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:p}
        ${e.onRefresh?r`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function f0(e){return r`
    <div class="my-day-brief-full">
      ${Qk({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onViewProof:t=>e.onInboxViewProof?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,n,s)=>e.onInboxScore?.(t,n,s),onSetScoring:(t,n)=>e.onInboxSetScoring?.(t,n),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function g0(e){const t=ce();e.selectedDate;const n=e.viewMode??"brief";if(e.loading)return r`
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
            ${qk(s)}
          </div>`:n==="tasks"?r`<div class="my-day-brief-full">${p0(e)}</div>`:f0(e)}
    </div>
  `}function m0(e){const t=k0(e),n=C0(e);return r`
    ${E0(n)}
    ${R0(t)}
    ${v0(e)}
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
              `:e.nodes.map(s=>U0(s))}
      </div>
    </section>
  `}function v0(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
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
              ${n.map(a=>y0(a,e))}
            `:p}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(a=>b0(a,e))}
            `:p}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:p}
      </div>
    </section>
  `}function y0(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?K(e.ts):"n/a",a=e.role?.trim()?`role: ${e.role}`:"role: -",i=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
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
  `}function b0(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",a=`roles: ${di(e.roles)}`,i=`scopes: ${di(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
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
                ${o.map(l=>w0(e.deviceId,l,t))}
              </div>
            `}
      </div>
    </div>
  `}function w0(e,t,n){const s=t.revokedAtMs?"revoked":"active",a=`scopes: ${di(t.scopes)}`,i=K(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${a} · ${i}</div>
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
  `}const ht="__defaults__",tc=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],$0=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function k0(e){const t=e.configForm,n=F0(e.nodes),{defaultBinding:s,agents:a}=B0(t),i=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:i,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:a,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function nc(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function S0(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function A0(e){const t=e?.defaults??{};return{security:nc(t.security),ask:S0(t.ask),askFallback:nc(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function x0(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(a=>{if(!a||typeof a!="object")return;const i=a,o=typeof i.id=="string"?i.id.trim():"";if(!o)return;const l=typeof i.name=="string"?i.name.trim():void 0,d=i.default===!0;s.push({id:o,name:l||void 0,isDefault:d})}),s}function T0(e,t){const n=x0(e),s=Object.keys(t?.agents??{}),a=new Map;n.forEach(o=>a.set(o.id,o)),s.forEach(o=>{a.has(o)||a.set(o,{id:o})});const i=Array.from(a.values());return i.length===0&&i.push({id:"main",isDefault:!0}),i.sort((o,l)=>{if(o.isDefault&&!l.isDefault)return-1;if(!o.isDefault&&l.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,u=l.name?.trim()?l.name:l.id;return d.localeCompare(u)}),i}function _0(e,t){return e===ht?ht:e&&t.some(n=>n.id===e)?e:ht}function C0(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=A0(t),a=T0(e.configForm,t),i=N0(e.nodes),o=e.execApprovalsTarget;let l=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&l&&!i.some(f=>f.id===l)&&(l=null);const d=_0(e.execApprovalsSelectedAgent,a),u=d!==ht?(t?.agents??{})[d]??null:null,h=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:d,selectedAgent:u,agents:a,allowlist:h,target:o,targetNodeId:l,targetNodes:i,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function R0(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
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
                  ${t?p:r`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?r`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>O0(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function E0(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
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

      ${P0(e)}

      ${t?r`
            ${L0(e)}
            ${I0(e)}
            ${e.selectedScope===ht?p:D0(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function P0(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
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
              `:p}
        </div>
      </div>
      ${e.target==="node"&&!t?r`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:p}
    </div>
  `}function L0(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===ht?"active":""}"
          @click=${()=>e.onSelectScope(ht)}
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
  `}function I0(e){const t=e.selectedScope===ht,n=e.defaults,s=e.selectedAgent??{},a=t?["defaults"]:["agents",e.selectedScope],i=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,l=typeof s.askFallback=="string"?s.askFallback:void 0,d=t?n.security:i??"__default__",u=t?n.ask:o??"__default__",h=t?n.askFallback:l??"__default__",f=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,m=f??n.autoAllowSkills,w=f==null;return r`
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
              @change=${$=>{const g=$.target.value;!t&&g==="__default__"?e.onRemove([...a,"security"]):e.onPatch([...a,"security"],g)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${tc.map($=>r`<option
                    value=${$.value}
                    ?selected=${d===$.value}
                  >
                    ${$.label}
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
              @change=${$=>{const g=$.target.value;!t&&g==="__default__"?e.onRemove([...a,"ask"]):e.onPatch([...a,"ask"],g)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${$0.map($=>r`<option
                    value=${$.value}
                    ?selected=${u===$.value}
                  >
                    ${$.label}
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
              @change=${$=>{const g=$.target.value;!t&&g==="__default__"?e.onRemove([...a,"askFallback"]):e.onPatch([...a,"askFallback"],g)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${h==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${tc.map($=>r`<option
                    value=${$.value}
                    ?selected=${h===$.value}
                  >
                    ${$.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":w?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${m?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${m}
              @change=${$=>{const c=$.target;e.onPatch([...a,"autoAllowSkills"],c.checked)}}
            />
          </label>
          ${!t&&!w?r`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...a,"autoAllowSkills"])}
              >
                Use default
              </button>`:p}
        </div>
      </div>
    </div>
  `}function D0(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
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
            `:n.map((s,a)=>M0(e,s,a))}
    </div>
  `}function M0(e,t,n){const s=t.lastUsedAt?K(t.lastUsedAt):"never",a=t.lastUsedCommand?Xn(t.lastUsedCommand,120):null,i=t.lastResolvedPath?Xn(t.lastResolvedPath,120):null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${a?r`<div class="list-sub mono">${a}</div>`:p}
        ${i?r`<div class="list-sub mono">${i}</div>`:p}
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
  `}function O0(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,a=t.nodes.length>0;return r`
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
  `}function F0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.run"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function N0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.execApprovals.get"||String(l)==="system.execApprovals.set"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function B0(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},a=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,i=e.agents??{},o=Array.isArray(i.list)?i.list:[];if(o.length===0)return{defaultBinding:a,agents:[t]};const l=[];return o.forEach((d,u)=>{if(!d||typeof d!="object")return;const h=d,f=typeof h.id=="string"?h.id.trim():"";if(!f)return;const m=typeof h.name=="string"?h.name.trim():void 0,w=h.default===!0,c=(h.tools??{}).exec??{},g=typeof c.node=="string"&&c.node.trim()?c.node.trim():null;l.push({id:f,name:m||void 0,index:u,isDefault:w,binding:g})}),l.length===0&&l.push(t),{defaultBinding:a,agents:l}}function U0(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),a=Array.isArray(e.caps)?e.caps:[],i=Array.isArray(e.commands)?e.commands:[];return r`
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
  `}function z0(e){const t=e.hello?.snapshot,n=t?.uptimeMs?Gi(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",a=(()=>{if(e.connected||!e.lastError)return null;const o=e.lastError.toLowerCase();if(!(o.includes("unauthorized")||o.includes("connect failed")))return null;const d=!!e.settings.token.trim(),u=!!e.password.trim();return!d&&!u?r`
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
        <div class="muted">Next wake ${ep(e.cronNext)}</div>
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
                        </button>`:p}
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">openclaw update</span>
                </div>
              </div>
            `:p}
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
                        </button>`:p}
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">curl -fsSL https://lifeongodmode.com/install.sh | sh</span>
                </div>
              </div>
            `:p}
        ${e.updateError?r`<div class="callout danger" style="margin-top: 14px;">
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
  `}const K0=["","off","minimal","low","medium","high"],W0=["","off","on"],q0=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],j0=["","off","on","stream"];function V0(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function pp(e){return V0(e)==="zai"}function H0(e){return pp(e)?W0:K0}function G0(e,t){return!t||!e||e==="off"?e:"on"}function Q0(e,t){return e?t&&e==="on"?"low":e:null}function Y0(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function J0(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function X0(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function Z0(e){return r`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function eS(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(i=>i.sessionKey)),s=t.filter(i=>!n.has(i.key)),a=e.archivedSessions.length;return r`
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
              `:s.map(i=>nS(i,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${tS(e,a)}
  `}function tS(e,t){return t===0&&!e.archivedSessionsLoading?p:r`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${Z0(e.archivedSessionsExpanded)}
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
                ${e.archivedSessionsLoading?r`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?r`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>sS(n,e.onUnarchive,e.loading))}
              </div>
            `:p}
    </section>
  `}function nS(e,t,n,s,a,i){const o=e.updatedAt?K(e.updatedAt):"n/a",l=e.thinkingLevel??"",d=pp(e.modelProvider),u=G0(l,d),h=H0(e.modelProvider),f=e.verboseLevel??"",m=e.reasoningLevel??"",w=e.displayName??e.key,$=e.kind!=="global",c=$?`${Hi("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${$?r`<a href=${c} class="session-link">${w}</a>`:w}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${g=>{const k=g.target.value.trim();n(e.key,{label:k||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${fk(e)}</div>
      <div>
        <select
          .value=${u}
          ?disabled=${i}
          @change=${g=>{const k=g.target.value;n(e.key,{thinkingLevel:Q0(k,d)})}}
        >
          ${h.map(g=>r`<option value=${g}>${g||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${f}
          ?disabled=${i}
          @change=${g=>{const k=g.target.value;n(e.key,{verboseLevel:k||null})}}
        >
          ${q0.map(g=>r`<option value=${g.value}>${g.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${m}
          ?disabled=${i}
          @change=${g=>{const k=g.target.value;n(e.key,{reasoningLevel:k||null})}}
        >
          ${j0.map(g=>r`<option value=${g}>${g||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${i}
          @click=${()=>a(e.key)}
          title="Archive this session"
        >
          ${J0()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function sS(e,t,n){const s=K(Date.parse(e.archivedAt));return r`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${Y0(e.reason)}</div>
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
          ${X0()}
        </button>
      </div>
    </div>
  `}function aS(e){return r`<div class="muted" style="padding: 16px;">ClawHub has been retired.</div>`}function iS(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return r`
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

      ${t?oS(e):p}
      ${e.subTab==="my-skills"?cS(e):p}
      ${e.subTab==="clawhub"?r`<div style="margin-top: 16px;">${aS(e.clawhub)}</div>`:p}
    </section>
  `}function oS(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return r`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return r`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const a=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],i=s?a.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):a;return r`
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
          ${i.map(o=>o._kind==="skill"?rS(o,e.expandedSkills.has(o.slug),e.onToggleExpand):lS(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function rS(e,t,n){const s=e.body.split(`
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
  `}function lS(e,t,n){return r`
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
  `}function cS(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(n)):t;return r`
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

    ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

    ${s.length===0?r`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:r`<div class="list" style="margin-top: 16px;">
            ${s.map(a=>dS(a,e))}
          </div>`}
  `}function dS(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",a=t.messages[e.skillKey]??null,i=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],l=[];return e.disabled&&l.push("disabled"),e.blockedByAllowlist&&l.push("blocked by allowlist"),r`
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
                `:p}
        </div>
        ${o.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:p}
        ${l.length>0?r`
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
          ${i?r`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:p}
        </div>
        ${a?r`<div
              class="muted"
              style="margin-top: 8px; color: ${a.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${a.message}
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
  `}function uS(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function pS(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(i=>[i.slug,i.name,i.category,i.mission??"",...i.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const i of n){const o=i.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(i)}const a=[...s.keys()].sort((i,o)=>i==="_default"?1:o==="_default"?-1:i.localeCompare(o));return r`
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

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

      ${e.loading&&e.roster.length===0?r`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:p}

      ${!e.loading&&n.length===0?r`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:p}

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
              ${o.map(d=>hS(d,e.expandedAgents.has(d.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function hp(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function hS(e,t,n){return r`
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
          ${e.engine?r`<span class="chip ${uS(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:p}
        </div>
        ${e.mission?r`<div class="list-sub" style="margin-left: 18px;">${Xn(e.mission,120)}</div>`:p}
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
  `}function fp(){return{open:!1,images:[],currentIndex:0}}function fS(e,t,n){return{open:!0,images:t,currentIndex:n}}function gS(){return fp()}function mS(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const vS=r`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,yS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,bS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function wS(e,t){if(!e.open||e.images.length===0)return p;const n=e.images[e.currentIndex];if(!n)return p;const s=e.images.length>1,a=e.currentIndex>0,i=e.currentIndex<e.images.length-1;return r`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&i&&t.onNav(1),o.key==="ArrowLeft"&&a&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${vS}
      </button>

      ${s&&a?r`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${yS}</button>`:p}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&i?r`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${bS}</button>`:p}

      ${s?r`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:p}
    </div>
  `}const $S=e=>{switch(e){case"success":return r`
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
      `}};function kS({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${ga(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${$S(n.type)}</div>
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
  `}const sc=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function SS(e,t){return r`
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
  `}function AS(e,t,n){const a=!!(t?.[e.key]??e.default);return r`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${SS(a,()=>n(e.key,!a))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function xS(e){const{connected:t,loading:n,options:s,onToggle:a,onOpenWizard:i}=e;return t?n&&!s?r`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:r`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${sc.map(o=>AS(o,s,a))}
      </div>
      ${sc.length===0?r`<div class="options-empty">
            No configurable features yet.
          </div>`:p}
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
          `:p}
    </section>
  `:r`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const ac=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],TS=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],_S=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],ii=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],ic=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function oc(e){const n=Math.min(Number(e),8);return r`
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
  `}function CS(e){if(e>=ic.length)return r`${p}`;const t=ic[e];return r`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function RS(e,t,n,s){return r`
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
  `}function gp(){return r`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function ES(e,t){function n(a){const i=a.target.value;t.onAnswerChange("name",i)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(1))}return r`
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
  `}function PS(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return r`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${ac.includes(n)?p:r`<option value="${n}">${n} (detected)</option>`}
        ${ac.map(s=>r`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${gp()}
    </div>
  `}function LS(e,t){function n(a){t.onAnswerChange("focus",a.target.value)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(3))}return r`
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
  `}function IS(e,t){function n(){const i=document.querySelector(".wizard-project-input");if(!i)return;const o=i.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),i.value="",i.focus())}function s(i){const o=e.projects.filter((l,d)=>d!==i);t.onAnswerChange("projects",o)}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return r`
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
      ${e.projects.length===0?r`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:p}
    </div>
  `}function DS(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${TS.map(n=>r`
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
  `}function MS(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(l=>l!==o)):t.onAnswerChange("hardRules",[...n,o])}function a(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const l=o.value.trim();l&&(t.onAnswerChange("hardRules",[...n,l]),o.value="",o.focus())}function i(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&a())}return r`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${ii.map(o=>r`
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
      ${n.filter(o=>!ii.includes(o)).length>0?r`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!ii.includes(o)).map(o=>r`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(l=>l!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:p}
    </div>
  `}function OS(e,t){function n(){const i=document.querySelector(".wizard-person-input");if(!i)return;const o=i.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),i.value="",i.focus())}function s(i){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,l)=>l!==i))}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return r`
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
  `}function FS(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${_S.map(n=>r`
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
  `}function oi(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function NS(e,t){const{answers:n,preview:s,diff:a,fileSelections:i,configSelections:o,generating:l}=e,d=s?.some(h=>h.exists)??!1,u=a&&(a.changes.length>0||a.additions.length>0);return r`
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
                ${n.projects.map(h=>r`<div class="wizard-review-item">${h}</div>`)}
              </div>
            `:p}

        ${n.keyPeople.length>0?r`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(h=>r`<div class="wizard-review-item">${h}</div>`)}
              </div>
            `:p}

        ${n.hardRules.length>0?r`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(h=>r`<div class="wizard-review-item">${h}</div>`)}
              </div>
            `:p}
      </div>

      ${s&&s.length>0?r`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${d?r`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:p}
              <div class="wizard-file-list">
                ${s.map(h=>{const f=i[h.path]??h.wouldCreate;return r`
                    <label class="wizard-file-item ${h.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${f}
                        @change=${m=>t.onFileToggle(h.path,m.target.checked)}
                      />
                      <span class="wizard-file-path">${h.path}</span>
                      <span class="wizard-file-status">${h.exists?f?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:p}

      ${u?r`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${a.additions.length>0?r`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${a.additions.map(h=>{const f=o[h.path]??!0;return r`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${f}
                              @change=${m=>t.onConfigToggle(h.path,m.target.checked)}
                            />
                            <span class="wizard-config-path">${h.path}</span>
                            <span class="wizard-config-value">${oi(h.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:p}

              ${a.changes.length>0?r`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${a.changes.map(h=>{const f=o[h.path]??!1;return r`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${f}
                              @change=${m=>t.onConfigToggle(h.path,m.target.checked)}
                            />
                            <span class="wizard-config-path">${h.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${oi(h.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${oi(h.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:p}

              ${a.matching.length>0?r`<p class="wizard-hint">${a.matching.length} settings already match GodMode's recommendations.</p>`:p}
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

      ${e.error?r`<div class="wizard-error">${e.error}</div>`:p}
    </div>
  `}function BS(e,t){const n=e.result;return n?r`
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
  `:r`${p}`}function mp(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function US(){return{step:0,answers:mp(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function vp(e,t){const{step:n,answers:s}=e;if(n===9)return r`
      <div class="wizard-fullscreen">
        ${BS(e,t)}
      </div>
    `;if(n===8)return r`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${oc(n)}
          ${NS(e,t)}
        </div>
      </div>
    `;const a=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),i=n===7,o=(()=>{switch(n){case 0:return ES(s,t);case 1:return PS(s,t);case 2:return LS(s,t);case 3:return IS(s,t);case 4:return DS(s,t);case 5:return MS(s,t);case 6:return OS(s,t);case 7:return FS(s,t);default:return r`${p}`}})();return r`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${oc(n)}
        ${CS(n)}
        ${o}
        ${RS(n,t,a,i)}
      </div>
    </div>
  `}const zS=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:mp,emptyWizardState:US,renderOnboardingWizard:vp},Symbol.toStringTag,{value:"Module"}));function gn(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function ds(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function KS(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function WS(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function qS(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function jS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function VS(e){const t=e.overallScore,n=gn(t);return r`
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
  `}function HS(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),a=gn(e??(t>0?t:null));return r`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${ds(a)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function GS(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",a=gn(e.trustScore??(e.avgRating>0?e.avgRating:null)),i=e.count<10?10-e.count:0;return r`
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
        <span class="trust-card-score ${ds(a)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${WS(e.trend)}">
          ${qS(e.trend)} ${KS(e.trend)}
        </span>
      </div>

      ${HS(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${i>0?r`<span class="trust-card-pending">${i} more until trust score</span>`:p}
        ${e.needsFeedback?r`<span class="trust-card-needs-feedback">Needs improvement</span>`:p}
      </div>

      ${e.recentFeedback.length>0?r`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>r`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:p}
    </div>
  `}function QS(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function YS(){const e=QS();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function JS(e){const t=gn(e.rating);return r`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${ds(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?r`<span class="trust-rating-note">${e.note}</span>`:p}
      <span class="trust-rating-time">${jS(e.timestamp)}</span>
    </div>
  `}function XS(){return r`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function ZS(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,a=e.data?.todayRating??null,i=e.updateStatus??null,o=i?.openclawUpdateAvailable||i?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const d=[];return i.openclawUpdateAvailable&&i.openclawLatest&&d.push(`OpenClaw ${i.openclawVersion} → ${i.openclawLatest}`),i.pluginUpdateAvailable&&i.pluginLatest&&d.push(`GodMode ${i.pluginVersion} → ${i.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:d.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const d=n.gates.filter(h=>h.enabled).length,u=n.gates.length;if(d<u)return{level:"warn",icon:"🛡",text:`${u-d} security gate${u-d!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const l=i&&!o?" Up to date.":"";return a?a.rating>=8?{level:"ok",icon:"✨",text:`Rated ${a.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${l}`}:a.rating>=5?{level:"ok",icon:"💪",text:`Rated ${a.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${l}`}:{level:"warn",icon:"💬",text:`Rated ${a.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${l}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${l} Rate your day below to help improve.`}}function e1(e){const{level:t,icon:n,text:s,detail:a}=ZS(e);return r`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${a}</div>
      </div>
    </div>
  `}function t1(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function rc(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return r`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return r`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),a=gn(n.rating);return r`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${a==="none"?"medium":a}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function n1(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],a=t?.dailyStreak??0,i=t?.dailyAverage??null;if(!e.onDailyRate)return p;if(n){const o=gn(n.rating),l=n.rating<7&&!n.note;return r`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${a>1?r`<span class="trust-daily-streak">${a} day streak</span>`:p}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${ds(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?r`<span class="trust-daily-result-note">"${n.note}"</span>`:p}
            ${i!==null?r`<span class="trust-daily-result-note">7-day avg: ${i}/10</span>`:p}
          </div>
          ${s.length>1?rc(s):p}
        </div>
        ${l?r`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${d=>{if(d.key==="Enter"){const u=d.target,h=u.value.trim();h&&e.onDailyRate&&(e.onDailyRate(n.rating,h),u.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${d=>{const h=d.target.previousElementSibling,f=h?.value?.trim();f&&e.onDailyRate&&(e.onDailyRate(n.rating,f),h.value="")}}
                >Send</button>
              </div>
            `:p}
      </div>
    `}return r`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${a>0?r`<span class="trust-daily-streak">${a} day streak</span>`:p}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="trust-daily-button ${t1(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?r`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${rc(s)}
              ${i!==null?r`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${i}/10</span>`:p}
            </div>
          `:p}
    </div>
  `}function s1(e){if(!e)return r`
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
    `;const t=e.gates,n=t.filter(h=>h.enabled).length,s=t.length,a=n===s,i=Date.now()-864e5,o=e.activity.filter(h=>Date.parse(h.timestamp)>i),l=o.filter(h=>h.action==="blocked").length,d=o.filter(h=>h.action==="fired").length,u=a?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${u}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(h=>r`
            <div class="trust-health-gate ${h.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${h.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${h.icon}</span>
              <span class="trust-health-gate-name">${h.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?r`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${l>0?r` &middot; <span class="trust-health-activity-count">${l}</span> blocked`:p}
              ${d>0?r` &middot; <span class="trust-health-activity-count">${d}</span> fired`:p}
            </div>
          `:r`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function a1(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function i1(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function o1(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,a=e.gatewayUptimeMs,l=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return r`
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
        <span class="trust-health-dot ${i1(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${a1(n)}</span>
      </div>

      ${s!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:p}

      ${a!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${Gi(a)}</span>
            </div>
          `:p}
    </div>
  `}function r1(e){return r`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${s1(e.guardrailsData)}
        ${o1(e)}
      </div>
    </div>
  `}function l1(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:a,onRefresh:i}=e;if(!t)return r`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const l=!(s?.summaries??[]).some(f=>f.count>0),d=l?YS():s,u=d.summaries,h=l?[]:s?.ratings??[];return r`
    <section class="tab-body trust-section">
      ${e1(e)}

      ${l?XS():p}

      ${n1(e)}

      ${VS(d)}

      <div class="trust-workflows-grid">
        ${u.map(f=>GS(f,l?null:a))}
      </div>

      ${r1(e)}

      ${h.length>0?r`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${h.slice(0,20).map(JS)}
              </div>
            </div>
          `:p}
    </section>
  `}function c1(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function d1(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function yp(e,t){return r`
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
  `}function u1(e,t,n,s){const a=e.thresholds?.[t]??0;return r`
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
  `}function p1(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return r`
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
              ${s.map(a=>u1(e,a,e.thresholdLabels[a],n))}
            </div>
          `:p}
    </div>
  `}function h1(e,t,n){const s=e.action==="redirect"?"↪":"🚫",a=e.action==="redirect"?"redirect":"block";return r`
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
  `}function f1(e){return r`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${d1(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${c1(e.timestamp)}</span>
    </div>
  `}function g1(e){const{connected:t,loading:n,data:s,onToggle:a,onThresholdChange:i,onCustomToggle:o,onCustomDelete:l,onToggleAddForm:d,onOpenAllyChat:u}=e;if(!t)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const h=s?.gates??[],f=s?.activity??[],m=s?.custom??[],w=h.filter(g=>g.enabled).length,$=m.filter(g=>g.enabled).length,c=[`${w}/${h.length} gates active`];return m.length>0&&c.push(`${$} custom rule${m.length===1?"":"s"}`),r`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${w}/${h.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${h.map(g=>p1(g,a,i))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${m.length>0?` (${$} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{u?u("Create a new guardrail rule: "):d()}}>+ Add Rule</button>
            </div>

            ${m.length>0?r`
                  <div class="guardrails-custom-grid">
                    ${m.map(g=>h1(g,o,l))}
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
                    ${f.slice(0,30).map(f1)}
                  </div>
                `:r`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}const m1={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};function bp(e){const t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function v1(e){switch(e){case"started":return"▶️";case"completed":return"✅";case"failed":return"❌";case"queued":return"⏳";case"stage":return"🔄";default:return"📋"}}function lc(e){switch(e){case"coding":return"mc-type-badge mc-type-badge--coding";case"subagent":return"mc-type-badge mc-type-badge--subagent";case"swarm":return"mc-type-badge mc-type-badge--swarm";case"queue":return"mc-type-badge mc-type-badge--queue";default:return"mc-type-badge"}}function cc(e){return`mc-agent-card mc-agent-card--${e}`}function y1(e){const t=[];return e.activeNow>0&&t.push(`${e.activeNow} agent${e.activeNow>1?"s":""} working`),e.queueReview>0&&t.push(`${e.queueReview} need${e.queueReview>1?"":"s"} your attention`),e.completedToday>0&&t.push(`${e.completedToday} done today`),t.length===0&&(t.push("Nothing running"),e.completedToday>0&&t.push(`${e.completedToday} completed today`)),r`
    <div class="mc-status-line">
      ${e.activeNow>0?r`<span class="mc-active-dot"></span>`:p}
      <span>${t.join(" · ")}</span>
    </div>
  `}function b1(e){return r`
    <div class="mc-stats-banner">
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${e.activeNow}
          ${e.activeNow>0?r`<span class="mc-active-dot"></span>`:p}
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
          ${e.queueReview>0?r`<span class="mc-active-dot" style="background:#14b8a6"></span>`:p}
        </div>
        <div class="mc-stat-label">Queue${e.queueReview>0?` (${e.queueReview} review)`:""}</div>
      </div>
    </div>
  `}function w1(e){return e.swarmStages?r`
    <div class="mc-pipeline">
      ${["design","build","qc"].map((n,s)=>{const i=e.swarmStages?.[n]?.status??"pending";return r`
          ${s>0?r`<span class="mc-pipeline-arrow">\u2192</span>`:p}
          <span class="mc-pipeline-stage mc-pipeline-stage--${i}">
            ${n}
          </span>
        `})}
    </div>
  `:p}const ri=new Set;function wp(e,t,n=!1){const s=e.startedAt?Ao(e.startedAt,e.endedAt??void 0):null,a=e.childSessionKey&&t.onOpenSession?r`<button class="mc-open-session-btn" @click=${i=>{i.stopPropagation(),t.onOpenSession(e.childSessionKey)}}>Open</button>`:e.sourceTaskId&&t.onOpenTaskSession?r`<button class="mc-open-session-btn" @click=${i=>{i.stopPropagation(),t.onOpenTaskSession(e.sourceTaskId)}}>Open Task</button>`:p;return n&&!ri.has(e.id)?r`
      <div class="${cc(e.status)} mc-agent-card--compact"
           @click=${()=>{ri.add(e.id)}}>
        <div class="mc-agent-card-header">
          <div class="mc-agent-card-info">
            <span class="${lc(e.type)}">${e.roleName}</span>
            <span class="mc-agent-card-task">${e.task}</span>
          </div>
          ${s?r`<span class="mc-agent-card-duration">${s}</span>`:p}
          ${a}
        </div>
      </div>
    `:r`
    <div class="${cc(e.status)}"
         ${n?r``:p}
         @click=${n?()=>{ri.delete(e.id)}:p}>
      <div class="mc-agent-card-header">
        <div class="mc-agent-card-info">
          <span class="${lc(e.type)}">${e.roleName}</span>
          <span class="mc-agent-card-task">${e.task}</span>
        </div>
        ${a}
        ${e.canCancel?r`<button class="mc-cancel-btn" @click=${i=>{i.stopPropagation(),t.onCancel(e.id)}}>Cancel</button>`:p}
        ${e.prUrl?r`<button class="mc-pr-btn" @click=${i=>{i.stopPropagation(),t.onViewDetail(e)}}>View PR</button>`:p}
      </div>
      <div class="mc-agent-card-meta">
        ${s?r`<span class="mc-agent-card-duration">${s}</span>`:p}
        ${e.model?r`<span class="mc-agent-card-model">${e.model}</span>`:p}
        ${e.branch?r`<span class="mc-agent-card-model">${e.branch}</span>`:p}
        ${e.error&&e.status!=="failed"?r`<span style="color: var(--danger, #ef4444)">${e.error}</span>`:p}
      </div>
      ${e.type==="swarm"?w1(e):p}
      ${e.status==="failed"?r`
        <div class="mc-agent-card-actions">
          <button class="mc-detail-btn" @click=${i=>{i.stopPropagation(),t.onViewDetail(e)}}>View Error</button>
          <button class="mc-retry-btn" @click=${i=>{i.stopPropagation(),t.onRetry(e.id)}}>Retry</button>
        </div>
      `:p}
    </div>
  `}function dc(e,t,n=!1){const s=e.filter(a=>a.status==="active"||a.status==="queued");return s.length===0?r`
      <div class="mc-empty">
        No active agents
        <div class="mc-empty-hint">Your agents will appear here. Drop tasks into the queue or ask your ally to spawn agents.</div>
      </div>
    `:r`
    <div class="mc-agents-grid">
      ${s.map(a=>wp(a,t,n))}
    </div>
  `}function $1(e,t,n,s,a){const i=e.filter(o=>o.isReview===!0);return i.length===0?p:r`
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
              ${o.sourceTaskId&&s?r`<button class="mc-open-session-btn" @click=${()=>s(o.sourceTaskId)}>Open Session</button>`:p}
              ${a?r`<button class="mc-detail-btn" @click=${()=>a(o.id)}>Files</button>`:p}
              <button class="mc-approve-btn" @click=${()=>t(o.id)}>Done</button>
              <button class="mc-detail-btn" @click=${()=>n(o)}>View Output</button>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function k1(e,t){const n=e.filter(s=>s.status==="pending");return n.length===0?p:r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Queued (${n.length})</h3>
      <div class="mc-agents-grid">
        ${n.map(s=>r`
          <div class="mc-agent-card mc-agent-card--queued">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${m1[s.type]??s.type}</span>
                <span class="mc-agent-card-task">${s.title}</span>
              </div>
              ${t?r`<button class="mc-open-session-btn" @click=${()=>t(s.id)}>Start</button>`:p}
              <span class="mc-priority-badge mc-priority-badge--${s.priority}">${s.priority}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function S1(e,t,n){const s=e.filter(a=>a.isReview===!0||a.status==="failed");return s.length===0?r`
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
  `}function A1(e){const t=e.filter(n=>n.status==="pending");return t.length===0?p:r`<div class="mc-queue-depth-text">${t.length} more queued</div>`}function x1(e,t="Ally"){return e?r`
    <div class="mc-idle-cta">
      <p>${t} is idle.</p>
      <button class="mc-open-session-btn" @click=${e}>Ask ${t} what to work on</button>
    </div>
  `:p}function T1(e,t){const n=(e.type==="failed"||e.type==="completed")&&e.agentRef;return r`
    <div class="mc-feed-item ${n?"mc-feed-item--clickable":""}"
         @click=${n?()=>t?.(e.agentRef):p}>
      <span class="mc-feed-time">${bp(e.timestamp)}</span>
      <span class="mc-feed-icon">${v1(e.type)}</span>
      <span class="mc-feed-text">${e.summary}</span>
      ${e.prUrl&&!n?r`<a class="mc-feed-link" href="${e.prUrl}" target="_blank">View PR</a>`:p}
    </div>
  `}let li=!0;function uc(e,t,n,s=!1){if(e.length===0)return p;if(s&&li)return r`
      <div class="mc-feed">
        <div class="mc-collapsible-header" @click=${()=>{li=!1}}>
          <span class="mc-collapsible-chevron">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${e.length})</h3>
        </div>
      </div>
    `;const a=e.slice(0,20),i=e.length>20;return r`
    <div class="mc-feed">
      ${s?r`
        <div class="mc-collapsible-header" @click=${()=>{li=!0}}>
          <span class="mc-collapsible-chevron mc-collapsible-chevron--open">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${e.length})</h3>
        </div>
      `:r`
        <h3 class="mc-section-title">Activity Feed</h3>
      `}
      <div class="mc-feed-list">
        ${a.map(o=>T1(o,n))}
      </div>
      ${i?r`<button class="mc-show-more-btn" @click=${()=>{}}>Show all ${e.length} events</button>`:p}
    </div>
  `}function _1(e,t){const s=e.filter(i=>i.status==="done"||i.status==="failed").filter(i=>!i.isReview);if(s.length===0)return p;const a=s.slice(0,10);return r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Recent Completed</h3>
      <div class="mc-agents-grid">
        ${a.map(i=>wp(i,t))}
      </div>
    </div>
  `}function $p(e){return e.split(" ").map(t=>t[0]??"").join("").slice(0,2).toUpperCase()}function C1(e){switch(e){case"done":case"in_review":return"mc-swarm-node--done";case"in_progress":return"mc-swarm-node--active";case"failed":case"cancelled":return"mc-swarm-node--failed";default:return"mc-swarm-node--pending"}}function R1(e,t,n){return e.length<=1?p:r`
    <div class="mc-swarm-switcher">
      ${e.map(s=>r`
        <button
          class="mc-swarm-switcher-btn ${s.projectId===t?"mc-swarm-switcher-btn--active":""}"
          @click=${()=>n?.(s.projectId)}>
          <span class="mc-swarm-switcher-title">${s.title}</span>
          <span class="mc-swarm-switcher-meta">${s.completedCount}/${s.issueCount}</span>
        </button>
      `)}
    </div>
  `}function E1(e){switch(e){case"in_progress":case"processing":return"🔄";case"done":case"in_review":return"✅";case"failed":case"cancelled":return"❌";case"todo":case"pending":return"⏳";default:return"○"}}function P1(e){switch(e){case"in_progress":return"Running";case"in_review":return"Review";case"done":return"Completed";case"failed":return"Failed";case"cancelled":return"Cancelled";case"todo":return"Queued";case"pending":return"Pending";default:return e.replace(/_/g," ")}}function L1(e,t,n,s){return!e.issues||e.issues.length===0?p:r`
    <div class="mc-swarm-org">
      <h3 class="mc-section-title">Pipeline</h3>
      <div class="mc-swarm-graph">
        ${e.issues.map((a,i)=>r`
          ${i>0?r`<div class="mc-swarm-connector"></div>`:p}
          <div class="mc-swarm-node ${C1(a.status)}"
               @click=${()=>{an===a.title?an=null:(an=a.title,e.projectId)}}>
            <div class="mc-swarm-node-avatar">${$p(a.personaName)}</div>
            <div class="mc-swarm-node-info">
              <div class="mc-swarm-node-persona">${a.personaName}</div>
              <div class="mc-swarm-node-task">${a.title}</div>
              <div class="mc-swarm-node-status">
                <span class="mc-swarm-status-icon">${E1(a.status)}</span>
                ${P1(a.status)}
              </div>
              ${a.cost?r`
                <div class="mc-swarm-node-cost">${((a.cost.inputTokens+a.cost.outputTokens)/1e3).toFixed(1)}k tok</div>
              `:p}
            </div>
            <div class="mc-swarm-node-actions">
              ${a.proofDocSlug&&n?r`
                <button class="mc-detail-btn" @click=${o=>{o.stopPropagation(),n(a.proofDocSlug)}}>Doc</button>
              `:p}
              ${a.queueItemId&&s?r`
                <button class="mc-detail-btn" @click=${o=>{o.stopPropagation(),s(a.queueItemId)}}>Logs</button>
              `:p}
            </div>
          </div>
          ${(a.status==="done"||a.status==="in_review")&&a.outputPreview?r`
            <div class="mc-swarm-output-preview">${a.outputPreview}</div>
          `:p}
          ${an===a.title?I1(e.projectId,a.title,t):p}
        `)}
      </div>
    </div>
  `}let an=null,lt="";function I1(e,t,n){return r`
    <div class="mc-steer-panel">
      <div class="mc-steer-label">Steer: ${t}</div>
      <div class="mc-steer-row">
        <input
          class="mc-steer-input"
          type="text"
          placeholder="Give feedback or instructions..."
          .value=${lt}
          @input=${s=>{lt=s.target.value}}
          @keydown=${s=>{s.key==="Enter"&&lt.trim()&&(n?.(e,t,lt.trim()),lt="",an=null)}}
        />
        <button class="mc-steer-send" @click=${()=>{lt.trim()&&(n?.(e,t,lt.trim()),lt="",an=null)}}>Send</button>
      </div>
    </div>
  `}function D1(e){return e.length===0?p:r`
    <div class="mc-swarm-agents">
      <h3 class="mc-section-title">Team</h3>
      <div class="mc-swarm-agents-grid">
        ${e.map(t=>{const n=t.startedAt?Ao(t.startedAt,t.endedAt??void 0):null,s=t.lastHeartbeat?Math.floor((Date.now()-t.lastHeartbeat)/1e3):null;return r`
            <div class="mc-swarm-agent-card mc-swarm-agent-card--${t.status}">
              <div class="mc-swarm-agent-header">
                <div class="mc-swarm-node-avatar">${$p(t.personaName)}</div>
                <div class="mc-swarm-agent-name">${t.personaName}</div>
                ${t.status==="working"?r`<span class="mc-active-dot"></span>`:p}
              </div>
              ${t.currentTask?r`
                <div class="mc-swarm-agent-task">${t.currentTask}</div>
              `:r`
                <div class="mc-swarm-agent-task mc-swarm-agent-task--idle">${t.status}</div>
              `}
              <div class="mc-swarm-agent-meta">
                ${n?r`<span>${n}</span>`:p}
                ${t.progress!=null?r`
                  <div class="mc-swarm-progress">
                    <div class="mc-swarm-progress-bar" style="width:${t.progress}%"></div>
                  </div>
                  <span>${t.progress}%</span>
                `:p}
                ${t.tokenSpend!=null?r`<span>${(t.tokenSpend/1e3).toFixed(1)}k tok</span>`:p}
                ${s!=null?r`<span class="mc-swarm-heartbeat">${s}s ago</span>`:p}
              </div>
            </div>
          `})}
      </div>
    </div>
  `}function M1(e){if(!e.tokenSpend&&!e.agents.some(n=>n.tokenSpend!=null))return p;const t=e.agents.reduce((n,s)=>n+(s.tokenSpend??0),0)||e.tokenSpend||0;return t===0?p:r`
    <div class="mc-swarm-budget">
      <h3 class="mc-section-title">Budget</h3>
      <div class="mc-swarm-budget-total">${(t/1e3).toFixed(1)}k tokens</div>
      ${e.agents.filter(n=>n.tokenSpend).map(n=>r`
        <div class="mc-swarm-budget-row">
          <span>${n.personaName}</span>
          <span>${((n.tokenSpend??0)/1e3).toFixed(1)}k</span>
        </div>
      `)}
    </div>
  `}function O1(e){switch(e){case"agent_started":return"▶️";case"agent_completed":return"✅";case"agent_failed":return"❌";case"handoff":return"🤝";case"steering":return"🎯";case"project_completed":return"🎉";case"project_failed":return"🚨";default:return"📋"}}function F1(e){return e.length===0?p:r`
    <div class="mc-feed">
      <h3 class="mc-section-title">Team Activity</h3>
      <div class="mc-feed-list">
        ${e.slice(0,30).map(t=>r`
          <div class="mc-feed-item">
            <span class="mc-feed-time">${bp(t.timestamp)}</span>
            <span class="mc-feed-icon">${O1(t.type)}</span>
            <span class="mc-feed-text">${t.summary}</span>
          </div>
        `)}
      </div>
    </div>
  `}function N1(e,t){const n=e.issues.filter(s=>(s.status==="done"||s.status==="in_review")&&s.proofDocSlug);return n.length===0?p:r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Deliverables (${n.length})</h3>
      <div class="mc-swarm-deliverables">
        ${n.map(s=>r`
          <div class="mc-swarm-deliverable">
            <div class="mc-swarm-deliverable-info">
              <span class="mc-swarm-deliverable-persona">${s.personaName}</span>
              <span class="mc-swarm-deliverable-title">${s.title}</span>
            </div>
            ${t?r`
              <button class="mc-detail-btn" @click=${()=>t(s.proofDocSlug)}>Review</button>
            `:p}
          </div>
        `)}
      </div>
    </div>
  `}function pc(e,t){if(!e.running||e.projects.length===0)return p;const n=e.projects.find(i=>i.projectId===e.selectedProjectId),s=n?n.title:e.projects.length===1?e.projects[0].title:`${e.projects.length} Team Projects`,a=n?`${n.completedCount}/${n.issueCount} tasks`:"";return r`
    <div class="mc-swarm-section">
      <div class="mc-swarm-header">
        <h2 class="mc-section-title" style="font-size:0.9375rem; margin:0">${s}</h2>
        ${a?r`<span class="mc-swarm-progress-text">${a}</span>`:p}
        ${e.running?r`<span class="mc-active-dot"></span>`:p}
      </div>

      ${R1(e.projects,e.selectedProjectId,t.onSelectSwarmProject)}

      ${e.detail?r`
        ${L1(e.detail,t.onSteerSwarmAgent,t.onViewProofDoc,t.onViewRunLog)}
        ${D1(e.detail.agents)}
        ${M1(e.detail)}
        ${N1(e.detail,t.onViewProofDoc)}
      `:p}

      ${F1(e.feed)}
    </div>
  `}function B1(e){if(!e.connected)return r`<div class="mc-section"><div class="mc-empty">Not connected to gateway.</div></div>`;if(e.loading&&!e.data)return r`<div class="mc-section"><div class="mc-loading">Loading agent data...</div></div>`;if(e.error&&!e.data)return r`
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

      ${e.fullControl?b1(t.stats):y1(t.stats)}

      ${e.fullControl?r`
        ${t.swarm?pc(t.swarm,e):p}
        <div class="mc-two-col">
          <div class="mc-col-main">
            <h3 class="mc-section-title">Active Agents</h3>
            ${dc(t.agents,n)}

            ${$1(t.agents,e.onApproveItem,e.onViewDetail,e.onOpenTaskSession,e.onViewTaskFiles)}

            ${k1(t.queueItems,e.onStartQueueItem)}

            ${uc(t.activityFeed,!1,e.onViewDetail)}
          </div>

          <div class="mc-col-side">
            ${_1(t.agents,n)}
          </div>
        </div>
      `:r`
        <div>
          ${t.swarm?pc(t.swarm,e):p}

          ${S1(t.agents,n,e.onApproveItem)}

          ${t.stats.activeNow>0||t.agents.some(s=>s.status==="active"||s.status==="queued")?r`
            <h3 class="mc-section-title">Active</h3>
            ${dc(t.agents,n,!0)}
          `:p}

          ${A1(t.queueItems)}

          ${t.stats.activeNow===0&&t.stats.queueDepth===0?x1(e.onAskAlly,e.allyName):p}

          ${uc(t.activityFeed,!1,e.onViewDetail,!0)}
        </div>
      `}
    </div>
  `}function U1(e,t){if(e?.label)return e.label;if(e?.displayName)return e.displayName;const n=De.get(t);if(n)return n;if(t.includes("webchat")){const a=t.match(/webchat[:-](\d+)/);return a?`Chat ${a[1]}`:"Chat"}if(t.includes("main"))return"MAIN";const s=t.split(/[:-]/);return s[s.length-1]||t}function z1(e){return e?e>=1e3?`${(e/1e3).toFixed(1)}k`:String(e):"0"}function K1(e){const t=e,n=String(t.role??"");if(n!=="user"&&n!=="assistant")return p;const s=typeof t.content=="string"?t.content:Array.isArray(t.content)?t.content.filter(i=>i.type==="text").map(i=>String(i.text??"")).join(" "):"";if(!s.trim())return p;const a=s.slice(0,300);return r`
    <div class="parallel-col__msg parallel-col__msg--${n}">
      <span class="parallel-col__msg-role">${n==="user"?"You":"AI"}</span>
      <span class="parallel-col__msg-text">${a}${s.length>300?"...":""}</span>
    </div>
  `}function W1(e){return r`
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
  `}function q1(e,t,n){const{state:s,onAssignLane:a,onSendInLane:i}=n,o=s.sessionsResult?.sessions??[],l=Me(o,t),d=l?.key??t,u=s.workingSessions.has(t)||s.workingSessions.has(d),h=U1(l,t),f=zs.get(t)??zs.get(d),m=l?.model??"",w=l?.totalTokens??0,$=s.settings.tabLastViewed[d]??s.settings.tabLastViewed[t]??0,c=l?.updatedAt??0,g=!u&&c>$,A=t===s.sessionKey?s.chatMessages:qe.get(t)??qe.get(d)??[],T=x=>{x instanceof HTMLElement&&x.dispatchEvent(new CustomEvent("lane-viewed",{detail:{sessionKey:d},bubbles:!0,composed:!0}))};return r`
    <div
      class="parallel-col parallel-col--filled ${u?"parallel-col--working":""} ${g?"parallel-col--ready":""}"
      @pointerdown=${x=>T(x.currentTarget)}
      @focusin=${x=>T(x.currentTarget)}
      @dragover=${x=>{x.preventDefault(),x.dataTransfer&&(x.dataTransfer.dropEffect="move"),x.currentTarget.classList.add("parallel-col--dragover")}}
      @dragleave=${x=>{x.currentTarget.classList.remove("parallel-col--dragover")}}
      @drop=${x=>{x.preventDefault(),x.currentTarget.classList.remove("parallel-col--dragover");const _=x.dataTransfer?.getData("text/lane-index");if(_!=null&&_!==""){const E=Number.parseInt(_,10);if(!Number.isNaN(E)){x.currentTarget.dispatchEvent(new CustomEvent("lane-reorder",{detail:{fromIndex:E,toIndex:e},bubbles:!0,composed:!0}));return}}const P=x.dataTransfer?.getData("text/session-key");P&&x.currentTarget.dispatchEvent(new CustomEvent("lane-drop",{detail:{laneIndex:e,sessionKey:P},bubbles:!0,composed:!0}))}}
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
          <span class="parallel-col__name">${h}</span>
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
          ${m?r`<span class="parallel-col__model">${m}</span>`:p}
          <span class="parallel-col__turns">${f!=null?`${f} turns`:"--"}</span>
          <span class="parallel-col__tokens">${z1(w)} tokens</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="parallel-col__messages">
        ${A.length>0?A.slice(-120).map(K1):r`<div class="parallel-col__empty">No messages yet</div>`}
      </div>

      <!-- Compose -->
      <div class="parallel-col__compose">
        <input
          type="text"
          class="parallel-col__input"
          draggable="false"
          placeholder="Message..."
          @keydown=${x=>{if(x.key==="Enter"&&!x.shiftKey){x.preventDefault();const _=x.target,P=_.value.trim();P&&(i(t,P),_.value="")}}}
        />
      </div>
    </div>
  `}function j1(e){const t=e.state.settings.parallelLanes;return r`
    <div
      class="parallel-columns"
      @lane-drop=${n=>{e.onAssignLane(n.detail.laneIndex,n.detail.sessionKey)}}
      @lane-reorder=${n=>{e.onReorderLanes(n.detail.fromIndex,n.detail.toIndex)}}
      @lane-viewed=${n=>{e.onLaneViewed(n.detail.sessionKey)}}
    >
      ${t.map((n,s)=>n?q1(s,n,e):W1(s))}
    </div>
  `}const V1=20;function kp(e){switch(e.split(".").pop()?.toLowerCase()){case"md":return"📝";case"html":return"🌐";case"json":case"yaml":case"yml":case"toml":return"⚙️";case"ts":case"js":case"py":case"sh":case"rs":case"go":return"💻";case"css":return"🎨";default:return"📄"}}function Sp(e,t=V1){const n=[];function s(a){for(const i of a){if(n.length>=t)return;const o=i;o.type==="file"?n.push(o):o.type==="directory"&&o.children&&s(o.children)}}return s(e),n}const H1=8;function G1(e){return Sp(e,500).filter(n=>n.modifiedAt!=null).sort((n,s)=>(s.modifiedAt??0)-(n.modifiedAt??0)).slice(0,H1)}function Ap(e){const n=Date.now()-e,s=Math.floor(n/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);if(a<24)return`${a}h ago`;const i=Math.floor(a/24);return i<30?`${i}d ago`:`${Math.floor(i/30)}mo ago`}function Q1(e,t){if(!e||e.length===0)return p;const n=G1(e);return n.length===0?p:r`
    <div class="work-section">
      <div class="work-section-label">Recent</div>
      <div class="work-file-list">
        ${n.map(s=>r`
          <button
            class="work-file-item"
            @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
          >
            <span class="work-file-icon">${kp(s.name)}</span>
            <span class="work-file-name">${s.name}</span>
            <span class="work-file-meta">${s.modifiedAt?Ap(s.modifiedAt):""}</span>
          </button>
        `)}
      </div>
    </div>
  `}function Y1(e,t){if(!e||e.length===0)return p;const n=Sp(e);return n.length===0?p:r`
    <div class="work-file-list">
      ${n.map(s=>r`
        <button
          class="work-file-item"
          @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
        >
          <span class="work-file-icon">${kp(s.name)}</span>
          <span class="work-file-name">${s.name}</span>
          ${s.size!=null?r`<span class="work-file-meta">${(s.size/1024).toFixed(1)}KB</span>`:p}
        </button>
      `)}
      ${e.length>n.length?r`<div class="work-file-overflow">+${e.length-n.length} more files</div>`:p}
    </div>
  `}function J1(e,t,n,s,a,i,o,l){return r`
    <div class="my-day-card work-project ${t?"expanded":""}">
      <button class="my-day-card-header" @click=${a} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">${e.emoji}</span>
          <span>${e.name}</span>
          ${e.folder?r`<span class="work-folder-badge">${e.folder}</span>`:p}
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
                    `:p}
              ${n.length>0?Q1(n,o):p}
              ${n.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${Y1(n,o)}
                    </div>
                  `:e.outputs.length>0?r`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${X1(e.outputs)}
                      </div>
                    `:p}
              ${e.people.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${e.people.map(d=>r`
                            <button
                              class="work-person-chip"
                              @click=${u=>{u.stopPropagation(),i?.(d)}}
                            >
                              ${d}
                            </button>
                          `)}
                      </div>
                    </div>
                  `:p}
              ${e.skills.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Skills</div>
                      <div class="work-skills">
                        ${e.skills.map(d=>r`
                            <button
                              class="work-skill-chip"
                              @click=${u=>{u.stopPropagation(),l?.(d,e.name)}}
                            >
                              ${d}
                            </button>`)}
                      </div>
                    </div>
                  `:p}
              ${e.automations&&e.automations.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Automations</div>
                      <div class="work-skills">
                        ${e.automations.map(d=>r`<span class="work-skill-chip">${d}</span>`)}
                      </div>
                    </div>
                  `:p}
            </div>
          `:p}
    </div>
  `}function X1(e){const t=e.reduce((s,a)=>{const i=a.type||"other";return s[i]||(s[i]=[]),s[i].push(a),s},{}),n={document:"📄",template:"📋",report:"📊",presentation:"📽️",spreadsheet:"📈",code:"💻",image:"🖼️",video:"🎬",audio:"🎵",archive:"📦",pdf:"📕",markdown:"📝"};return r`
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
  `}const Z1={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"},e2=[{key:"all",label:"All"},{key:"pinned",label:"Pinned"},{key:"html_report",label:"Reports"},{key:"plan",label:"Plans"},{key:"code",label:"Code"},{key:"recent",label:"Recent"}];function t2(e,t){switch(t){case"pinned":return e.filter(n=>n.pinned);case"html_report":case"plan":case"code":return e.filter(n=>n.type===t);case"recent":{const n=Date.now()-6048e5;return e.filter(s=>new Date(s.createdAt).getTime()>n)}default:return e}}function n2(e,t,n,s){const a=Z1[e.type]||"📄",i=new Date(e.createdAt),o=Ap(i.getTime());return r`
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
  `}function s2(e){const{resources:t=[],resourcesLoading:n,resourceFilter:s="all",onResourceFilterChange:a,onResourceClick:i,onResourcePin:o,onResourceDelete:l}=e,d=t2(t,s);return d.sort((u,h)=>u.pinned!==h.pinned?u.pinned?-1:1:h.createdAt.localeCompare(u.createdAt)),r`
    <div class="work-workspaces-section">
      <h2 class="work-section-title">Resources</h2>

      <div class="resource-filter-strip">
        ${e2.map(u=>r`
            <button
              class="resource-filter-btn${s===u.key?" active":""}"
              @click=${()=>a?.(u.key)}
            >${u.label}</button>
          `)}
      </div>

      ${n?r`<div class="work-detail-loading">
            <div class="spinner" style="width: 16px; height: 16px"></div>
            Loading resources...
          </div>`:d.length===0?r`<div class="my-day-card">
              <div class="my-day-card-content">
                <div class="my-day-empty">
                  No resources yet. Resources are created automatically when the ally generates reports, plans, or docs.
                </div>
              </div>
            </div>`:r`<div class="resource-grid">
              ${d.map(u=>n2(u,i,o,l))}
            </div>`}
    </div>
  `}function a2(e){const{projects:t,loading:n,error:s,expandedProjects:a=new Set,projectFiles:i={},detailLoading:o=new Set,onRefresh:l,onToggleProject:d,onPersonClick:u,onFileClick:h,onSkillClick:f}=e;if(n)return r`
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
          ${l?r`<button class="retry-button" @click=${l}>Retry</button>`:p}
        </div>
      </div>
    `;const m=t.filter($=>$.status==="active"),w=t.filter($=>$.status==="archived");return r`
    <div class="my-day-container">
      <div class="my-day-toolbar">
        <div class="my-day-summary-stat">
          <span class="summary-value">${m.length}</span>
          <span class="summary-label">Projects</span>
        </div>
        ${l?r`<button class="my-day-refresh-btn" @click=${l} title="Refresh">↻</button>`:p}
      </div>

      <!-- Resources Section -->
      ${s2(e)}

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${m.length===0&&w.length===0?r`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `:p}
          ${m.map($=>J1($,a.has($.id),i[$.id]??[],o.has($.id),()=>d?.($.id),u,h,f))}
          ${w.length>0?r`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${w.length} archived project${w.length!==1?"s":""}
                </div>
              `:p}
        </div>
      </div>
    </div>
  `}function nt(e){if(!e)return"";try{return K(new Date(e).getTime())}catch{return""}}function fn(e){return r`<div class="second-brain-md-body">${Ae(be(e))}</div>`}function i2(e){const{identity:t}=e;return!t||t.files.length===0?r`
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
      `:p}

      ${t.files.map(n=>r`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.label}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${nt(n.updatedAt)}</span>`:p}
          </div>
          <div class="second-brain-card-content">${fn(n.content)}</div>
        </div>
      `)}

      ${t.identityOs&&t.identityOs.artifacts.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">Identity OS Artifacts</span>
            <span class="second-brain-section-count">${t.identityOs.artifacts.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.identityOs.artifacts.map(n=>Ps(n,e))}
          </div>
        </div>
      `:p}
    </div>
  `}function o2(e){const{memoryBank:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:o}=e;if(n)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${nt(n.updatedAt)}</span>`:p}
          </div>
          ${n.relativePath?r`<div class="second-brain-card-path">${n.relativePath}</div>`:p}
          <div class="second-brain-card-content">${fn(n.content)}</div>
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
            ${i.length>0?i.map(u=>Ps(u,e)):r`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!t)return ya("No memory bank files found","Start building your memory bank by telling your ally about the people, companies, and projects in your life.");const l=(s??"").toLowerCase().trim(),d=u=>l?u.filter(h=>h.name.toLowerCase().includes(l)||h.excerpt.toLowerCase().includes(l)):u;return r`
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

      ${t.sections.map(u=>{const h=d(u.entries);return u.entries.length===0?p:r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">${u.icon} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${h.length>0?h.map(f=>Ps(f,e)):l?r`<div class="second-brain-empty-inline">No matches</div>`:p}
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
            ${t.extraFiles.map(u=>Ps(u,e))}
          </div>
        </div>
      `:p}

      ${t.curated?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
            <span class="second-brain-section-count">${nt(t.curated.updatedAt)}</span>
          </div>
          <div class="second-brain-card">
            <div class="second-brain-card-content">${fn(t.curated.content)}</div>
          </div>
        </div>
      `:p}
    </div>
  `}function Ps(e,t){const n=e.isDirectory;return r`
    <div class="second-brain-entry" @click=${()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${n?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${n?"/":""}</div>
        ${e.excerpt?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${nt(e.updatedAt)}</div>`:p}
    </div>
  `}function r2(e){const{aiPacket:t,syncing:n}=e,s=t?.snapshot??t?.consciousness??null,a=t?.snapshot?"Awareness Snapshot":"CONSCIOUSNESS.md";return r`
    <div class="second-brain-panel">
      <div class="second-brain-sync-bar">
        <div class="second-brain-sync-info">
          <span class="second-brain-sync-label">Live Context Injection</span>
          <span class="second-brain-sync-time">
            ${s?.updatedAt?`Last synced ${nt(s.updatedAt)}`:"Not yet synced"}
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
          <div class="second-brain-card-content">${fn(s.content)}</div>
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
          <div class="second-brain-card-content">${fn(t.working.content)}</div>
        </div>
      `:p}
    </div>
  `}const hc={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function l2(e){const{sourcesData:t}=e;if(!t||t.sources.length===0)return ya("No sources detected","Connect data sources to build your context universe.");const n=t.sources.filter(a=>a.status==="connected"),s=t.sources.filter(a=>a.status==="available");return r`
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
            ${n.map(a=>fc(a))}
          </div>
        </div>
      `:p}

      ${s.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E1} Available</span>
            <span class="second-brain-section-count">${s.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${s.map(a=>fc(a))}
          </div>
        </div>
      `:p}
    </div>
  `}function fc(e){const t=hc[e.status]??hc.available;return r`
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
        ${e.status==="connected"&&e.lastSync?r`<span class="second-brain-source-sync">${nt(e.lastSync)}</span>`:p}
      </div>
    </div>
  `}function gc(e,t){const n=e.isDirectory,s=n?"📁":"📑",a=()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)},i=e.frontmatter?.title||e.name;return r`
    <div class="second-brain-entry" @click=${a}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${s}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${i}${n?"/":""}</div>
        ${e.frontmatter?.url?r`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:p}
        ${e.excerpt&&!n?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
        ${e.frontmatter?.tags?.length?r`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(o=>r`<span class="second-brain-research-tag">${o}</span>`)}
          </div>
        `:p}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${nt(e.updatedAt)}</div>`:p}
    </div>
  `}function c2(e){const{researchData:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:o}=e;if(n)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${nt(n.updatedAt)}</span>`:p}
          </div>
          ${n.relativePath?r`<div class="second-brain-card-path">${n.relativePath}</div>`:p}
          <div class="second-brain-card-content">${fn(n.content)}</div>
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
            ${i.length>0?i.map(u=>gc(u,e)):r`<div class="second-brain-empty-inline">No research in this category</div>`}
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
        ${ya("No research collected yet","Click 'Save via Chat' to paste links, bookmarks, or notes — your AI will organize them for you.")}
      </div>
    `;const l=(s??"").toLowerCase().trim(),d=u=>l?u.filter(h=>h.name.toLowerCase().includes(l)||h.excerpt.toLowerCase().includes(l)||(h.frontmatter?.tags??[]).some(f=>f.toLowerCase().includes(l))||(h.frontmatter?.url??"").toLowerCase().includes(l)):u;return r`
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

      ${t.categories.map(u=>{const h=d(u.entries);return u.entries.length===0?p:r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4C1} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${h.length>0?h.map(f=>gc(f,e)):l?r`<div class="second-brain-empty-inline">No matches</div>`:p}
            </div>
          </div>
        `})}
    </div>
  `}function d2(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function u2(e){return r`
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

      ${e.fileSearchResults?p2(e):e.fileTreeLoading?r`<div class="sb-files-loading">Loading file tree...</div>`:e.fileTree?xp(e.fileTree,e):r`<div class="sb-files-empty">No files found</div>`}
    </div>
  `}function p2(e){const t=e.fileSearchResults??[];return t.length===0?r`<div class="sb-files-empty">No results found</div>`:r`
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
              ${n.matchContext||n.excerpt?r`<span class="sb-file-excerpt">${n.matchContext??n.excerpt}</span>`:p}
            </div>
          </button>
        `)}
    </div>
  `}function xp(e,t,n=0){return r`
    <div class="sb-file-tree" style="padding-left: ${n*16}px">
      ${e.map(s=>s.type==="folder"?r`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${s.name}</span>
                ${s.childCount!=null?r`<span class="sb-tree-count">${s.childCount}</span>`:p}
              </summary>
              ${s.children?xp(s.children,t,n+1):p}
            </details>
          `:r`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>t.onFileSelect?.(s.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${s.name}</span>
            ${s.size!=null?r`<span class="sb-tree-size">${d2(s.size)}</span>`:p}
          </button>
        `)}
    </div>
  `}function ya(e,t){return r`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${t}</div>
    </div>
  `}function h2(e){if(!e)return p;if(!e.available)return r`
      <div class="vault-health-bar vault-health-disconnected">
        <span class="vault-health-status">\u26A0\uFE0F Vault not connected</span>
        <span class="vault-health-detail">Using local storage. Set OBSIDIAN_VAULT_PATH to connect your Obsidian vault.</span>
      </div>
    `;const t=e.stats;if(!t)return p;const n=t.lastActivity?nt(t.lastActivity):"never",s=t.inboxCount>0?r`<span class="vault-health-inbox-badge">${t.inboxCount} in inbox</span>`:p;return r`
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
  `}function f2(e){let t=0;const n=[];return e.identity&&e.identity.files.length>0?t+=20:n.push("Create USER.md to help your ally know you"),e.vaultHealth?.available??!1?t+=20:n.push("Connect your Obsidian vault for long-term memory"),e.memoryBank&&e.memoryBank.totalEntries>0?t+=20:n.push("Teach your ally — chat naturally and it remembers"),e.sourcesData&&e.sourcesData.connectedCount>0?t+=20:n.push("Connect a data source (calendar, Oura, etc.)"),e.vaultHealth?.stats&&e.vaultHealth.stats.dailyCount>=7?t+=20:n.push("Keep using the morning brief — it compounds"),{score:t,tips:n}}function g2(e){const{subtab:t,loading:n,vaultHealth:s}=e,a=f2(e);return r`
    <section class="second-brain-container">
      ${h2(s)}
      ${a.score<100?r`
        <div class="sb-health-score">
          <div class="sb-health-score-bar">
            <div class="sb-health-score-fill" style="width: ${a.score}%"></div>
          </div>
          <div class="sb-health-score-info">
            <span class="sb-health-score-label">Context Health: ${a.score}%</span>
            ${a.tips.length>0?r`<span class="sb-health-score-tip">${a.tips[0]}</span>`:p}
          </div>
        </div>
      `:p}
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

      ${t==="intel"?m2(e):n?r`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:t==="identity"?i2(e):t==="memory-bank"?o2(e):t==="ai-packet"?r2(e):t==="sources"?l2(e):t==="resources"?v2(e):t==="files"?u2(e):c2(e)}
    </section>
  `}function m2(e){const t=e.vaultHealth?.available??!1,n=(e.vaultHealth?.stats?.dailyCount??0)>=3,s=(e.sourcesData?.connectedCount??0)>0;return r`
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
  `}function v2(e){const{communityResources:t,communityResourceAddFormOpen:n}=e;return r`
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

      ${n?b2(e):p}

      ${!t||t.resources.length===0?ya("No community resources yet","Add GitHub repos, awesome-lists, and tools for your AI agents to discover and reference."):r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4E6} Bookmarked Resources</span>
              <span class="second-brain-section-count">${t.count}</span>
            </div>
            <div class="second-brain-entry-list">
              ${t.resources.map(s=>y2(s,e))}
            </div>
          </div>
        `}
    </div>
  `}function y2(e,t){return r`
    <div class="second-brain-entry">
      <div class="second-brain-entry-icon">\u{1F517}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">
          <a href=${e.url} target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
            ${e.label}
          </a>
        </div>
        ${e.description?r`<div class="second-brain-entry-excerpt">${e.description}</div>`:p}
        ${e.tags.length>0?r`<div class="second-brain-research-tags">
              ${e.tags.map(n=>r`<span class="second-brain-research-tag">${n}</span>`)}
            </div>`:p}
      </div>
      <button
        class="second-brain-back-btn"
        style="font-size: 11px; padding: 2px 8px; color: var(--danger, #ef4444);"
        @click=${n=>{n.stopPropagation(),t.onCommunityResourceRemove(e.id)}}
      >Remove</button>
    </div>
  `}function b2(e){const t=e.communityResourceAddForm??{url:"",label:"",description:"",tags:""};return r`
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
  `}const Bi={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},w2=[{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Tasks, calendar, priorities, and focus score",prompt:"Create a morning overview dashboard that shows my top priorities, today's calendar events, active queue items, and readiness score. Use clean CSS grid layout."},{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"What you accomplished this week",prompt:"Create a weekly impact dashboard showing tasks completed vs created this week, agent task outcomes, trust score changes, and top 3 wins. Use CSS bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue throughput, personas, and trust scores",prompt:"Create an agent activity dashboard showing queue stats (pending, processing, completed, failed), most active personas, cron skill execution log, and trust scores by workflow."},{id:"health-energy",name:"Health & Energy",category:"personal",description:"Sleep, readiness, and activity from Oura",prompt:"Create a health and energy dashboard showing last night's sleep score, 7-day sleep trend, today's readiness score, activity level, and HRV trend. Pull from Oura integration."},{id:"goals-tracker",name:"Goals Tracker",category:"personal",description:"Active goals with progress bars",prompt:"Create a goals tracker dashboard showing my active goals as cards with progress bars, grouped by area (health, career, finance, personal), with overall completion percentage."},{id:"content-performance",name:"Content Performance",category:"business",description:"Social posts and content pipeline",prompt:"Create a content performance dashboard showing recent content pieces, content pipeline status, engagement metrics from X intelligence, and a content calendar for the next 7 days."}];function $2(e){return e==="global"?r`<span class="dashboard-card-scope">Global</span>`:r`<span class="dashboard-card-scope">${e}</span>`}function Tp(e){return Date.now()-new Date(e).getTime()>1440*60*1e3}function _p(e){const t=(e.title+" "+(e.description??"")).toLowerCase();return t.includes("health")||t.includes("sleep")||t.includes("oura")||t.includes("energy")||t.includes("goal")?"personal":t.includes("agent")||t.includes("queue")||t.includes("trust")||t.includes("skill")?"system":t.includes("revenue")||t.includes("business")||t.includes("content")||t.includes("metric")?"business":t.includes("task")||t.includes("calendar")||t.includes("morning")||t.includes("impact")||t.includes("weekly")?"productivity":"custom"}function mc(e,t){const n=Bi[e.category]??Bi.custom;return r`
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
  `}function k2(e,t,n,s){const a=Tp(e.updatedAt);return r`
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
          ${$2(e.scope)}
          <span>${K(new Date(e.updatedAt).getTime())}</span>
          ${a?r`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:p}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${s?r`<button
              class="dashboard-card-pin"
              title="${e.pinned?"Unpin":"Pin"}"
              @click=${i=>{i.stopPropagation(),s(e.id)}}
            >${e.pinned?"📌":"📅"}</button>`:p}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${i=>{i.stopPropagation(),confirm(`Delete "${e.title}"?`)&&n(e.id)}}
        >&times;</button>
      </div>
    </div>
  `}function S2(e){const{activeDashboardHtml:t,activeDashboardManifest:n,isWorking:s}=e;if(!t||!n)return p;const a=Tp(n.updatedAt);return r`
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
            ${a?r` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:p}
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
          ${Ae(Tg(t))}
        </div>
      </div>
    </section>
  `}function A2(e,t,n){const s={all:t.length};for(const a of t){const i=_p(a);s[i]=(s[i]??0)+1}return r`
    <div class="dashboards-category-bar">
      ${Object.entries(Bi).map(([a,i])=>r`
        <button
          class="dashboards-category-btn ${e===a?"active":""}"
          @click=${()=>n(a)}
        >
          ${i.icon} ${i.label}
          ${s[a]?r`<span class="category-count">${s[a]}</span>`:p}
        </button>
      `)}
    </div>
  `}function x2(e){const{loading:t,dashboards:n}=e,s=e.categoryFilter??"all",a=e.templates??w2,o=[...s==="all"?n??[]:(n??[]).filter(u=>_p(u)===s)].sort((u,h)=>u.pinned&&!h.pinned?-1:!u.pinned&&h.pinned?1:new Date(h.updatedAt).getTime()-new Date(u.updatedAt).getTime()),l=s==="all"?a:a.filter(u=>u.category===s),d=(n??[]).length>0;return r`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(n??[]).length} dashboard${(n??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>e.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${d&&e.onCategoryFilter?A2(s,n??[],e.onCategoryFilter):p}

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
                  ${a.map(u=>mc(u,e.onCreateViaChat))}
                </div>
              </div>
            `:r`
              <div class="dashboards-grid">
                ${o.map(u=>k2(u,e.onSelectDashboard,e.onDeleteDashboard,e.onTogglePin))}
              </div>
              ${l.length>0?r`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${l.map(u=>mc(u,e.onCreateViaChat))}
                  </div>
                </div>
              `:p}
            `}
    </section>
  `}function T2(e){return e.error?r`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${e.error}</p>
          <button class="retry-button" @click=${()=>e.onRefresh()}>Retry</button>
        </div>
      </section>
    `:e.activeDashboardHtml&&e.activeDashboardManifest?S2(e):x2(e)}const _2={0:"Assessment",1:"Interview",2:"Second Brain",3:"Workflow Audit",4:"Configuration",5:"First Win",6:"Ready"},C2=[{id:"slack",name:"Slack",icon:"#",desc:"Team messaging"},{id:"google-calendar",name:"Google Calendar",icon:"Cal",desc:"Events & scheduling"},{id:"clickup",name:"ClickUp",icon:"CU",desc:"Project management"},{id:"github",name:"GitHub",icon:"GH",desc:"Code & repos"},{id:"obsidian",name:"Obsidian",icon:"Ob",desc:"Notes & knowledge"},{id:"notion",name:"Notion",icon:"N",desc:"Docs & wikis"},{id:"linear",name:"Linear",icon:"Li",desc:"Issue tracking"},{id:"apple-reminders",name:"Apple Reminders",icon:"AR",desc:"Tasks (macOS)"},{id:"email",name:"Email",icon:"@",desc:"Gmail / Outlook"},{id:"things-mac",name:"Things",icon:"Th",desc:"Task manager (macOS)"}];function R2(e){return r`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${[2,3,4,5].map(n=>r`
						<div
							class="onboarding-progress-step ${e>=n?"completed":""} ${e===n?"active":""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${_2[n]}</span>
						</div>
					`)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${(e-2)/4*100}%"></div>
		</div>
	`}function E2(e,t){return r`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${C2.map(n=>{const a=e.find(i=>i.id===n.id)?.status??"pending";return r`
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
	`}function P2(e){return e.length?r`
		<div class="onboarding-audit-overlay">
			<h3>GodMode Audit Results</h3>
			<div class="onboarding-audit-cards">
				${e.map(t=>r`
						<div class="onboarding-audit-card impact-${t.impact}">
							<div class="audit-problem">${t.problem}</div>
							${t.skill?r`<div class="audit-skill">Skill: ${t.skill}</div>`:p}
							${t.estimatedTimeSaved?r`<div class="audit-time">Saves ~${t.estimatedTimeSaved}</div>`:p}
							<div class="audit-impact">${t.impact} impact</div>
						</div>
					`)}
			</div>
		</div>
	`:r`${p}`}function L2(e){const t=e>=70?"#38a169":e>=40?"#d69e2e":"#e53e3e",n=e>=70?"Good":e>=40?"Needs Work":"Getting Started";return r`
		<div class="onboarding-health-gauge">
			<div class="health-score" style="color: ${t}">
				<span class="health-number">${e}</span>
				<span class="health-max">/100</span>
			</div>
			<div class="health-label" style="color: ${t}">${n}</div>
		</div>
	`}function I2(e){return r`
		<div class="onboarding-assessment">
			${L2(e.healthScore)}
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
	`}function D2(e,t){return r`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				${t?r`
						<p class="onboarding-subtitle">Here's where your setup stands today:</p>
						${I2(t)}
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
	`}function M2(e){let t="",n="",s="";const a=["rocket","lightning","fire","star","brain","crown","diamond","target","compass","mountain"],i={rocket:"🚀",lightning:"⚡",fire:"🔥",star:"⭐",brain:"🧠",crown:"👑",diamond:"💎",target:"🎯",compass:"🧭",mountain:"⛰️"};function o(l){l.preventDefault();const d=l.target,u=new FormData(d);t=u.get("name")?.trim()??"",n=u.get("mission")?.trim()??"",s=u.get("emoji")?.trim()||"🚀",t&&e({name:t,mission:n,emoji:s})}return r`
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
							${a.map((l,d)=>r`
									<label class="emoji-option">
										<input
											type="radio"
											name="emoji"
											value="${i[l]}"
											?checked=${d===0}
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
	`}function O2(e){const{phase:t,tools:n,auditFindings:s,onSkipPhase:a}=e;return r`
		${R2(t)}
		${t===3?E2(n,a):p}
		${t===4&&s.length>0?P2(s):p}
	`}function F2(e,t,n){return e?r`
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
				${t?.mission?r`<p class="onboarding-summary-mission">"${t.mission}"</p>`:p}
				<button class="onboarding-cta onboarding-reveal-btn" @click=${n}>
					Welcome to GodMode
				</button>
			</div>
		</div>
	`:r`${p}`}function N2(e){let t=!1;function n(s){if(s.preventDefault(),t)return;const a=s.target,i=a.querySelector('[name="name"]')?.value?.trim()??"";if(!i){a.querySelector('[name="name"]')?.focus();return}t=!0,e.onQuickSetup(i)}return r`
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
  `}function B2(e){return e>=100?"GodMode fully loaded":e>=75?"Your ally is learning...":e>=50?"Building momentum...":e>=25?"Getting started...":"Power up your ally"}function U2(e){const n=2*Math.PI*54,s=n-e/100*n;return r`
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
      <span class="setup-ring__label">${B2(e)}</span>
    </div>
  `}function z2(e,t){const n=`setup-card--${e.status}`;return r`
    <div class="setup-card ${n}">
      <div class="setup-card__header">
        <span class="setup-card__icon">${e.icon}</span>
        <span class="setup-card__title">${e.title}</span>
        <span class="setup-card__badge setup-card__badge--${e.status}">
          ${e.status==="active"?"✓ Active":e.status==="available"?"Available":"Coming Soon"}
        </span>
      </div>
      <p class="setup-card__desc">${e.description}</p>
      ${e.detail?r`<span class="setup-card__detail">${e.detail}</span>`:p}
      ${e.status==="available"&&e.action?r`<button class="setup-card__btn" @click=${()=>t(e.id)}>${e.action}</button>`:p}
      ${e.status==="active"?r`<span class="setup-card__active-check">\u2705</span>`:p}
    </div>
  `}function K2(e){const{capabilities:t,capabilitiesLoading:n,onHideSetup:s,onOpenWizard:a,onCapabilityAction:i}=e;if(n&&!t)return r`<div class="setup-loading">Loading capabilities...</div>`;if(!t)return r`<div class="setup-loading">Couldn't load capabilities. Is the gateway running?</div>`;const{capabilities:o,percentComplete:l}=t;return r`
    <div class="setup-capabilities">
      ${U2(l)}

      <div class="setup-cards">
        ${o.map(d=>z2(d,i))}
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
  `}function W2(e){return e.connected?r`
    <section class="tab-body setup-section">
      ${e.quickSetupDone?p:N2(e)}
      ${K2(e)}
    </section>
  `:r`
      <section class="tab-body setup-section">
        <div class="setup-loading">
          Waiting for gateway connection...
        </div>
      </section>
    `}function vc(e){const{connected:t,integrations:n,coreProgress:s,expandedCard:a,activeGuide:i,loadingGuide:o,testingId:l,testResult:d,configValues:u}=e;if(!t)return r`
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
    `;const h=n.filter(w=>w.tier==="core"),f=n.filter(w=>w.tier==="deep"),m=s!=null&&s.connected>=s.total;return r`
    <div class="view-container onboarding-setup">
      <div class="onboarding-header">
        <div class="onboarding-header__text">
          <h2>Connect Your World</h2>
          <p class="section-subtitle">Set up the integrations that power your daily brief and agent features. Everything is skippable.</p>
        </div>
        ${e.onOpenSupportChat?r`<button class="btn btn--ghost onboarding-help-btn" @click=${()=>e.onOpenSupportChat()}>Need help? Chat with support</button>`:p}
      </div>

      ${m?r`
            <div class="onboarding-complete">
              <div class="onboarding-complete__icon">&#x2705;</div>
              <div class="onboarding-complete__text">
                <h3>Core integrations connected</h3>
                <p>Your daily brief, remote access, and coding tools are ready. Set up the optional extras below, or start using GodMode.</p>
              </div>
              ${e.onMarkComplete?r`<button class="btn btn--primary onboarding-complete__cta" @click=${()=>e.onMarkComplete()}>Start Using GodMode</button>`:p}
            </div>
          `:p}

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
                `:p}
            <div class="integration-cards">
              ${h.map(w=>yc(w,e))}
            </div>
          </div>
        </div>

        ${f.length>0?r`
              <div class="onboarding-column onboarding-column--deep">
                <div class="onboarding-section">
                  <h3>Deep Setup</h3>
                  <p class="section-subtitle">Optional extras — health tracking, weather, cloud sync.</p>
                  <div class="integration-cards">
                    ${f.map(w=>yc(w,e))}
                  </div>
                </div>
              </div>
            `:p}
      </div>
    </div>
  `}function yc(e,t){const{expandedCard:n,activeGuide:s,loadingGuide:a,testingId:i,testResult:o,configValues:l}=t,d=n===e.id,u=e.status.working||e.status.configured,h=i===e.id,f=o?.id===e.id,m=e.id==="messaging-channel";return r`
    <div class="integration-card ${u?"integration-card--connected":""} ${d?"integration-card--expanded":""}">
      <div class="integration-card__header" @click=${()=>t.onExpandCard(d?null:e.id)}>
        <span class="integration-card__chevron ${d?"integration-card__chevron--open":""}">&#x25B8;</span>
        <div class="integration-card__info">
          <span class="integration-card__name">${e.name}</span>
          <span class="integration-card__desc">${e.description}</span>
          ${e.briefSection?r`<span class="integration-card__powers">Powers: ${e.briefSection}</span>`:p}
        </div>
        <div class="integration-card__status">
          ${u?r`<span class="status-badge status-badge--connected">Connected</span>`:r`<span class="status-badge status-badge--available">Not Set Up</span>`}
        </div>
      </div>

      ${d?r`
            <div class="integration-card__body">
              ${m?r`
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
                            <div class="guide-steps">${q2(s.steps)}</div>

                            ${s.envVars.length>0?r`
                                  <div class="guide-inputs">
                                    ${s.envVars.map(w=>r`
                                        <label class="input-group">
                                          <span class="input-label">${w.label}</span>
                                          <span class="input-desc">${w.description}</span>
                                          <input
                                            class="input-field"
                                            type="${w.secret?"password":"text"}"
                                            placeholder="${w.label}"
                                            .value=${l[w.key]??""}
                                            @input=${$=>{const c=$.target.value;t.onUpdateConfigValue(w.key,c)}}
                                          />
                                        </label>
                                      `)}
                                    <div class="guide-actions">
                                      <button
                                        class="btn btn--primary"
                                        @click=${()=>{const w={};for(const $ of s.envVars){const c=l[$.key];c&&(w[$.key]=c)}t.onConfigureIntegration(e.id,w)}}
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
                                      ?disabled=${h}
                                    >
                                      ${h?"Testing...":"Test Connection"}
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
                  `:p}

              ${e.status.details?r`<div class="integration-details">${e.status.details}</div>`:p}
            </div>
          `:p}
    </div>
  `}function q2(e){const t=e.split(`
`),n=[];for(const s of t)s.startsWith("```")||(s.match(/^\d+\./)?n.push(r`<p class="guide-step">${bc(s)}</p>`):s.trim()&&n.push(r`<p>${bc(s)}</p>`));return r`${n}`}function j2(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function bc(e){let t=j2(e);return t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(n,s,a)=>{const i=a.trim().toLowerCase();return i.startsWith("javascript:")||i.startsWith("data:")||i.startsWith("vbscript:")?s:`<a href="${a}" target="_blank" rel="noopener">${s}</a>`}),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),r`<span>${Ae(t)}</span>`}const V2=/^data:/i,H2=/^https?:\/\//i;function G2(e){const t=e.agentsList?.agents??[],s=Bc(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",i=t.find(l=>l.id===s)?.identity,o=i?.avatarUrl??i?.avatar;if(o)return V2.test(o)||H2.test(o)?o:i?.avatarUrl}function wc(e,t){const n=e.dynamicSlots[t];return n?r`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${Ae(rd(n))}</div>
    </div>
  `:p}function $c(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const l=n.length/2,d=n.slice(0,l).join(" "),u=n.slice(l).join(" ");if(d.toLowerCase()===u.toLowerCase())return d}const s=t.replace(/\s+/g," ").toLowerCase(),a=Math.floor(s.length/2),i=s.slice(0,a).trim(),o=s.slice(a).trim();return i&&i===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Ui(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function kc(e){if(e===Q)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function Q2(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))].filter(l=>!kc(l)),s=Me(t,e.sessionKey),a=Ui(e.sessionKey,s),i=new Map;for(const l of n){const d=Me(t,l),u=Ui(l,d);if(!i.has(u)){i.set(u,l);continue}l===e.sessionKey&&i.set(u,l)}const o=[...i.values()];if(o.length===0){const l=e.sessionKey.trim()||"main";kc(l)||o.push(l)}return{tabKeys:o,activeIdentity:a}}function Y2(e){const t=e.onboardingActive&&e.onboarding,n=e.onboardingPhase??0,s=e.onboardingData;if(t&&n===0)return D2(()=>{e.handleOnboardingStart?.()},s?.assessment);if(t&&n===1)return M2(c=>{e.handleOnboardingIdentitySubmit?.(c)});if(t&&n===6)return F2(s?.summary??null,s?.identity??null,()=>{e.handleOnboardingComplete?.()});if(e.wizardActive&&e.wizardState)return vp(e.wizardState,{onStepChange:c=>{e.handleWizardStepChange?.(c)},onAnswerChange:(c,g)=>{e.handleWizardAnswerChange?.(c,g)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(c,g)=>{e.handleWizardFileToggle?.(c,g)},onConfigToggle:(c,g)=>{e.handleWizardConfigToggle?.(c,g)}});const a=e.presenceEntries.length,i=e.sessionsResult?.count??null,o=e.cronStatus?.nextWakeAtMs??null,l=e.connected?null:"Disconnected from gateway.",d=e.tab==="chat",u=d&&(e.settings.chatFocusMode||e.onboarding||t&&n>=2),h=e.onboarding?!1:e.settings.chatShowThinking,f=G2(e),m=e.chatAvatarUrl??f??null,{tabKeys:w,activeIdentity:$}=Q2(e);return r`
    <div class="shell ${d?"shell--chat":""} ${u?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
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
          ${p}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?r`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${c=>{c.preventDefault(),e.setTab("overview")}}
                >
                  <span class="pill__icon">${q.zap}</span>
                  <span>Update Ready</span>
                </a>`:p}
          ${e.updateStatus?.pendingDeploy?r`<button
                  class="pill pill--restart"
                  @click=${c=>{c.preventDefault(),e.handleGatewayRestartClick()}}
                  title="Restart to apply: ${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${q.rotateCcw}</span>
                  <span>Restart</span>
                </button>`:p}
          <button
            class="pill pill--support"
            @click=${c=>{c.preventDefault(),e.handleOpenSupportChat()}}
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
          ${zu(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Uh.map(c=>{const g=e.settings.navGroupsCollapsed[c.label]??!1,k=c.tabs.some(T=>T===e.tab),A=!c.label||c.tabs.length===1&&Yn(c.tabs[0])===c.label;return r`
            <div class="nav-group ${g&&!k?"nav-group--collapsed":""} ${A?"nav-group--no-header":""}">
              ${A?p:r`
                <button
                  class="nav-label"
                  @click=${()=>{const T={...e.settings.navGroupsCollapsed};T[c.label]=!g,e.applySettings({...e.settings,navGroupsCollapsed:T})}}
                  aria-expanded=${!g}
                >
                  <span class="nav-label__text">${c.label}</span>
                  <span class="nav-label__chevron">${g?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!c.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?r`
                        <a
                          class="nav-item ${e.tab==="setup"?"active":""}"
                          href="#"
                          @click=${T=>{T.preventDefault(),e.setTab("setup")}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                          ${e.setupCapabilities&&e.setupCapabilities.percentComplete!=null?r`<span class="nav-item__badge">${e.setupCapabilities.percentComplete}%</span>`:p}
                        </a>
                      `:p}
                ${c.tabs.map(T=>Ii(e,T))}
              </div>
            </div>
          `})}
        ${zh.map(c=>{const g=e.settings.navGroupsCollapsed[c.label]??!0,k=c.tabs.some(A=>A===e.tab);return r`
            <div class="nav-group ${g&&!k?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const A={...e.settings.navGroupsCollapsed};A[c.label]=!g,e.applySettings({...e.settings,navGroupsCollapsed:A})}}
                aria-expanded=${!g}
              >
                <span class="nav-label__text">${c.label}</span>
                <span class="nav-label__chevron">${g?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${c.tabs.map(A=>Ii(e,A))}
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
      <main class="content ${d?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="setup"?r`
              <div class="page-title">${Yn(e.tab)}</div>
              <div class="page-sub">${qh(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===Q?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==Q&&(Se(e),e.sessionKey=Q,e.allyUnread=0,Pe(e,Q),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...e.settings.tabLastViewed,[Q]:Date.now()}}),e.loadAssistantIdentity(),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),e.loadSessionResources(),te(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?r`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:r`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?r`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:p}
                </div>
                ${ga(w,c=>c,(c,g)=>{const k=Me(e.sessionsResult?.sessions,c),A=Ui(c,k)===$,x=(()=>{if(k?.label||k?.displayName)return $c(k.label??k.displayName);const I=De.get(c);if(I)return $c(I);if(c==="agent:main:support")return"Support";if(c.includes("webchat")){const N=c.match(/webchat[:-](\d+)/);return N?`Chat ${N[1]}`:"Chat"}if(c.includes("main"))return"MAIN";const M=c.split(/[:-]/);return M[M.length-1]||c})(),_=e.workingSessions.has(c),P=e.settings.tabLastViewed[c]??0,E=k?.updatedAt??0,Z=!A&&!_&&E>P,Y=e.editingTabKey===c;return r`
                      <div
                        class="session-tab ${A?"session-tab--active":""} ${_?"session-tab--working":""} ${Z?"session-tab--ready":""} ${Y?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${I=>{if(e.editingTabKey===c){I.preventDefault();return}I.dataTransfer.effectAllowed="move",I.dataTransfer.setData("text/session-key",c),I.dataTransfer.setData("text/plain",g.toString()),I.target.classList.add("dragging")}}
                        @click=${()=>{if(!Y){if(A){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}});return}Se(e),e.sessionKey=c,Pe(e,c),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}}),e.loadAssistantIdentity(),ye(e,c,!0),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),e.loadSessionResources(),te(e),Wo()}}}
                        @dragend=${I=>{I.target.classList.remove("dragging")}}
                        @dragover=${I=>{I.preventDefault(),I.dataTransfer.dropEffect="move";const M=I.currentTarget,N=M.getBoundingClientRect(),U=N.left+N.width/2;I.clientX<U?(M.classList.add("drop-left"),M.classList.remove("drop-right")):(M.classList.add("drop-right"),M.classList.remove("drop-left"))}}
                        @dragleave=${I=>{I.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${I=>{I.preventDefault();const M=parseInt(I.dataTransfer.getData("text/plain")),N=g;if(M===N)return;const U=e.settings.openTabs.slice(),[O]=U.splice(M,1);U.splice(N,0,O),e.applySettings({...e.settings,openTabs:U}),I.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${x}
                      >
                        ${Y?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${k?.label??k?.displayName??""}
                            @click=${I=>I.stopPropagation()}
                            @dblclick=${I=>I.stopPropagation()}
                            @blur=${async I=>{const M=I.target;if(M._committedByEnter)return;const N=M.value.trim();e.editingTabKey=null;const U=k?.label??k?.displayName??"";if(N!==U){N?De.set(c,N):De.delete(c),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(J=>J.key===c?{...J,label:N||void 0,displayName:N||void 0}:J)});const O=await Es(e,c,{label:N||null,displayName:N||null});te(e);const ie=O.ok&&O.canonicalKey!==c?O.canonicalKey:c,ke=c===e.sessionKey;e.applySettings({...e.settings,...O.ok&&O.canonicalKey!==c&&e.settings.openTabs.includes(c)?{openTabs:e.settings.openTabs.map(J=>J===c?O.canonicalKey:J)}:{},tabLastViewed:{...e.settings.tabLastViewed,[ie]:Date.now()},...ke&&O.ok&&O.canonicalKey!==c?{sessionKey:O.canonicalKey,lastActiveSessionKey:O.canonicalKey}:{}}),ke&&O.ok&&O.canonicalKey!==c&&(e.sessionKey=O.canonicalKey,ye(e,O.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}})}}
                            @keydown=${async I=>{if(I.key==="Enter"){I.preventDefault();const M=I.target;M._committedByEnter=!0;const N=M.value.trim();e.editingTabKey=null;const U=k?.label??k?.displayName??"";if(N!==U){N?De.set(c,N):De.delete(c),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(J=>J.key===c?{...J,label:N||void 0,displayName:N||void 0}:J)});const O=await Es(e,c,{label:N||null,displayName:N||null});te(e);const ie=O.ok&&O.canonicalKey!==c?O.canonicalKey:c,ke=c===e.sessionKey;e.applySettings({...e.settings,...O.ok&&O.canonicalKey!==c&&e.settings.openTabs.includes(c)?{openTabs:e.settings.openTabs.map(J=>J===c?O.canonicalKey:J)}:{},tabLastViewed:{...e.settings.tabLastViewed,[ie]:Date.now()},...ke&&O.ok&&O.canonicalKey!==c?{sessionKey:O.canonicalKey,lastActiveSessionKey:O.canonicalKey}:{}}),ke&&O.ok&&O.canonicalKey!==c&&(e.sessionKey=O.canonicalKey,ye(e,O.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}})}else I.key==="Escape"&&(I.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let I=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${M=>{M.stopPropagation(),I&&clearTimeout(I),I=setTimeout(()=>{I=null,e.editingTabKey!==c&&(c===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}}):(Se(e),e.sessionKey=c,e.chatPrivateMode=!!e.privateSessions?.has(c),Pe(e,c),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c,tabLastViewed:{...e.settings.tabLastViewed,[c]:Date.now()}}),e.loadAssistantIdentity(),ye(e,c,!0),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),e.loadSessionResources(),te(e)))},250)}}
                            @dblclick=${M=>{M.preventDefault(),M.stopPropagation(),I&&(clearTimeout(I),I=null),e.editingTabKey=c;const N=M.target.closest(".session-tab"),U=O=>{const ie=O.target;N&&!N.contains(ie)&&(e.editingTabKey=null,document.removeEventListener("mousedown",U,!0))};document.addEventListener("mousedown",U,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const O=N?.querySelector(".session-tab__name-input");O&&(O.focus(),O.select())})})}}
                          >${x}</span>
                        `})()}
                        ${e.privateSessions?.has(c)?(()=>{const I=e.privateSessions.get(c),M=Math.max(0,I-Date.now()),N=Math.floor(M/36e5),U=Math.floor(M%36e5/6e4),O=N>0?`${N}h ${U}m`:`${U}m`;return r`
                                  <span class="session-tab__private" title="Private session — expires in ${O}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${O}</span
                                  >
                                `})():p}
                        ${_?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:p}
                        ${Z?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:p}
                        ${r`
                          <button
                            class="session-tab__close"
                            @click=${I=>{if(I.stopPropagation(),e.privateSessions?.has(c)){e._destroyPrivateSession(c);return}const M=e.settings.openTabs.filter(O=>O!==c),N=c===e.sessionKey,U=M[0]||Q;e.applySettings({...e.settings,openTabs:M,...N?{sessionKey:U,lastActiveSessionKey:U}:{}}),N&&(e.sessionKey=U,e.sessionResources=[],ye(e,U,!0),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(c)?"Destroy private session":"Close tab"}
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
            ${d?Uu(e):p}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?h0({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:c=>e.handleTodayViewModeChange(c),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):p}
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
            </button>`:p}

        ${e.tab==="setup"?r`
                ${W2({connected:e.connected,quickSetupDone:e.setupQuickDone??!1,capabilities:e.setupCapabilities??null,capabilitiesLoading:e.setupCapabilitiesLoading??!1,onQuickSetup:c=>e.handleQuickSetup?.(c),onHideSetup:()=>e.handleHideSetup?.(),onOpenWizard:()=>e.handleWizardOpen?.(),onNavigate:c=>e.setTab(c),onRunAssessment:()=>e.handleRunAssessment?.(),onOpenSupportChat:()=>e.handleOpenSupportChat(),onCapabilityAction:c=>e.handleCapabilityAction?.(c)})}
                ${e.setupQuickDone?vc({connected:e.connected,integrations:e.onboardingIntegrations??null,coreProgress:e.onboardingCoreProgress??null,expandedCard:e.onboardingExpandedCard??null,loadingGuide:e.onboardingLoadingGuide??null,activeGuide:e.onboardingActiveGuide??null,testingId:e.onboardingTestingId??null,testResult:e.onboardingTestResult??null,configValues:e.onboardingConfigValues??{},onLoadIntegrations:()=>e.handleLoadIntegrations(),onExpandCard:c=>e.handleExpandCard(c),onLoadGuide:c=>e.handleLoadGuide(c),onTestIntegration:c=>e.handleTestIntegration(c),onConfigureIntegration:(c,g)=>e.handleConfigureIntegration(c,g),onUpdateConfigValue:(c,g)=>e.handleUpdateConfigValue(c,g),onSkipIntegration:c=>e.handleSkipIntegration(c),onNavigate:c=>e.setTab(c),onMarkComplete:()=>e.handleMarkOnboardingComplete?.(),onOpenSupportChat:()=>e.handleOpenSupportChat()}):p}
              `:p}

        ${e.tab==="onboarding"?vc({connected:e.connected,integrations:e.onboardingIntegrations??null,coreProgress:e.onboardingCoreProgress??null,expandedCard:e.onboardingExpandedCard??null,loadingGuide:e.onboardingLoadingGuide??null,activeGuide:e.onboardingActiveGuide??null,testingId:e.onboardingTestingId??null,testResult:e.onboardingTestResult??null,configValues:e.onboardingConfigValues??{},onLoadIntegrations:()=>e.handleLoadIntegrations(),onExpandCard:c=>e.handleExpandCard(c),onLoadGuide:c=>e.handleLoadGuide(c),onTestIntegration:c=>e.handleTestIntegration(c),onConfigureIntegration:(c,g)=>e.handleConfigureIntegration(c,g),onUpdateConfigValue:(c,g)=>e.handleUpdateConfigValue(c,g),onSkipIntegration:c=>e.handleSkipIntegration(c),onNavigate:c=>e.setTab(c),onMarkComplete:()=>e.handleMarkOnboardingComplete?.(),onOpenSupportChat:()=>e.handleOpenSupportChat()}):p}

        ${e.tab==="overview"?z0({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:a,sessionsCount:i,cronEnabled:e.cronStatus?.enabled??null,cronNext:o,lastChannelsRefresh:e.channelsLastSuccess,updateStatus:e.updateStatus,updateLoading:e.updateLoading,updateError:e.updateError,updateLastChecked:e.updateLastChecked,updateRunning:e.updateRunning,onSettingsChange:c=>e.applySettings(c),onPasswordChange:c=>e.password=c,onSessionKeyChange:c=>{Se(e),e.sessionKey=c,Pe(e,c),e.resetToolStream(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity(),e.loadSessionResources()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview(),onCheckUpdates:()=>tu(e),onUpdateNow:()=>{Ar(e)},pluginUpdateRunning:e.pluginUpdateRunning,onUpdatePlugin:()=>{yh(e)}}):p}

        ${e.tab==="workspaces"?o0({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",expandedFolders:e.workspaceExpandedFolders??new Set,loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:c=>e.workspacesSearchQuery=c,onItemSearch:c=>e.workspaceItemSearchQuery=c,onCreateWorkspace:async c=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:g,selectWorkspace:k}=await R(async()=>{const{createWorkspace:T,selectWorkspace:x}=await Promise.resolve().then(()=>he);return{createWorkspace:T,selectWorkspace:x}},void 0,import.meta.url),A=await g(e,c);return A?(e.workspaceItemSearchQuery="",await k(e,A),e.showToast(`Created workspace: ${A.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onDeleteWorkspace:async c=>{const{deleteWorkspace:g,loadAllTasksWithQueueStatus:k}=await R(async()=>{const{deleteWorkspace:T,loadAllTasksWithQueueStatus:x}=await Promise.resolve().then(()=>he);return{deleteWorkspace:T,loadAllTasksWithQueueStatus:x}},void 0,import.meta.url);if(!await g(e,c.id)){e.showToast(`Failed to delete ${c.name}`,"error");return}e.showToast(`Deleted workspace: ${c.name}`,"success"),e.allTasks=await k(e)},onSelectWorkspace:async c=>{e.workspaceItemSearchQuery="";const{selectWorkspace:g}=await R(async()=>{const{selectWorkspace:k}=await Promise.resolve().then(()=>he);return{selectWorkspace:k}},void 0,import.meta.url);await g(e,c)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async c=>{const{readWorkspaceFile:g}=await R(async()=>{const{readWorkspaceFile:T}=await Promise.resolve().then(()=>he);return{readWorkspaceFile:T}},void 0,import.meta.url),k=e.selectedWorkspace?.id,A=await g(e,c.path,k);if(!A){e.showToast(`Failed to open ${c.name}`,"error");return}e.handleOpenSidebar(A.content,{mimeType:A.mime,filePath:c.path,title:c.name})},onSessionClick:async c=>{if(!c.key)return;const g=c.key;Se(e),e.sessionKey=g,Pe(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const k=e.settings.openTabs.includes(g)?e.settings.openTabs:[...e.settings.openTabs,g];e.applySettings({...e.settings,openTabs:k,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),ye(e,g,!0),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),e.loadSessionResources()},onPinToggle:async(c,g,k)=>{const{toggleWorkspacePin:A}=await R(async()=>{const{toggleWorkspacePin:x}=await Promise.resolve().then(()=>he);return{toggleWorkspacePin:x}},void 0,import.meta.url);await A(e,c,g,k)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(c,g,k)=>{const{toggleWorkspaceSessionPin:A}=await R(async()=>{const{toggleWorkspaceSessionPin:x}=await Promise.resolve().then(()=>he);return{toggleWorkspaceSessionPin:x}},void 0,import.meta.url);await A(e,c,g,k)||e.showToast("Failed to update session pin","error")},onToggleFolder:c=>{R(async()=>{const{toggleWorkspaceFolder:g}=await Promise.resolve().then(()=>he);return{toggleWorkspaceFolder:g}},void 0,import.meta.url).then(({toggleWorkspaceFolder:g})=>{e.workspaceExpandedFolders=g(e.workspaceExpandedFolders??new Set,c),e.requestUpdate()})},onTeamSetup:async()=>{let c="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";try{const g=await e.client?.request("workspaces.teamSetupPrompt",{});g?.prompt&&(c=g.prompt)}catch{}e.handleStartChatWithPrompt(c)},allTasks:e.allTasks??[],taskFilter:e.taskFilter??"outstanding",taskSort:e.taskSort??"due",taskSearch:e.taskSearch??"",showCompletedTasks:e.showCompletedTasks??!1,onToggleTaskComplete:async(c,g)=>{const{toggleTaskComplete:k,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await R(async()=>{const{toggleTaskComplete:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}=await Promise.resolve().then(()=>he);return{toggleTaskComplete:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}},void 0,import.meta.url);if(!await k(e,c,g)){e.showToast("Failed to update task","error");return}if(e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},onCreateTask:async(c,g)=>{const{createTask:k,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await R(async()=>{const{createTask:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}=await Promise.resolve().then(()=>he);return{createTask:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}},void 0,import.meta.url),x=await k(e,c,g);if(!x){e.showToast("Failed to create task","error");return}if(e.showToast(`Task created: ${x.title}`,"success"),e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},onSetTaskFilter:c=>{e.taskFilter=c},onSetTaskSort:c=>{e.taskSort=c},onSetTaskSearch:c=>{e.taskSearch=c},onToggleCompletedTasks:()=>{e.showCompletedTasks=!(e.showCompletedTasks??!1)},editingTaskId:e.editingTaskId??null,workspaceNames:(e.workspaces??[]).map(c=>c.name),onStartTask:async c=>{const{startTask:g,loadAllTasksWithQueueStatus:k}=await R(async()=>{const{startTask:_,loadAllTasksWithQueueStatus:P}=await Promise.resolve().then(()=>he);return{startTask:_,loadAllTasksWithQueueStatus:P}},void 0,import.meta.url),A=await g(e,c);if(!A?.sessionId){e.showToast("Failed to open session for task","error");return}Se(e);const T=A.sessionId;A.task?.title&&De.set(T,A.task.title);const x=e.settings.openTabs.includes(T)?e.settings.openTabs:[...e.settings.openTabs,T];if(e.applySettings({...e.settings,openTabs:x,sessionKey:T,lastActiveSessionKey:T,tabLastViewed:{...e.settings.tabLastViewed,[T]:Date.now()}}),e.sessionKey=T,e.setTab("chat"),A.created&&!A.queueOutput){const _=e.allTasks??[],P=e.selectedWorkspace?.tasks??[],E=[..._,...P].find(Y=>Y.id===c),Z=E?.project?` (project: ${E.project})`:"";e.chatMessage=`Let's work on: ${E?.title??"this task"}${Z}`}else e.chatMessage="";e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,T,!0),await se(e),e.loadSessionResources(),A.queueOutput&&e.chatMessages.length===0&&e.seedSessionWithAgentOutput(A.task?.title??"this task",A.queueOutput,A.agentPrompt??void 0),e.allTasks=await k(e),e.requestUpdate()},onEditTask:c=>{e.editingTaskId=c},onUpdateTask:async(c,g)=>{const{updateTask:k,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await R(async()=>{const{updateTask:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}=await Promise.resolve().then(()=>he);return{updateTask:_,loadAllTasksWithQueueStatus:P,getWorkspace:E}},void 0,import.meta.url);if(!await k(e,c,g)){e.showToast("Failed to update task","error");return}if(e.editingTaskId=null,e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},browsePath:e.workspaceBrowsePath??null,browseEntries:e.workspaceBrowseEntries??null,breadcrumbs:e.workspaceBreadcrumbs??null,browseSearchQuery:e.workspaceBrowseSearchQuery??"",browseSearchResults:e.workspaceBrowseSearchResults??null,onBrowseFolder:c=>e.handleWorkspaceBrowse(c),onBrowseSearch:c=>e.handleWorkspaceBrowseSearch(c),onBrowseBack:()=>e.handleWorkspaceBrowseBack(),onCreateFolder:c=>e.handleWorkspaceCreateFolder(c),onBatchPushToDrive:c=>e.handleBatchPushToDrive(c)}):p}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?wc(e,"today"):g0({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefGenerate:()=>e.handleDailyBriefGenerate(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:c=>e.handleBriefSave(c),onBriefToggleCheckbox:(c,g)=>e.handleBriefToggleCheckbox(c,g),onOpenFile:c=>{e.handleOpenFile(c)},selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:c=>e.handleTodayViewModeChange(c),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh(),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),todayTasks:e.todayTasks??[],todayTasksLoading:e.todayTasksLoading??!1,onToggleTaskComplete:(c,g)=>e.handleMyDayTaskStatusChange(c,g==="complete"?"pending":"complete"),onStartTask:c=>e.handleTodayStartTask(c),onViewTaskOutput:c=>e.handleTodayViewTaskOutput(c),onCreateTask:c=>e.handleTodayCreateTask(c),onEditTask:c=>e.handleTodayEditTask(c),onUpdateTask:(c,g)=>e.handleTodayUpdateTask(c,g),editingTaskId:e.todayEditingTaskId,showCompletedTasks:e.todayShowCompleted,onToggleCompletedTasks:()=>e.handleTodayToggleCompleted(),decisionCards:(e.todayQueueResults??[]).length>0?{items:e.todayQueueResults,onApprove:c=>e.handleDecisionApprove(c),onReject:c=>e.handleDecisionReject(c),onDismiss:c=>e.handleDecisionDismiss(c),onViewOutput:(c,g)=>e.handleDecisionViewOutput(c,g),onOpenChat:c=>e.handleDecisionOpenChat(c),onMarkComplete:c=>e.handleDecisionMarkComplete(c),onRate:(c,g,k)=>e.handleDecisionRate(c,g,k),onFeedback:(c,g,k)=>e.handleDecisionFeedback(c,g,k)}:void 0,inboxItems:e.inboxItems??[],inboxLoading:e.inboxLoading??!1,inboxCount:e.inboxCount??0,inboxScoringId:e.inboxScoringId??null,inboxScoringValue:e.inboxScoringValue,inboxFeedbackText:e.inboxFeedbackText,onInboxViewOutput:c=>{e.handleInboxViewOutput(c)},onInboxViewProof:c=>{e.handleInboxViewProof(c)},onInboxOpenChat:c=>e.handleInboxOpenChat(c),onInboxDismiss:c=>{e.handleInboxDismiss(c)},onInboxScore:(c,g,k)=>{e.handleInboxScore(c,g,k)},onInboxSetScoring:(c,g)=>e.handleInboxSetScoring(c,g),onInboxFeedbackChange:c=>e.handleInboxFeedbackChange(c),onInboxMarkAll:()=>{e.handleInboxMarkAll()},onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):p}

        ${e.tab==="work"?e.dynamicSlots.work?wc(e,"work"):a2({connected:e.connected,projects:e.workProjects??[],loading:e.workLoading??!1,error:e.workError??null,expandedProjects:e.workExpandedProjects,projectFiles:e.workProjectFiles??{},detailLoading:e.workDetailLoading??new Set,onRefresh:()=>e.handleWorkRefresh(),onToggleProject:c=>e.handleWorkToggleProject(c),onPersonClick:c=>e.handleWorkPersonClick(c),onFileClick:c=>e.handleWorkFileClick(c),onSkillClick:(c,g)=>e.handleWorkSkillClick(c,g),resources:e.workResources??[],resourcesLoading:e.workResourcesLoading??!1,resourceFilter:e.workResourceFilter??"all",onResourceFilterChange:c=>e.handleResourceFilterChange(c),onResourceClick:c=>e.handleResourceClick(c),onResourcePin:(c,g)=>e.handleResourcePin(c,g),onResourceDelete:c=>e.handleResourceDelete(c)}):p}

        ${e.tab==="channels"?s$({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:c=>Oe(e,c),onWhatsAppStart:c=>e.handleWhatsAppStart(c),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(c,g)=>nn(e,c,g),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(c,g)=>e.handleNostrProfileEdit(c,g),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(c,g)=>e.handleNostrProfileFieldChange(c,g),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):p}

        ${e.tab==="instances"?Ek({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Lo(e)}):p}

        ${e.tab==="sessions"?eS({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:c=>{e.sessionsFilterActive=c.activeMinutes,e.sessionsFilterLimit=c.limit,e.sessionsIncludeGlobal=c.includeGlobal,e.sessionsIncludeUnknown=c.includeUnknown},onRefresh:()=>{te(e),Nt(e)},onPatch:async(c,g)=>{const k=await Es(e,c,g);if(k.ok&&k.canonicalKey!==c&&e.settings.openTabs.includes(c)){const A=e.settings.openTabs.map(x=>x===c?k.canonicalKey:x),T=c===e.sessionKey;e.applySettings({...e.settings,openTabs:A,tabLastViewed:{...e.settings.tabLastViewed,[k.canonicalKey]:e.settings.tabLastViewed[c]??Date.now()},...T?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),T&&(e.sessionKey=k.canonicalKey,ye(e,k.canonicalKey,!0))}},onDelete:c=>Qd(e,c),onArchive:c=>Yd(e,c),onUnarchive:c=>Jd(e,c),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Nt(e)},onAutoArchive:()=>Xd(e)}):p}

        ${e.tab==="cron"?$k({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(c=>c.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:c=>e.cronForm={...e.cronForm,...c},onRefresh:()=>e.loadCron(),onAdd:()=>Iy(e),onToggle:(c,g)=>Dy(e,c,g),onRun:c=>My(e,c),onRemove:c=>Oy(e,c),onLoadRuns:c=>fu(e,c)}):p}

        ${e.tab==="skills"?iS({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:c=>e.skillsFilter=c,onRefresh:()=>{os(e,{clearMessages:!0}),Pi(e)},onToggle:(c,g)=>sb(e,c,g),onEdit:(c,g)=>nb(e,c,g),onSaveKey:c=>ab(e,c),onInstall:(c,g,k)=>ib(e,c,g,k),onSubTabChange:c=>{e.skillsSubTab=c,c==="godmode"&&!e.godmodeSkills&&Pi(e),c==="clawhub"&&e.clawhubExploreItems},onToggleExpand:c=>{const g=new Set(e.expandedSkills);g.has(c)?g.delete(c):g.add(c),e.expandedSkills=g},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:c=>{e.clawhubQuery=c},onExplore:c=>void 0,onDetail:c=>void 0,onCloseDetail:()=>void 0,onImport:c=>Al(),onImportAndPersonalize:async c=>{if(!await Al())return;const k=await mw();k&&(Oo(e,"chat"),ma(e),e.chatMessage=k)}}}):p}

        ${e.tab==="agents"?pS({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:c=>e.rosterFilter=c,onRefresh:()=>kd(e),onToggleExpand:c=>{const g=new Set(e.expandedAgents);g.has(c)?g.delete(c):g.add(c),e.expandedAgents=g}}):p}

        ${e.tab==="nodes"?m0({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ra(e),onDevicesRefresh:()=>mt(e),onDeviceApprove:c=>$v(e,c),onDeviceReject:c=>kv(e,c),onDeviceRotate:(c,g,k)=>Sv(e,{deviceId:c,role:g,scopes:k}),onDeviceRevoke:(c,g)=>Av(e,{deviceId:c,role:g}),onLoadConfig:()=>Ze(e),onLoadExecApprovals:()=>{const c=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Po(e,c)},onBindDefault:c=>{c?nn(e,["tools","exec","node"],c):xr(e,["tools","exec","node"])},onBindAgent:(c,g)=>{const k=["agents","list",c,"tools","exec","node"];g?nn(e,k,g):xr(e,k)},onSaveBindings:()=>Ms(e),onExecApprovalsTargetChange:(c,g)=>{e.execApprovalsTarget=c,e.execApprovalsTargetNodeId=g,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:c=>{e.execApprovalsSelectedAgent=c},onExecApprovalsPatch:(c,g)=>Vy(e,c,g),onExecApprovalsRemove:c=>Hy(e,c),onSaveExecApprovals:()=>{const c=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return jy(e,c)}}):p}

        ${t&&n>=2&&n<=5&&e.tab==="chat"?O2({phase:n,identity:s?.identity??null,tools:s?.tools??[],auditFindings:s?.audit?.findings??[],summary:s?.summary??null,onSkipPhase:()=>e.handleOnboardingSkipPhase?.()}):e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length&&!t?r`
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

        ${e.tab==="chat"&&e.settings.chatParallelView?j1({state:e,onAssignLane:(c,g)=>{const k=g?Me(e.sessionsResult?.sessions,g)?.key??g:null,A=[...e.settings.parallelLanes];A[c]=k,e.applySettings({...e.settings,parallelLanes:A}),k&&e.client&&ho(e.client,k).then(()=>{e.applySettings({...e.settings})})},onReorderLanes:(c,g)=>{if(c===g||c<0||g<0||c>=e.settings.parallelLanes.length||g>=e.settings.parallelLanes.length)return;const k=[...e.settings.parallelLanes],[A]=k.splice(c,1);k.splice(g,0,A),e.applySettings({...e.settings,parallelLanes:k})},onLaneViewed:c=>{const g=Me(e.sessionsResult?.sessions,c)?.key??c,k=Date.now(),T=Me(e.sessionsResult?.sessions,g)?.updatedAt??0,x=Math.max(e.settings.tabLastViewed[c]??0,e.settings.tabLastViewed[g]??0);T>0&&x>=T||e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[c]:k,[g]:k}})},onSendInLane:(c,g)=>{c!==e.sessionKey?(Se(e),e.sessionKey=c,Pe(e,c),e.chatLoading=!0,e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity(),ye(e,c,!0),se(e).then(()=>{e.loadSessionResources(),e.chatMessage=g,e.handleSendChat(g)})):(e.chatMessage=g,e.handleSendChat(g))}}):p}

        ${e.tab==="chat"&&!e.settings.chatParallelView?J$({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:c=>{Se(e),e.sessionKey=c,Pe(e,c),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity(),se(e).then(()=>{e.resetChatScroll(),we(e,!0)}),Gs(e),e.loadSessionResources(),js(e)},thinkingLevel:e.chatThinkingLevel,showThinking:h,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:m,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:l,error:e.lastError,sessions:e.sessionsResult,focusMode:u,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),js(e),Promise.all([se(e),Gs(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:c=>e.handleChatScroll(c),onDraftChange:c=>e.chatMessage=c,attachments:e.chatAttachments,onAttachmentsChange:c=>e.chatAttachments=c,showToast:(c,g)=>e.showToast(c,g),onSend:c=>e.handleSendChat(void 0,{queue:c}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:c=>e.removeQueuedMessage(c),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(c,g)=>e.handleOpenSidebar(c,g),onMessageLinkClick:c=>e.handleOpenMessageFileLink(c),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:c=>{e.handleOpenProofDoc(c)},onOpenFile:c=>e.handleOpenFile(c),onSplitRatioChange:c=>e.handleSplitRatioChange(c),onPushToDrive:(c,g)=>e.handlePushToDrive(c,g),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(c,g,k)=>e.handleImageClick(c,g,k),resolveImageUrl:(c,g)=>Qv(e.sessionKey,c,g),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const c=document.querySelector(".chat-thread");c&&(c.scrollTo({top:c.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:c=>e.handleAllyDraftChange(c),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:c=>e.handleAllyAttachmentsChange(c),onAction:(c,g,k,A)=>e.handleAllyAction(c,g,k,A)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:c=>e.handleSessionResourceClick(c),onViewAllResources:()=>e.handleViewAllResources()}):p}

        ${e.tab==="options"?xS({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(c,g)=>e.handleOptionToggle(c,g),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):p}

        ${e.tab==="guardrails"?g1({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(c,g)=>e.handleGuardrailToggle(c,g),onThresholdChange:(c,g,k)=>e.handleGuardrailThresholdChange(c,g,k),onCustomToggle:(c,g)=>e.handleCustomGuardrailToggle(c,g),onCustomDelete:c=>e.handleCustomGuardrailDelete(c),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:c=>{e.handleAllyToggle(),c&&e.handleAllyDraftChange(c)}}):p}

        ${e.tab==="mission-control"?B1({connected:e.connected,loading:e.missionControlLoading,error:e.missionControlError,data:e.missionControlData??null,fullControl:e.missionControlFullControl,onToggleFullControl:()=>e.handleMissionControlToggleFullControl(),onRefresh:()=>e.handleMissionControlRefresh(),onCancelTask:c=>e.handleMissionControlCancelTask(c),onApproveItem:c=>e.handleMissionControlApproveItem(c),onRetryItem:c=>e.handleMissionControlRetryItem(c),onViewDetail:c=>e.handleMissionControlViewDetail(c),onOpenSession:c=>e.handleMissionControlOpenSession(c),onOpenTaskSession:c=>e.handleMissionControlOpenTaskSession(c),onStartQueueItem:c=>e.handleMissionControlStartQueueItem(c),onViewTaskFiles:c=>e.handleMissionControlViewTaskFiles(c),onSelectSwarmProject:c=>e.handleSwarmSelectProject(c),onSteerSwarmAgent:(c,g,k)=>e.handleSwarmSteer(c,g,k),onViewProofDoc:c=>e.handleSwarmViewProofDoc(c),onViewRunLog:c=>e.handleSwarmViewRunLog(c),onAskAlly:()=>{e.handleAllyToggle(),e.handleAllyDraftChange("What should I focus on next?")},allyName:e.assistantName}):p}

        ${e.tab==="trust"?l1({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:c=>e.handleTrustAddWorkflow(c),onRemoveWorkflow:c=>e.handleTrustRemoveWorkflow(c),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:i,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(c,g)=>e.handleDailyRate(c,g),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):p}

        ${e.tab==="second-brain"?g2({connected:e.connected,loading:e.secondBrainLoading??!1,error:e.secondBrainError??null,subtab:e.secondBrainSubtab??"identity",identity:e.secondBrainIdentity??null,memoryBank:e.secondBrainMemoryBank??null,aiPacket:e.secondBrainAiPacket??null,sourcesData:e.secondBrainSourcesData??null,selectedEntry:e.secondBrainSelectedEntry??null,searchQuery:e.secondBrainSearchQuery??"",syncing:e.secondBrainSyncing??!1,browsingFolder:e.secondBrainBrowsingFolder??null,folderEntries:e.secondBrainFolderEntries??null,folderName:e.secondBrainFolderName??null,onSubtabChange:c=>e.handleSecondBrainSubtabChange(c),onSelectEntry:c=>e.handleSecondBrainSelectEntry(c),onOpenInBrowser:c=>e.handleSecondBrainOpenInBrowser(c),onBrowseFolder:c=>e.handleSecondBrainBrowseFolder(c),onBack:()=>e.handleSecondBrainBack(),onSearch:c=>e.handleSecondBrainSearch(c),onSync:()=>e.handleSecondBrainSync(),onRefresh:()=>e.handleSecondBrainRefresh(),onOpenSidebar:(c,g)=>e.handleOpenSidebar(c,g),researchData:e.secondBrainResearchData??null,researchAddFormOpen:e.secondBrainResearchAddFormOpen??!1,researchAddForm:e.secondBrainResearchAddForm,researchCategories:e.secondBrainResearchCategories??[],onResearchAddFormToggle:()=>e.handleResearchAddFormToggle(),onResearchAddFormChange:(c,g)=>e.handleResearchAddFormChange(c,g),onResearchAddSubmit:()=>e.handleResearchAddSubmit(),onSaveViaChat:()=>e.handleResearchSaveViaChat(),communityResources:e.secondBrainCommunityResources??null,communityResourceAddFormOpen:e.secondBrainCommunityResourceAddFormOpen??!1,communityResourceAddForm:e.secondBrainCommunityResourceAddForm,onCommunityResourceAdd:()=>e.handleCommunityResourceAdd(),onCommunityResourceRemove:c=>e.handleCommunityResourceRemove(c),onCommunityResourceAddFormToggle:()=>e.handleCommunityResourceAddFormToggle(),onCommunityResourceAddFormChange:(c,g)=>e.handleCommunityResourceAddFormChange(c,g),onAddSource:()=>e.handleAddSource(),fileTree:e.secondBrainFileTree??null,fileTreeLoading:e.secondBrainFileTreeLoading??!1,fileSearchQuery:e.secondBrainFileSearchQuery??"",fileSearchResults:e.secondBrainFileSearchResults??null,onFileTreeRefresh:()=>e.handleSecondBrainFileTreeRefresh(),onFileSearch:c=>e.handleSecondBrainFileSearch(c),onFileSelect:c=>e.handleSecondBrainFileSelect(c),intelProps:(e.secondBrainSubtab??"identity")==="intel"?{insights:e.intelInsights??[],discoveries:e.intelDiscoveries??[],patterns:e.intelPatterns??null,status:e.intelStatus??null,loading:e.intelLoading??!1,error:e.intelError??null,onDismiss:c=>e.handleIntelDismiss(c),onAct:c=>e.handleIntelAct(c),onRefresh:()=>e.handleIntelRefresh()}:void 0,vaultHealth:e.secondBrainVaultHealth??null}):p}

        ${e.tab==="dashboards"?e.dynamicSlots.dashboards?r`<div class="dynamic-slot">${Ae(rd(e.dynamicSlots.dashboards))}</div>`:T2({connected:e.connected,loading:e.dashboardsLoading??!1,error:e.dashboardsError??null,dashboards:e.dashboardsList,activeDashboardId:e.activeDashboardId??null,activeDashboardHtml:e.activeDashboardHtml??null,activeDashboardManifest:e.activeDashboardManifest??null,isWorking:e.activeDashboardManifest?.sessionId?e.workingSessions.has(e.activeDashboardManifest.sessionId):!1,onSelectDashboard:c=>e.handleDashboardSelect(c),onDeleteDashboard:c=>e.handleDashboardDelete(c),onCreateViaChat:c=>e.handleDashboardCreateViaChat(c),onTogglePin:c=>e.handleDashboardTogglePin(c),categoryFilter:e.dashboardCategoryFilter??null,onCategoryFilter:c=>e.handleDashboardCategoryFilter(c),onBack:()=>e.handleDashboardBack(),onRefresh:()=>e.handleDashboardsRefresh(),onOpenSession:c=>e.handleDashboardOpenSession(c)}):p}

        ${e.tab==="config"?uk({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:c=>{e.configRaw=c},onFormModeChange:c=>e.configFormMode=c,onFormPatch:(c,g)=>nn(e,c,g),onSearchChange:c=>e.configSearchQuery=c,onSectionChange:c=>{e.configActiveSection=c,e.configActiveSubsection=null},onSubsectionChange:c=>e.configActiveSubsection=c,onReload:()=>Ze(e),onSave:()=>Ms(e),onApply:()=>vh(e),onUpdate:()=>Ar(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(c,g)=>e.handleUpdateUserProfile(c,g),onModelSwitch:(c,g)=>bh(e,c,g)}):p}

        ${e.tab==="debug"?xk({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:c=>e.debugCallMethod=c,onCallParamsChange:c=>e.debugCallParams=c,onRefresh:()=>la(e),onCall:()=>hy(e)}):p}

        ${e.tab==="logs"?Dk({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:c=>e.logsFilterText=c,onLevelToggle:(c,g)=>{e.logsLevelFilters={...e.logsLevelFilters,[c]:g}},onToggleAutoFollow:c=>e.logsAutoFollow=c,onRefresh:()=>So(e,{reset:!0}),onExport:(c,g)=>e.exportLogs(c,g),onScroll:c=>e.handleLogsScroll(c)}):p}
      </main>
      ${e.tab!=="chat"?Rw({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:c=>e.handleAllyDraftChange(c),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:c=>e.handleAllyAttachmentsChange(c),onAction:(c,g,k,A)=>e.handleAllyAction(c,g,k,A)}):p}
      ${_k(e)}
      ${Ck(e)}
      ${Rk(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Mi({slug:e.sidebarProofSlug,title:e.sidebarTitle,viewUrl:e.sidebarProofUrl,filePath:e.sidebarFilePath,onClose:()=>e.handleCloseProofDoc(),onPushToDrive:(c,g)=>e.handlePushToDrive(c,g)}):Di({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:c=>e.handleOpenFile(c),onPushToDrive:(c,g)=>e.handlePushToDrive(c,g),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:p}
      ${kS({toasts:e.toasts,onDismiss:c=>e.dismissToast(c)})}
      ${wS(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:c=>e.handleLightboxNav(c)})}
    </div>
  `}async function J2(e){}async function X2(e){}async function Z2(e,t){}async function eA(e){}async function tA(e){}async function nA(e){}async function Go(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function Cp(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await Go(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function sA(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await Cp(e,[...n,t.trim()])}async function aA(e,t){const n=e.trustTrackerData?.workflows??[];await Cp(e,n.filter(s=>s!==t))}async function iA(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await Go(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const oA=6e4,Sc=15,Ac=new Set;let Ls=null;async function xc(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+Sc*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const a of s.events??[]){if(Ac.has(a.id))continue;const i=new Date(a.startTime),o=Math.round((i.getTime()-t.getTime())/6e4);if(o>0&&o<=Sc){Ac.add(a.id);const l=i.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),d=a.location?` @ ${a.location}`:"",u=`${a.title} starts in ${o} min (${l})${d}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function rA(e){Rp(),xc(e),Ls=setInterval(()=>{xc(e)},oA)}function Rp(){Ls&&(clearInterval(Ls),Ls=null)}let lA=0;function cA(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${lA++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function dA(e,t){return e.filter(n=>n.id!==t)}function uA(e,t){return[...e,t]}var pA=Object.defineProperty,hA=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var a=s>1?void 0:s?hA(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&pA(t,n,a),a};function ci(){return zm()}function As(){return Wm()}function fA(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function gA(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>s.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const i=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return i&&i.length>=8&&i.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const Tc=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),mA=["path","filePath","file","workspacePath"];let v=class extends on{constructor(){super(...arguments),this.settings=Db(),this.password="",this.tab="chat",this.onboarding=fA(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=ci().name,this.assistantAvatar=ci().avatar,this.assistantAgentId=ci().agentId??null,this.userName=As().name,this.userAvatar=As().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=fp(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Yb},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=ce(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Qb},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainResearchAddFormOpen=!1,this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""},this.secondBrainResearchCategories=[],this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Iu(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=As();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=As();this.userAvatar=t.avatar}uw(this);const e=ce();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),rA(this),this._restorePrivateSessions()}firstUpdated(){pw(this)}disconnectedCallback(){Rp(),this._stopPrivateSessionTimer(),hw(this),super.disconnectedCallback()}updated(e){gw(this,e)}connect(){ko(this)}handleChatScroll(e){Oh(this,e)}handleLogsScroll(e){Fh(this,e)}exportLogs(e,t){Nh(e,t)}resetToolStream(){Qi(this),this.sessionResources=[]}resetChatScroll(){ea(this)}async loadAssistantIdentity(){await xd(this)}applySettings(e){et(this,e)}setTab(e){Oo(this,e)}setTheme(e,t){_u(this,e,t)}async loadOverview(){await Bo(this)}async loadCron(){await fa(this)}async handleAbortChat(){await Uo(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await J2()}async handleFocusPulseStartMorning(){await X2(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await R(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>rt);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await Z2()}async handleFocusPulseComplete(){await eA()}async handleFocusPulsePulseCheck(){await tA()}async handleFocusPulseEndDay(){await nA()}async handleTrustLoad(){await Go(this)}async handleTrustAddWorkflow(e){await sA(this,e)}async handleTrustRemoveWorkflow(e){await aA(this,e)}async handleDailyRate(e,t){await iA(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await R(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>Zt);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await R(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>Zt);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await R(async()=>{const{updateGuardrailThreshold:a}=await Promise.resolve().then(()=>Zt);return{updateGuardrailThreshold:a}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await R(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>Zt);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await R(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>Zt);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await R(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>Zt);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await R(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>ot);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await R(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>ot);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await R(async()=>{const{approveCodingTask:a,approveQueueItem:i}=await Promise.resolve().then(()=>ot);return{approveCodingTask:a,approveQueueItem:i}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await R(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>ot);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await R(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>ot);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Je);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>Pn);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await R(async()=>{const{selectSwarmProject:n}=await Promise.resolve().then(()=>ot);return{selectSwarmProject:n}},void 0,import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,n){const{steerSwarmAgent:s}=await R(async()=>{const{steerSwarmAgent:a}=await Promise.resolve().then(()=>ot);return{steerSwarmAgent:a}},void 0,import.meta.url);await s(this,e,t,n)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const a=`## Task Files

${n.map(i=>`- **${i.name}** (${i.type}, ${(i.size/1024).toFixed(1)} KB)
  \`${i.path}\``).join(`

`)}`;this.handleOpenSidebar(a,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(a){console.error("[Ally] Action RPC failed:",a),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=jh(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let a;if(t.length>0){const d=[];for(const u of t){if(!u.dataUrl)continue;const h=u.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!h)continue;const[,f,m]=h;f.startsWith("image/")&&d.push({type:"image",mimeType:f,content:m,fileName:u.fileName})}if(d.length>0){a=d;try{await this.client?.request("images.cache",{images:d.map(u=>({data:u.content,mimeType:u.mimeType,fileName:u.fileName})),sessionKey:Q})}catch{}}}const i=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:Q,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:Q,message:s,deliver:!1,channel:"webchat",idempotencyKey:i,attachments:a}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,l=setInterval(async()=>{if(!this.allyWorking){clearInterval(l);return}try{await this._loadAllyHistory();const d=this.allyMessages[this.allyMessages.length-1];d&&d.role==="assistant"&&d.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(l),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(l),12e4)}catch(a){const i=a instanceof Error?a.message:String(a);console.error("[Ally] Failed to send ally message:",i),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${i}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...this.settings.tabLastViewed,[Q]:Date.now()}}),this.sessionKey=Q,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),R(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>Je);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:Q,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await R(async()=>{const{extractText:a,formatApiError:i}=await Promise.resolve().then(()=>Xg);return{extractText:a,formatApiError:i}},void 0,import.meta.url);this.allyMessages=e.messages.map(a=>{const i=a.role??"assistant",o=i.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const l=a;if(l.toolCallId||l.tool_call_id||l.toolName||l.tool_name)return null;if(Array.isArray(a.content)){const f=a.content;if(!f.some(w=>{const $=(typeof w.type=="string"?w.type:"").toLowerCase();return($==="text"||$==="")&&typeof w.text=="string"&&w.text.trim().length>0})&&f.some($=>{const c=(typeof $.type=="string"?$.type:"").toLowerCase();return c==="tool_use"||c==="tool_result"||c==="toolresult"||c==="tooluse"}))return null}let d=t(a);if(!d)return null;const u=n(d);if(u&&(d=u),d=d.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!d)return null;const h=gA(d,i);return h?{role:o==="user"?"user":"assistant",content:h,timestamp:a.timestamp}:null}).filter(a=>a!==null);const s=[];for(const a of this.allyMessages){const i=s[s.length-1];i&&i.role===a.role&&i.content===a.content||s.push(a)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,userRating:n,feedbackPending:s}:a),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(i=>i.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,feedbackPending:!1}:a).filter(a=>!(a.id===e&&a.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(a=>a.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await R(async()=>{const{createNewSession:a}=await Promise.resolve().then(()=>rt);return{createNewSession:a}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await R(async()=>{const{autoTitleCache:a}=await Promise.resolve().then(()=>Pn);return{autoTitleCache:a}},void 0,import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const a=await this.client.request("queue.readOutput",{path:t.outputPath});a?.content&&await this.seedSessionWithAgentOutput(t.title,a.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),a=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",i=[`Agent completed **${e}**.`,"",a,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await R(async()=>{const{sendChatMessage:l}=await Promise.resolve().then(()=>Je);return{sendChatMessage:l}},void 0,import.meta.url);await o(this,i)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await R(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>ot);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await R(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await R(async()=>{const{loadDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:a}=await R(async()=>{const{autoTitleCache:l}=await Promise.resolve().then(()=>Pn);return{autoTitleCache:l}},void 0,import.meta.url);a.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:i}=await R(async()=>{const{saveDraft:l}=await Promise.resolve().then(()=>Ya);return{saveDraft:l}},void 0,import.meta.url);i(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await R(async()=>{const{loadChatHistory:l}=await Promise.resolve().then(()=>Je);return{loadChatHistory:l}},void 0,import.meta.url);await o(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await R(async()=>{const{deleteDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await R(async()=>{const{toggleDashboardPin:n}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await R(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>rt);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,R(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>Ya);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,R(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>Je);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await R(async()=>{const{syncUrlWithSessionKey:a}=await Promise.resolve().then(()=>qb);return{syncUrlWithSessionKey:a}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await R(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await R(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await R(async()=>{const{loadSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,e==="intel"?this.handleIntelLoad().catch(t=>{console.error("[Intel] Load after subtab change failed:",t),this.intelError=t instanceof Error?t.message:"Failed to load intel data"}):e==="files"?this.handleSecondBrainFileTreeRefresh().catch(t=>{console.error("[SecondBrain] File tree load after subtab change failed:",t)}):this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await R(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainOpenInBrowser(e){try{if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")){window.open(e,"_blank","noopener,noreferrer");return}const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=new Blob([t.content],{type:"text/html"}),s=URL.createObjectURL(n);window.open(s,"_blank","noopener,noreferrer")}}catch(t){console.error("[SecondBrain] Failed to open in browser:",t)}}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await R(async()=>{const{browseFolder:n}=await import("./second-brain-ghSM5E6X.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await R(async()=>{const{syncSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}async handleSecondBrainFileTreeRefresh(){if(!(!this.client||!this.connected)){this.secondBrainFileTreeLoading=!0;try{const e=await this.client.request("secondBrain.fileTree",{depth:4});this.secondBrainFileTree=e.tree??[]}catch(e){console.error("[SecondBrain] fileTree failed:",e)}finally{this.secondBrainFileTreeLoading=!1}}}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}handleResearchAddFormToggle(){this.secondBrainResearchAddFormOpen=!this.secondBrainResearchAddFormOpen,this.secondBrainResearchAddFormOpen&&(this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""})}handleResearchAddFormChange(e,t){this.secondBrainResearchAddForm={...this.secondBrainResearchAddForm,[e]:t}}async handleResearchAddSubmit(){const{addResearch:e}=await R(async()=>{const{addResearch:t}=await import("./second-brain-ghSM5E6X.js");return{addResearch:t}},[],import.meta.url);await e(this)}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>rt);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>rt);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}async handleCommunityResourceAdd(){const{addCommunityResource:e}=await R(async()=>{const{addCommunityResource:t}=await import("./second-brain-ghSM5E6X.js");return{addCommunityResource:t}},[],import.meta.url);await e(this)}async handleCommunityResourceRemove(e){const{removeCommunityResource:t}=await R(async()=>{const{removeCommunityResource:n}=await import("./second-brain-ghSM5E6X.js");return{removeCommunityResource:n}},[],import.meta.url);await t(this,e)}handleCommunityResourceAddFormToggle(){this.secondBrainCommunityResourceAddFormOpen=!this.secondBrainCommunityResourceAddFormOpen,this.secondBrainCommunityResourceAddFormOpen&&(this.secondBrainCommunityResourceAddForm={url:"",label:"",description:"",tags:""})}handleCommunityResourceAddFormChange(e,t){this.secondBrainCommunityResourceAddForm={...this.secondBrainCommunityResourceAddForm,[e]:t}}removeQueuedMessage(e){Fu(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,a=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((a>0?s/a:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),l=e==null?[...this.chatAttachments??[]]:[];if(o||l.length>0){this.pendingRetry={message:o,attachments:l,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await Nu(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Sh(this,e)}async handleWhatsAppWait(){await Ah(this)}async handleWhatsAppLogout(){await xh(this)}async handleChannelConfigSave(){await Th(this)}async handleChannelConfigReload(){await _h(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await Cd(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){Rh(this,e,t)}handleNostrProfileCancel(){Eh(this)}handleNostrProfileFieldChange(e,t){Ph(this,e,t)}async handleNostrProfileSave(){await Ih(this)}async handleNostrProfileImport(){await Dh(this)}handleNostrProfileToggleAdvanced(){Lh(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,et(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("files.read",{path:e}),n=e.split(".").pop()?.toLowerCase()??"",s=t.contentType??t.mime??(n==="md"?"text/markdown":null),a=e.split("/").pop()??e;this.handleOpenSidebar(t.content,{mimeType:s,filePath:e,title:a}),t.truncated&&this.showToast(`Opened truncated file: ${e}`,"warning")}catch(t){console.error("[Chat] Failed to open file:",t),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),a=t?` to ${t.split("@")[0]}`:"",i=s?.message??`Uploaded${a} to Google Drive`,o=s?.driveUrl;this.showToast(i,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const a=s?.results?.filter(o=>o.success).length??0,i=s?.results?.length??e.length;a===i?this.showToast(`Uploaded ${a} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${a}/${i} files (${i-a} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=fS(e,t,n)}handleLightboxClose(){this.lightbox=gS()}handleLightboxNav(e){this.lightbox=mS(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const a=s.trim();!a||t.has(a)||(t.add(a),e.push(a))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const a of s.workspaces??[])n(a.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let u=t.slice(7);u.startsWith("/~/")&&(u="~"+u.slice(2));try{u=decodeURIComponent(u)}catch{}n.push(u);const h=[],f=new Set;for(const m of n){const w=this.normalizeWorkspacePathCandidate(m,{allowAbsolute:!0});!w||f.has(w)||(f.add(w),h.push(w))}return h}const a=/^[a-z][a-z0-9+.-]*:/i.test(t),i=/^[a-z]:[\\/]/i.test(t);(!a||i)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const $ of mA){const c=o.searchParams.get($);c&&n.push(c)}const h=(t.split("#")[0]??"").split("?")[0]??"";h.length>0&&!h.startsWith("/")&&!h.includes("://")&&n.push(h);let m=o.pathname;this.basePath&&m.startsWith(`${this.basePath}/`)?m=m.slice(this.basePath.length):this.basePath&&m===this.basePath&&(m="");const w=m.startsWith("/")?m.slice(1):m;if(w){n.push(w);const $=w.indexOf("/");if($>0){const c=w.slice(0,$).toLowerCase();Tc.has(c)&&n.push(w.slice($+1))}}if(m.startsWith("/")&&w){const $=w.split("/")[0]?.toLowerCase()??"";Tc.has($)||n.push(m)}}const l=[],d=new Set;for(const u of n){let h=u;try{h=decodeURIComponent(u)}catch{}const f=this.normalizeWorkspacePathCandidate(h,{allowAbsolute:!0});!f||d.has(f)||(d.add(f),l.push(f))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const a=cA(e,t,n,s);this.toasts=uA(this.toasts,a),n>0&&window.setTimeout(()=>{this.dismissToast(a.id)},n)}dismissToast(e){this.toasts=dA(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await Vs(this),this._loadDecisionCards()}_loadDecisionCards(){R(()=>Promise.resolve().then(()=>Nn),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:ce(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await R(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(i=>i.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),a=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:a})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:i}=await R(async()=>{const{autoTitleCache:l}=await Promise.resolve().then(()=>Pn);return{autoTitleCache:l}},void 0,import.meta.url);i.set(n,t.task.title);const{hostPatchSession:o}=await R(async()=>{const{hostPatchSession:l}=await Promise.resolve().then(()=>Gv);return{hostPatchSession:l}},void 0,import.meta.url);o(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:a}=await R(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>Je);return{loadChatHistory:i}},void 0,import.meta.url);await a(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=ce(e),Fn(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=ce(),n=ce(e);n>t||(this.todaySelectedDate=n,Fn(this))}handleDateToday(){this.todaySelectedDate=ce(),Vs(this)}async handleDailyBriefRefresh(){await Fn(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await Fn(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;bu(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),R(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>rt);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(a=>a!==e),s=n[0]||Q;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await R(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>Je);return{loadChatHistory:a}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,a])=>a>n);if(this.privateSessions=new Map(s),s.length!==t.length){const a=t.filter(([,i])=>i<=n);for(const[i]of a)this._destroyPrivateSession(i)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([wu(this),$u(this)])}async handleResourcePin(e,t){await rb(this,e,t)}async handleResourceDelete(e){await lb(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const e=await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20});this.sessionResources=e.resources??[]}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||ob(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await pa(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await R(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>he);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await R(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>he);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await R(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>he);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>rt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>rt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}R(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>Ya);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>Pn);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Je);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(a=>{console.error("[Support] Failed to load chat history:",a)})})}handleWizardOpen(){R(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>zS);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const a of e.files??[])n[a.path]=a.wouldCreate;const s={};if(t){for(const a of t.additions)s[a.path]=!0;for(const a of t.changes)s[a.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){R(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),R(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){R(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){R(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){R(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(n?.content){this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(n){console.error("[Inbox] Failed to load output file:",n)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const a=await this.client.request("proof.get",{slug:e});t=a.title?.trim()||t,n=a.filePath?.trim()||null,s=a.viewUrl?.trim()||null}catch(a){console.warn("[Proof] Failed to resolve document metadata:",a)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return Y2(this)}};y([b()],v.prototype,"settings",2);y([b()],v.prototype,"password",2);y([b()],v.prototype,"tab",2);y([b()],v.prototype,"onboarding",2);y([b()],v.prototype,"connected",2);y([b()],v.prototype,"reconnecting",2);y([b()],v.prototype,"reconnectAttempt",2);y([b()],v.prototype,"theme",2);y([b()],v.prototype,"themeResolved",2);y([b()],v.prototype,"hello",2);y([b()],v.prototype,"lastError",2);y([b()],v.prototype,"eventLog",2);y([b()],v.prototype,"assistantName",2);y([b()],v.prototype,"assistantAvatar",2);y([b()],v.prototype,"assistantAgentId",2);y([b()],v.prototype,"userName",2);y([b()],v.prototype,"userAvatar",2);y([b()],v.prototype,"sessionKey",2);y([b()],v.prototype,"sessionPickerOpen",2);y([b()],v.prototype,"sessionPickerPosition",2);y([b()],v.prototype,"sessionPickerSearch",2);y([b()],v.prototype,"sessionSearchOpen",2);y([b()],v.prototype,"sessionSearchPosition",2);y([b()],v.prototype,"sessionSearchQuery",2);y([b()],v.prototype,"sessionSearchResults",2);y([b()],v.prototype,"sessionSearchLoading",2);y([b()],v.prototype,"profilePopoverOpen",2);y([b()],v.prototype,"profileEditName",2);y([b()],v.prototype,"profileEditAvatar",2);y([b()],v.prototype,"editingTabKey",2);y([b()],v.prototype,"chatLoading",2);y([b()],v.prototype,"chatSending",2);y([b()],v.prototype,"chatSendingSessionKey",2);y([b()],v.prototype,"chatMessage",2);y([b()],v.prototype,"chatDrafts",2);y([b()],v.prototype,"chatMessages",2);y([b()],v.prototype,"chatToolMessages",2);y([b()],v.prototype,"chatStream",2);y([b()],v.prototype,"chatStreamStartedAt",2);y([b()],v.prototype,"chatRunId",2);y([b()],v.prototype,"currentToolName",2);y([b()],v.prototype,"currentToolInfo",2);y([b()],v.prototype,"workingSessions",2);y([b()],v.prototype,"compactionStatus",2);y([b()],v.prototype,"chatAvatarUrl",2);y([b()],v.prototype,"chatThinkingLevel",2);y([b()],v.prototype,"chatQueue",2);y([b()],v.prototype,"chatAttachments",2);y([b()],v.prototype,"pendingRetry",2);y([b()],v.prototype,"autoRetryAfterCompact",2);y([b()],v.prototype,"sidebarOpen",2);y([b()],v.prototype,"sidebarContent",2);y([b()],v.prototype,"sidebarError",2);y([b()],v.prototype,"sidebarMimeType",2);y([b()],v.prototype,"sidebarFilePath",2);y([b()],v.prototype,"sidebarTitle",2);y([b()],v.prototype,"sidebarMode",2);y([b()],v.prototype,"sidebarProofSlug",2);y([b()],v.prototype,"sidebarProofUrl",2);y([b()],v.prototype,"sidebarProofHtml",2);y([b()],v.prototype,"splitRatio",2);y([b()],v.prototype,"lightbox",2);y([b()],v.prototype,"driveAccounts",2);y([b()],v.prototype,"showDrivePicker",2);y([b()],v.prototype,"driveUploading",2);y([b()],v.prototype,"updateStatus",2);y([b()],v.prototype,"updateLoading",2);y([b()],v.prototype,"updateError",2);y([b()],v.prototype,"updateLastChecked",2);y([b()],v.prototype,"nodesLoading",2);y([b()],v.prototype,"nodes",2);y([b()],v.prototype,"devicesLoading",2);y([b()],v.prototype,"devicesError",2);y([b()],v.prototype,"devicesList",2);y([b()],v.prototype,"execApprovalsLoading",2);y([b()],v.prototype,"execApprovalsSaving",2);y([b()],v.prototype,"execApprovalsDirty",2);y([b()],v.prototype,"execApprovalsSnapshot",2);y([b()],v.prototype,"execApprovalsForm",2);y([b()],v.prototype,"execApprovalsSelectedAgent",2);y([b()],v.prototype,"execApprovalsTarget",2);y([b()],v.prototype,"execApprovalsTargetNodeId",2);y([b()],v.prototype,"execApprovalQueue",2);y([b()],v.prototype,"execApprovalBusy",2);y([b()],v.prototype,"execApprovalError",2);y([b()],v.prototype,"pendingGatewayUrl",2);y([b()],v.prototype,"gatewayRestartPending",2);y([b()],v.prototype,"gatewayRestartBusy",2);y([b()],v.prototype,"configLoading",2);y([b()],v.prototype,"configRaw",2);y([b()],v.prototype,"configRawOriginal",2);y([b()],v.prototype,"configValid",2);y([b()],v.prototype,"configIssues",2);y([b()],v.prototype,"configSaving",2);y([b()],v.prototype,"configApplying",2);y([b()],v.prototype,"updateRunning",2);y([b()],v.prototype,"applySessionKey",2);y([b()],v.prototype,"configSnapshot",2);y([b()],v.prototype,"configSchema",2);y([b()],v.prototype,"configSchemaVersion",2);y([b()],v.prototype,"configSchemaLoading",2);y([b()],v.prototype,"configUiHints",2);y([b()],v.prototype,"configForm",2);y([b()],v.prototype,"configFormOriginal",2);y([b()],v.prototype,"configFormDirty",2);y([b()],v.prototype,"configFormMode",2);y([b()],v.prototype,"configSearchQuery",2);y([b()],v.prototype,"configActiveSection",2);y([b()],v.prototype,"configActiveSubsection",2);y([b()],v.prototype,"channelsLoading",2);y([b()],v.prototype,"channelsSnapshot",2);y([b()],v.prototype,"channelsError",2);y([b()],v.prototype,"channelsLastSuccess",2);y([b()],v.prototype,"whatsappLoginMessage",2);y([b()],v.prototype,"whatsappLoginQrDataUrl",2);y([b()],v.prototype,"whatsappLoginConnected",2);y([b()],v.prototype,"whatsappBusy",2);y([b()],v.prototype,"nostrProfileFormState",2);y([b()],v.prototype,"nostrProfileAccountId",2);y([b()],v.prototype,"presenceLoading",2);y([b()],v.prototype,"presenceEntries",2);y([b()],v.prototype,"presenceError",2);y([b()],v.prototype,"presenceStatus",2);y([b()],v.prototype,"agentsLoading",2);y([b()],v.prototype,"agentsList",2);y([b()],v.prototype,"agentsError",2);y([b()],v.prototype,"sessionsLoading",2);y([b()],v.prototype,"sessionsResult",2);y([b()],v.prototype,"sessionsError",2);y([b()],v.prototype,"sessionsFilterActive",2);y([b()],v.prototype,"sessionsFilterLimit",2);y([b()],v.prototype,"sessionsIncludeGlobal",2);y([b()],v.prototype,"sessionsIncludeUnknown",2);y([b()],v.prototype,"archivedSessions",2);y([b()],v.prototype,"archivedSessionsLoading",2);y([b()],v.prototype,"archivedSessionsExpanded",2);y([b()],v.prototype,"cronLoading",2);y([b()],v.prototype,"cronJobs",2);y([b()],v.prototype,"cronStatus",2);y([b()],v.prototype,"cronError",2);y([b()],v.prototype,"cronForm",2);y([b()],v.prototype,"cronRunsJobId",2);y([b()],v.prototype,"cronRuns",2);y([b()],v.prototype,"cronBusy",2);y([b()],v.prototype,"workspaceNeedsSetup",2);y([b()],v.prototype,"onboardingPhase",2);y([b()],v.prototype,"onboardingData",2);y([b()],v.prototype,"onboardingActive",2);y([b()],v.prototype,"wizardActive",2);y([b()],v.prototype,"wizardState",2);y([b()],v.prototype,"showSetupTab",2);y([b()],v.prototype,"setupCapabilities",2);y([b()],v.prototype,"setupCapabilitiesLoading",2);y([b()],v.prototype,"setupQuickDone",2);y([b()],v.prototype,"onboardingIntegrations",2);y([b()],v.prototype,"onboardingCoreProgress",2);y([b()],v.prototype,"onboardingExpandedCard",2);y([b()],v.prototype,"onboardingLoadingGuide",2);y([b()],v.prototype,"onboardingActiveGuide",2);y([b()],v.prototype,"onboardingTestingId",2);y([b()],v.prototype,"onboardingTestResult",2);y([b()],v.prototype,"onboardingConfigValues",2);y([b()],v.prototype,"onboardingProgress",2);y([b()],v.prototype,"workspaces",2);y([b()],v.prototype,"selectedWorkspace",2);y([b()],v.prototype,"workspacesSearchQuery",2);y([b()],v.prototype,"workspaceItemSearchQuery",2);y([b()],v.prototype,"workspacesLoading",2);y([b()],v.prototype,"workspacesCreateLoading",2);y([b()],v.prototype,"workspacesError",2);y([b()],v.prototype,"workspaceExpandedFolders",2);y([b()],v.prototype,"allTasks",2);y([b()],v.prototype,"taskFilter",2);y([b()],v.prototype,"taskSort",2);y([b()],v.prototype,"taskSearch",2);y([b()],v.prototype,"showCompletedTasks",2);y([b()],v.prototype,"editingTaskId",2);y([b()],v.prototype,"workspaceBrowsePath",2);y([b()],v.prototype,"workspaceBrowseEntries",2);y([b()],v.prototype,"workspaceBreadcrumbs",2);y([b()],v.prototype,"workspaceBrowseSearchQuery",2);y([b()],v.prototype,"workspaceBrowseSearchResults",2);y([b()],v.prototype,"myDayLoading",2);y([b()],v.prototype,"myDayError",2);y([b()],v.prototype,"todaySelectedDate",2);y([b()],v.prototype,"todayViewMode",2);y([b()],v.prototype,"dailyBrief",2);y([b()],v.prototype,"dailyBriefLoading",2);y([b()],v.prototype,"dailyBriefError",2);y([b()],v.prototype,"agentLog",2);y([b()],v.prototype,"agentLogLoading",2);y([b()],v.prototype,"agentLogError",2);y([b()],v.prototype,"briefNotes",2);y([b()],v.prototype,"todayTasks",2);y([b()],v.prototype,"todayTasksLoading",2);y([b()],v.prototype,"todayEditingTaskId",2);y([b()],v.prototype,"todayShowCompleted",2);y([b()],v.prototype,"allyPanelOpen",2);y([b()],v.prototype,"allyMessages",2);y([b()],v.prototype,"allyStream",2);y([b()],v.prototype,"allyDraft",2);y([b()],v.prototype,"allyUnread",2);y([b()],v.prototype,"allySending",2);y([b()],v.prototype,"allyWorking",2);y([b()],v.prototype,"allyAttachments",2);y([b()],v.prototype,"todayQueueResults",2);y([b()],v.prototype,"inboxItems",2);y([b()],v.prototype,"inboxLoading",2);y([b()],v.prototype,"inboxCount",2);y([b()],v.prototype,"inboxScoringId",2);y([b()],v.prototype,"inboxScoringValue",2);y([b()],v.prototype,"inboxFeedbackText",2);y([b()],v.prototype,"chatPrivateMode",2);y([b()],v.prototype,"privateSessions",2);y([b()],v.prototype,"dynamicSlots",2);y([b()],v.prototype,"workProjects",2);y([b()],v.prototype,"workLoading",2);y([b()],v.prototype,"workError",2);y([b()],v.prototype,"workExpandedProjects",2);y([b()],v.prototype,"workProjectFiles",2);y([b()],v.prototype,"workDetailLoading",2);y([b()],v.prototype,"workResources",2);y([b()],v.prototype,"workResourcesLoading",2);y([b()],v.prototype,"workResourceFilter",2);y([b()],v.prototype,"sessionResources",2);y([b()],v.prototype,"sessionResourcesCollapsed",2);y([b()],v.prototype,"skillsLoading",2);y([b()],v.prototype,"skillsReport",2);y([b()],v.prototype,"skillsError",2);y([b()],v.prototype,"skillsFilter",2);y([b()],v.prototype,"skillEdits",2);y([b()],v.prototype,"skillsBusyKey",2);y([b()],v.prototype,"skillMessages",2);y([b()],v.prototype,"skillsSubTab",2);y([b()],v.prototype,"godmodeSkills",2);y([b()],v.prototype,"godmodeSkillsLoading",2);y([b()],v.prototype,"expandedSkills",2);y([b()],v.prototype,"rosterData",2);y([b()],v.prototype,"rosterLoading",2);y([b()],v.prototype,"rosterError",2);y([b()],v.prototype,"rosterFilter",2);y([b()],v.prototype,"expandedAgents",2);y([b()],v.prototype,"debugLoading",2);y([b()],v.prototype,"debugStatus",2);y([b()],v.prototype,"debugHealth",2);y([b()],v.prototype,"debugModels",2);y([b()],v.prototype,"debugHeartbeat",2);y([b()],v.prototype,"debugCallMethod",2);y([b()],v.prototype,"debugCallParams",2);y([b()],v.prototype,"debugCallResult",2);y([b()],v.prototype,"debugCallError",2);y([b()],v.prototype,"logsLoading",2);y([b()],v.prototype,"logsError",2);y([b()],v.prototype,"logsFile",2);y([b()],v.prototype,"logsEntries",2);y([b()],v.prototype,"logsFilterText",2);y([b()],v.prototype,"logsLevelFilters",2);y([b()],v.prototype,"logsAutoFollow",2);y([b()],v.prototype,"logsTruncated",2);y([b()],v.prototype,"logsCursor",2);y([b()],v.prototype,"logsLastFetchAt",2);y([b()],v.prototype,"logsLimit",2);y([b()],v.prototype,"logsMaxBytes",2);y([b()],v.prototype,"logsAtBottom",2);y([b()],v.prototype,"toasts",2);y([b()],v.prototype,"chatUserNearBottom",2);y([b()],v.prototype,"chatNewMessagesBelow",2);y([b()],v.prototype,"consciousnessStatus",2);y([b()],v.prototype,"focusPulseData",2);y([b()],v.prototype,"trustTrackerData",2);y([b()],v.prototype,"trustTrackerLoading",2);y([b()],v.prototype,"guardrailsData",2);y([b()],v.prototype,"guardrailsLoading",2);y([b()],v.prototype,"guardrailsShowAddForm",2);y([b()],v.prototype,"missionControlData",2);y([b()],v.prototype,"missionControlLoading",2);y([b()],v.prototype,"missionControlError",2);y([b()],v.prototype,"missionControlFullControl",2);y([b()],v.prototype,"godmodeOptions",2);y([b()],v.prototype,"godmodeOptionsLoading",2);y([b()],v.prototype,"dashboardsList",2);y([b()],v.prototype,"dashboardsLoading",2);y([b()],v.prototype,"dashboardsError",2);y([b()],v.prototype,"activeDashboardId",2);y([b()],v.prototype,"activeDashboardHtml",2);y([b()],v.prototype,"activeDashboardManifest",2);y([b()],v.prototype,"dashboardChatOpen",2);y([b()],v.prototype,"dashboardCategoryFilter",2);y([b()],v.prototype,"secondBrainSubtab",2);y([b()],v.prototype,"secondBrainLoading",2);y([b()],v.prototype,"secondBrainError",2);y([b()],v.prototype,"secondBrainIdentity",2);y([b()],v.prototype,"secondBrainMemoryBank",2);y([b()],v.prototype,"secondBrainAiPacket",2);y([b()],v.prototype,"secondBrainSourcesData",2);y([b()],v.prototype,"secondBrainResearchData",2);y([b()],v.prototype,"secondBrainResearchAddFormOpen",2);y([b()],v.prototype,"secondBrainResearchAddForm",2);y([b()],v.prototype,"secondBrainResearchCategories",2);y([b()],v.prototype,"secondBrainSelectedEntry",2);y([b()],v.prototype,"secondBrainSearchQuery",2);y([b()],v.prototype,"secondBrainSyncing",2);y([b()],v.prototype,"secondBrainBrowsingFolder",2);y([b()],v.prototype,"secondBrainFolderEntries",2);y([b()],v.prototype,"secondBrainFolderName",2);y([b()],v.prototype,"secondBrainFileTree",2);y([b()],v.prototype,"secondBrainFileTreeLoading",2);y([b()],v.prototype,"secondBrainFileSearchQuery",2);y([b()],v.prototype,"secondBrainFileSearchResults",2);v=y([Ic("godmode-app")],v);
