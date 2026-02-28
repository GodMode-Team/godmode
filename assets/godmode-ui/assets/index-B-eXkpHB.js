(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const Cu="modulepreload",Lu=function(e,t){return new URL(e,t).href},Ko={},q=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let d=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");a=d(n.map(u=>{if(u=Lu(u,s),u in Ko)return;Ko[u]=!0;const f=u.endsWith(".css"),g=f?'[rel="stylesheet"]':"";if(s)for(let w=o.length-1;w>=0;w--){const S=o[w];if(S.href===u&&(!f||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${g}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":Cu,f||(m.as="script"),m.crossOrigin="",m.href=u,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise((w,S)=>{m.addEventListener("load",w),m.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return a.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};const os=globalThis,bi=os.ShadowRoot&&(os.ShadyCSS===void 0||os.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wi=Symbol(),Wo=new WeakMap;let Hl=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==wi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(bi&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=Wo.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Wo.set(n,t))}return t}toString(){return this.cssText}};const Eu=e=>new Hl(typeof e=="string"?e:e+"",void 0,wi),Mu=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,a,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new Hl(n,e,wi)},Ru=(e,t)=>{if(bi)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),a=os.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=n.cssText,e.appendChild(s)}},jo=bi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return Eu(n)})(e):e;const{is:Pu,defineProperty:Iu,getOwnPropertyDescriptor:Du,getOwnPropertyNames:Nu,getOwnPropertySymbols:Ou,getPrototypeOf:Fu}=Object,Ps=globalThis,Ho=Ps.trustedTypes,Bu=Ho?Ho.emptyScript:"",Uu=Ps.reactiveElementPolyfillSupport,Sn=(e,t)=>e,fs={toAttribute(e,t){switch(t){case Boolean:e=e?Bu:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ki=(e,t)=>!Pu(e,t),Vo={attribute:!0,type:String,converter:fs,reflect:!1,useDefault:!1,hasChanged:ki};Symbol.metadata??=Symbol("metadata"),Ps.litPropertyMetadata??=new WeakMap;let zt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Vo){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(t,s,n);a!==void 0&&Iu(this.prototype,t,a)}}static getPropertyDescriptor(t,n,s){const{get:a,set:i}=Du(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){const l=a?.call(this);i?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Vo}static _$Ei(){if(this.hasOwnProperty(Sn("elementProperties")))return;const t=Fu(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Sn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Sn("properties"))){const n=this.properties,s=[...Nu(n),...Ou(n)];for(const a of s)this.createProperty(a,n[a])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,a]of n)this.elementProperties.set(s,a)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const a=this._$Eu(n,s);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const a of s)n.unshift(jo(a))}else t!==void 0&&n.push(jo(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ru(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,s);if(a!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:fs).toAttribute(n,s.type);this._$Em=t,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(t,n){const s=this.constructor,a=s._$Eh.get(t);if(a!==void 0&&this._$Em!==a){const i=s.getPropertyOptions(a),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:fs;this._$Em=a;const l=o.fromAttribute(n,i.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,s,a=!1,i){if(t!==void 0){const o=this.constructor;if(a===!1&&(i=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??ki)(i,n)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:a,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),i!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[a,i]of s){const{wrapped:o}=i,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,i,l)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};zt.elementStyles=[],zt.shadowRootOptions={mode:"open"},zt[Sn("elementProperties")]=new Map,zt[Sn("finalized")]=new Map,Uu?.({ReactiveElement:zt}),(Ps.reactiveElementVersions??=[]).push("2.1.2");const $i=globalThis,qo=e=>e,gs=$i.trustedTypes,Go=gs?gs.createPolicy("lit-html",{createHTML:e=>e}):void 0,Vl="$lit$",nt=`lit$${Math.random().toFixed(9).slice(2)}$`,ql="?"+nt,zu=`<${ql}>`,_t=document,Cn=()=>_t.createComment(""),Ln=e=>e===null||typeof e!="object"&&typeof e!="function",Si=Array.isArray,Ku=e=>Si(e)||typeof e?.[Symbol.iterator]=="function",ua=`[ 	
\f\r]`,cn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yo=/-->/g,Qo=/>/g,ft=RegExp(`>|${ua}(?:([^\\s"'>=/]+)(${ua}*=${ua}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xo=/'/g,Jo=/"/g,Gl=/^(?:script|style|textarea|title)$/i,Yl=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),r=Yl(1),Qn=Yl(2),rt=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Zo=new WeakMap,At=_t.createTreeWalker(_t,129);function Ql(e,t){if(!Si(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Go!==void 0?Go.createHTML(t):t}const Wu=(e,t)=>{const n=e.length-1,s=[];let a,i=t===2?"<svg>":t===3?"<math>":"",o=cn;for(let l=0;l<n;l++){const c=e[l];let d,u,f=-1,g=0;for(;g<c.length&&(o.lastIndex=g,u=o.exec(c),u!==null);)g=o.lastIndex,o===cn?u[1]==="!--"?o=Yo:u[1]!==void 0?o=Qo:u[2]!==void 0?(Gl.test(u[2])&&(a=RegExp("</"+u[2],"g")),o=ft):u[3]!==void 0&&(o=ft):o===ft?u[0]===">"?(o=a??cn,f=-1):u[1]===void 0?f=-2:(f=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?ft:u[3]==='"'?Jo:Xo):o===Jo||o===Xo?o=ft:o===Yo||o===Qo?o=cn:(o=ft,a=void 0);const m=o===ft&&e[l+1].startsWith("/>")?" ":"";i+=o===cn?c+zu:f>=0?(s.push(d),c.slice(0,f)+Vl+c.slice(f)+nt+m):c+nt+(f===-2?l:m)}return[Ql(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class En{constructor({strings:t,_$litType$:n},s){let a;this.parts=[];let i=0,o=0;const l=t.length-1,c=this.parts,[d,u]=Wu(t,n);if(this.el=En.createElement(d,s),At.currentNode=this.el.content,n===2||n===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(a=At.nextNode())!==null&&c.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(const f of a.getAttributeNames())if(f.endsWith(Vl)){const g=u[o++],m=a.getAttribute(f).split(nt),w=/([.?@])?(.*)/.exec(g);c.push({type:1,index:i,name:w[2],strings:m,ctor:w[1]==="."?Hu:w[1]==="?"?Vu:w[1]==="@"?qu:Ds}),a.removeAttribute(f)}else f.startsWith(nt)&&(c.push({type:6,index:i}),a.removeAttribute(f));if(Gl.test(a.tagName)){const f=a.textContent.split(nt),g=f.length-1;if(g>0){a.textContent=gs?gs.emptyScript:"";for(let m=0;m<g;m++)a.append(f[m],Cn()),At.nextNode(),c.push({type:2,index:++i});a.append(f[g],Cn())}}}else if(a.nodeType===8)if(a.data===ql)c.push({type:2,index:i});else{let f=-1;for(;(f=a.data.indexOf(nt,f+1))!==-1;)c.push({type:7,index:i}),f+=nt.length-1}i++}}static createElement(t,n){const s=_t.createElement("template");return s.innerHTML=t,s}}function qt(e,t,n=e,s){if(t===rt)return t;let a=s!==void 0?n._$Co?.[s]:n._$Cl;const i=Ln(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),i===void 0?a=void 0:(a=new i(e),a._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=a:n._$Cl=a),a!==void 0&&(t=qt(e,a._$AS(e,t.values),a,s)),t}class ju{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,a=(t?.creationScope??_t).importNode(n,!0);At.currentNode=a;let i=At.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let d;c.type===2?d=new Is(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new Gu(i,this,t)),this._$AV.push(d),c=s[++l]}o!==c?.index&&(i=At.nextNode(),o++)}return At.currentNode=_t,a}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Is=class Xl{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,a){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=qt(this,t,n),Ln(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ku(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&Ln(this._$AH)?this._$AA.nextSibling.data=t:this.T(_t.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,a=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=En.createElement(Ql(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(n);else{const i=new ju(a,this),o=i.u(this.options);i.p(n),this.T(o),this._$AH=i}}_$AC(t){let n=Zo.get(t.strings);return n===void 0&&Zo.set(t.strings,n=new En(t)),n}k(t){Si(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,a=0;for(const i of t)a===n.length?n.push(s=new Xl(this.O(Cn()),this.O(Cn()),this,this.options)):s=n[a],s._$AI(i),a++;a<n.length&&(this._$AR(s&&s._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=qo(t).nextSibling;qo(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ds=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,a,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,n=this,s,a){const i=this.strings;let o=!1;if(i===void 0)t=qt(this,t,n,0),o=!Ln(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let c,d;for(t=i[0],c=0;c<i.length-1;c++)d=qt(this,l[s+c],n,c),d===rt&&(d=this._$AH[c]),o||=!Ln(d)||d!==this._$AH[c],d===h?t=h:t!==h&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}o&&!a&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Hu=class extends Ds{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},Vu=class extends Ds{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},qu=class extends Ds{constructor(t,n,s,a,i){super(t,n,s,a,i),this.type=5}_$AI(t,n=this){if((t=qt(this,t,n,0)??h)===rt)return;const s=this._$AH,a=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==h&&(s===h||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Gu=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){qt(this,t)}};const Yu={I:Is},Qu=$i.litHtmlPolyfillSupport;Qu?.(En,Is),($i.litHtmlVersions??=[]).push("3.3.2");const Xu=(e,t,n)=>{const s=n?.renderBefore??t;let a=s._$litPart$;if(a===void 0){const i=n?.renderBefore??null;s._$litPart$=a=new Is(t.insertBefore(Cn(),i),i,void 0,n??{})}return a._$AI(e),a};const Ai=globalThis;let Ht=class extends zt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xu(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return rt}};Ht._$litElement$=!0,Ht.finalized=!0,Ai.litElementHydrateSupport?.({LitElement:Ht});const Ju=Ai.litElementPolyfillSupport;Ju?.({LitElement:Ht});(Ai.litElementVersions??=[]).push("4.2.2");const Jl=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Zu={attribute:!0,type:String,converter:fs,reflect:!1,hasChanged:ki},ep=(e=Zu,t,n)=>{const{kind:s,metadata:a}=n;let i=globalThis.litPropertyMetadata.get(a);if(i===void 0&&globalThis.litPropertyMetadata.set(a,i=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(l){const c=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,c,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(s==="setter"){const{name:o}=n;return function(l){const c=this[o];t.call(this,l),this.requestUpdate(o,c,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function Ns(e){return(t,n)=>typeof n=="object"?ep(e,t,n):((s,a,i)=>{const o=a.hasOwnProperty(i);return a.constructor.createProperty(i,s),o?Object.getOwnPropertyDescriptor(a,i):void 0})(e,t,n)}function b(e){return Ns({...e,state:!0,attribute:!1})}async function Ee(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function tp(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function np(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function sp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Ct(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function Gt(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Zl(e,t,n){if(t.length===0)return;let s=e;for(let i=0;i<t.length-1;i+=1){const o=t[i],l=t[i+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof l=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const c=s;c[o]==null&&(c[o]=typeof l=="number"?[]:{}),s=c[o]}}const a=t[t.length-1];if(typeof a=="number"){Array.isArray(s)&&(s[a]=n);return}typeof s=="object"&&s!=null&&(s[a]=n)}function ec(e,t){if(t.length===0)return;let n=e;for(let a=0;a<t.length-1;a+=1){const i=t[a];if(typeof i=="number"){if(!Array.isArray(n))return;n=n[i]}else{if(typeof n!="object"||n==null)return;n=n[i]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Ve(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});ip(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function tc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});ap(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function ap(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function ip(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?Gt(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=Gt(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Ct(t.config??{}),e.configFormOriginal=Ct(t.config??{}),e.configRawOriginal=n)}async function ja(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?Gt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Ve(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function op(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?Gt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Ve(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function er(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function Xn(e,t,n){const s=Ct(e.configForm??e.configSnapshot?.config??{});Zl(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Gt(s))}function tr(e,t){const n=Ct(e.configForm??e.configSnapshot?.config??{});ec(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Gt(n))}function rp(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function lp(e){const{state:t,callbacks:n,accountId:s}=e,a=rp(t),i=(l,c,d={})=>{const{type:u="text",placeholder:f,maxLength:g,help:m}=d,w=t.values[l]??"",S=t.fieldErrors[l],x=`nostr-profile-${l}`;return u==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${x}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${c}
          </label>
          <textarea
            id="${x}"
            .value=${w}
            placeholder=${f??""}
            maxlength=${g??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${C=>{const p=C.target;n.onFieldChange(l,p.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${m?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${m}</div>`:h}
          ${S?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${S}</div>`:h}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${x}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${c}
        </label>
        <input
          id="${x}"
          type=${u}
          .value=${w}
          placeholder=${f??""}
          maxlength=${g??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${C=>{const p=C.target;n.onFieldChange(l,p.value)}}
          ?disabled=${t.saving}
        />
        ${m?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${m}</div>`:h}
        ${S?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${S}</div>`:h}
      </div>
    `},o=()=>{const l=t.values.picture;return l?r`
      <div style="margin-bottom: 12px;">
        <img
          src=${l}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${c=>{const d=c.target;d.style.display="none"}}
          @load=${c=>{const d=c.target;d.style.display="block"}}
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
  `}function cp(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function dp(e,t){await tp(e,t),await Ee(e,!0)}async function up(e){await np(e),await Ee(e,!0)}async function pp(e){await sp(e),await Ee(e,!0)}async function hp(e){await ja(e),await Ve(e),await Ee(e,!0)}async function fp(e){await Ve(e),await Ee(e,!0)}function gp(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...a]=n.split(":");if(!s||a.length===0)continue;const i=s.trim(),o=a.join(":").trim();i&&o&&(t[i]=o)}return t}function nc(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function sc(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function mp(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=cp(n??void 0)}function vp(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function yp(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function bp(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function wp(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=nc(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(sc(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const i=a?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:i,success:null,fieldErrors:gp(a?.details)};return}if(!a.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Ee(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function kp(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=nc(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(sc(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const c=a?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const i=a.merged??a.imported??null,o=i?{...t.values,...i}:t.values,l=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:a.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},a.saved&&await Ee(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function ac(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),a=n.slice(2).join(":");return!s||!a?null:{agentId:s,rest:a}}const $p=80;function Yt(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const a=getComputedStyle(s).overflowY;if(a==="auto"||a==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;s.scrollHeight-s.scrollTop-s.clientHeight;const a=t&&!e.chatHasAutoScrolled;if(!(a||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}a&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const o=a?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const l=n();!l||!(a||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,l.scrollTop=l.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},o)})})}function ic(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Sp(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<$p?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function Ap(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function oc(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function xp(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),a=document.createElement("a"),i=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");a.href=s,a.download=`godmode-logs-${t}-${i}.log`,a.click(),URL.revokeObjectURL(s)}function Tp(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const _p=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,Jn=/<\s*\/?\s*final\b[^>]*>/gi,nr=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function Cp(e,t){return e.trimStart()}function Lp(e,t){if(!e||!_p.test(e))return e;let n=e;Jn.test(n)?(Jn.lastIndex=0,n=n.replace(Jn,"")):Jn.lastIndex=0,nr.lastIndex=0;let s="",a=0,i=!1;for(const o of n.matchAll(nr)){const l=o.index??0,c=o[1]==="/";i?c&&(i=!1):(s+=n.slice(a,l),c||(i=!0)),a=l+o[0].length}return s+=n.slice(a),Cp(s)}function Mn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function z(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const a=Math.round(s/60);return a<48?`${a}h ago`:`${Math.round(a/24)}d ago`}function Ep(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const a=Math.round(s/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function xi(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function Ha(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function Va(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function rc(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function ms(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function de(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${a}`}function pa(e){return Lp(e)}const sr=50,Mp=80,Rp=12e4;function oe(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function ie(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function ar(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${oe(ie(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${oe(ie(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${oe(ie(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${oe(ie(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${oe(ie(n.query),45)}"`:"";case"web_fetch":try{const d=new URL(ie(n.url));return d.hostname+(d.pathname!=="/"?d.pathname.slice(0,30):"")}catch{return oe(ie(n.url||""),50)}case"memory_search":return n.query?`"${oe(ie(n.query),45)}"`:"";case"browser":const s=ie(n.action),a=n.ref?` #${ie(n.ref)}`:"",i=n.targetUrl?` ${oe(ie(n.targetUrl),30)}`:"";return`${s}${a}${i}`;case"message":return n.action?`${ie(n.action)}${n.target?` → ${oe(ie(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${oe(ie(n.task),40)}"`:"";case"cron":return n.action?ie(n.action):"";case"files_read":return n.fileId?`file:${oe(ie(n.fileId),20)}`:"";case"image":return n.image?oe(ie(n.image),40):"";default:const o=Object.keys(n).filter(d=>!["timeout","timeoutMs"].includes(d));if(o.length===0)return"";const l=o[0],c=n[l];return typeof c=="string"?`${l}: ${oe(c,35)}`:""}}function ir(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),a=s.length,i=t.length;if(["read","files_read"].includes(n))return`${i.toLocaleString()} chars${a>1?`, ${a} lines`:""}`;if(n==="exec")return a>1?`${a} lines`:oe(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),l=o.results?.length??o.count??0;return`${l} result${l!==1?"s":""}`}catch{return oe(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":oe(t,40):i>100?`${i.toLocaleString()} chars`:oe(t,50)}function or(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Pp(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(a=>{if(!a||typeof a!="object")return null;const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>!!a);return s.length===0?null:s.join(`
`)}function rr(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Pp(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=rc(n,Rp);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Ip(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Dp(e){if(e.toolStreamOrder.length<=sr)return;const t=e.toolStreamOrder.length-sr,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Np(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function qa(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Np(e)}function Op(e,t=!1){if(t){qa(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>qa(e),Mp))}function Ti(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),qa(e)}const Fp=5e3;function Bp(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Fp))}function Up(e,t){if(!t)return;if(t.stream==="compaction"){Bp(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},a=typeof s.toolCallId=="string"?s.toolCallId:"";if(!a)return;const i=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",l=o==="start"?s.args:void 0,c=o==="update"?rr(s.partialResult):o==="result"?rr(s.result):void 0,d=Date.now();let u=e.toolStreamById.get(a);u?(u.name=i,l!==void 0&&(u.args=l,u.displayArgs=ar(i,l)),c!==void 0&&(u.output=c,u.resultSummary=ir(i,c),u.success=or(c)),u.updatedAt=d):(u={toolCallId:a,runId:t.runId,sessionKey:n,name:i,args:l,output:c,startedAt:typeof t.ts=="number"?t.ts:d,updatedAt:d,message:{},displayArgs:l?ar(i,l):void 0},e.toolStreamById.set(a,u),e.toolStreamOrder.push(a)),o==="start"?(e.currentToolName=i,e.currentToolInfo={name:i,details:u.displayArgs||void 0,startedAt:u.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,u.completedAt=d,u.resultSummary=ir(i,u.output),u.success=or(u.output)),u.message=Ip(u),Dp(e),Op(e,o==="result")}const _i={CHILD:2},Ci=e=>(...t)=>({_$litDirective$:e,values:t});let Li=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class Ga extends Li{constructor(t){if(super(t),this.it=h,t.type!==_i.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===h||t==null)return this._t=void 0,this.it=t;if(t===rt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}Ga.directiveName="unsafeHTML",Ga.resultType=1;const lt=Ci(Ga);const{entries:lc,setPrototypeOf:lr,isFrozen:zp,getPrototypeOf:Kp,getOwnPropertyDescriptor:Wp}=Object;let{freeze:he,seal:xe,create:Ya}=Object,{apply:Qa,construct:Xa}=typeof Reflect<"u"&&Reflect;he||(he=function(t){return t});xe||(xe=function(t){return t});Qa||(Qa=function(t,n){for(var s=arguments.length,a=new Array(s>2?s-2:0),i=2;i<s;i++)a[i-2]=arguments[i];return t.apply(n,a)});Xa||(Xa=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return new t(...s)});const Zn=fe(Array.prototype.forEach),jp=fe(Array.prototype.lastIndexOf),cr=fe(Array.prototype.pop),dn=fe(Array.prototype.push),Hp=fe(Array.prototype.splice),rs=fe(String.prototype.toLowerCase),ha=fe(String.prototype.toString),fa=fe(String.prototype.match),un=fe(String.prototype.replace),Vp=fe(String.prototype.indexOf),qp=fe(String.prototype.trim),Te=fe(Object.prototype.hasOwnProperty),ue=fe(RegExp.prototype.test),pn=Gp(TypeError);function fe(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return Qa(e,t,s)}}function Gp(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return Xa(e,n)}}function O(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:rs;lr&&lr(e,null);let s=t.length;for(;s--;){let a=t[s];if(typeof a=="string"){const i=n(a);i!==a&&(zp(t)||(t[s]=i),a=i)}e[a]=!0}return e}function Yp(e){for(let t=0;t<e.length;t++)Te(e,t)||(e[t]=null);return e}function De(e){const t=Ya(null);for(const[n,s]of lc(e))Te(e,n)&&(Array.isArray(s)?t[n]=Yp(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=De(s):t[n]=s);return t}function hn(e,t){for(;e!==null;){const s=Wp(e,t);if(s){if(s.get)return fe(s.get);if(typeof s.value=="function")return fe(s.value)}e=Kp(e)}function n(){return null}return n}const dr=he(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ga=he(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),ma=he(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Qp=he(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),va=he(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Xp=he(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ur=he(["#text"]),pr=he(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),ya=he(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),hr=he(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),es=he(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Jp=xe(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Zp=xe(/<%[\w\W]*|[\w\W]*%>/gm),eh=xe(/\$\{[\w\W]*/gm),th=xe(/^data-[\-\w.\u00B7-\uFFFF]+$/),nh=xe(/^aria-[\-\w]+$/),cc=xe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),sh=xe(/^(?:\w+script|data):/i),ah=xe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),dc=xe(/^html$/i),ih=xe(/^[a-z][.\w]*(-[.\w]+)+$/i);var fr=Object.freeze({__proto__:null,ARIA_ATTR:nh,ATTR_WHITESPACE:ah,CUSTOM_ELEMENT:ih,DATA_ATTR:th,DOCTYPE_NAME:dc,ERB_EXPR:Zp,IS_ALLOWED_URI:cc,IS_SCRIPT_OR_DATA:sh,MUSTACHE_EXPR:Jp,TMPLIT_EXPR:eh});const fn={element:1,text:3,progressingInstruction:7,comment:8,document:9},oh=function(){return typeof window>"u"?null:window},rh=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const a="data-tt-policy-suffix";n&&n.hasAttribute(a)&&(s=n.getAttribute(a));const i="dompurify"+(s?"#"+s:"");try{return t.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},gr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function uc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:oh();const t=I=>uc(I);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==fn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,a=s.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:c,NodeFilter:d,NamedNodeMap:u=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:f,DOMParser:g,trustedTypes:m}=e,w=c.prototype,S=hn(w,"cloneNode"),x=hn(w,"remove"),C=hn(w,"nextSibling"),p=hn(w,"childNodes"),$=hn(w,"parentNode");if(typeof o=="function"){const I=n.createElement("template");I.content&&I.content.ownerDocument&&(n=I.content.ownerDocument)}let A,T="";const{implementation:L,createNodeIterator:E,createDocumentFragment:F,getElementsByTagName:V}=n,{importNode:j}=s;let H=gr();t.isSupported=typeof lc=="function"&&typeof $=="function"&&L&&L.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:se,ERB_EXPR:ge,TMPLIT_EXPR:D,DATA_ATTR:M,ARIA_ATTR:W,IS_SCRIPT_OR_DATA:Z,ATTR_WHITESPACE:N,CUSTOM_ELEMENT:Me}=fr;let{IS_ALLOWED_URI:be}=fr,B=null;const sn=O({},[...dr,...ga,...ma,...va,...ur]);let X=null;const an=O({},[...pr,...ya,...hr,...es]);let Y=Object.seal(Ya(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Xe=null,ut=null;const Je=Object.seal(Ya(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let on=!0,Pt=!0,ea=!1,Ao=!0,It=!1,Wn=!0,pt=!1,ta=!1,na=!1,Dt=!1,jn=!1,Hn=!1,xo=!0,To=!1;const wu="user-content-";let sa=!0,rn=!1,Nt={},Re=null;const aa=O({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let _o=null;const Co=O({},["audio","video","img","source","image","track"]);let ia=null;const Lo=O({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Vn="http://www.w3.org/1998/Math/MathML",qn="http://www.w3.org/2000/svg",ze="http://www.w3.org/1999/xhtml";let Ot=ze,oa=!1,ra=null;const ku=O({},[Vn,qn,ze],ha);let Gn=O({},["mi","mo","mn","ms","mtext"]),Yn=O({},["annotation-xml"]);const $u=O({},["title","style","font","a","script"]);let ln=null;const Su=["application/xhtml+xml","text/html"],Au="text/html";let ee=null,Ft=null;const xu=n.createElement("form"),Eo=function(k){return k instanceof RegExp||k instanceof Function},la=function(){let k=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Ft&&Ft===k)){if((!k||typeof k!="object")&&(k={}),k=De(k),ln=Su.indexOf(k.PARSER_MEDIA_TYPE)===-1?Au:k.PARSER_MEDIA_TYPE,ee=ln==="application/xhtml+xml"?ha:rs,B=Te(k,"ALLOWED_TAGS")?O({},k.ALLOWED_TAGS,ee):sn,X=Te(k,"ALLOWED_ATTR")?O({},k.ALLOWED_ATTR,ee):an,ra=Te(k,"ALLOWED_NAMESPACES")?O({},k.ALLOWED_NAMESPACES,ha):ku,ia=Te(k,"ADD_URI_SAFE_ATTR")?O(De(Lo),k.ADD_URI_SAFE_ATTR,ee):Lo,_o=Te(k,"ADD_DATA_URI_TAGS")?O(De(Co),k.ADD_DATA_URI_TAGS,ee):Co,Re=Te(k,"FORBID_CONTENTS")?O({},k.FORBID_CONTENTS,ee):aa,Xe=Te(k,"FORBID_TAGS")?O({},k.FORBID_TAGS,ee):De({}),ut=Te(k,"FORBID_ATTR")?O({},k.FORBID_ATTR,ee):De({}),Nt=Te(k,"USE_PROFILES")?k.USE_PROFILES:!1,on=k.ALLOW_ARIA_ATTR!==!1,Pt=k.ALLOW_DATA_ATTR!==!1,ea=k.ALLOW_UNKNOWN_PROTOCOLS||!1,Ao=k.ALLOW_SELF_CLOSE_IN_ATTR!==!1,It=k.SAFE_FOR_TEMPLATES||!1,Wn=k.SAFE_FOR_XML!==!1,pt=k.WHOLE_DOCUMENT||!1,Dt=k.RETURN_DOM||!1,jn=k.RETURN_DOM_FRAGMENT||!1,Hn=k.RETURN_TRUSTED_TYPE||!1,na=k.FORCE_BODY||!1,xo=k.SANITIZE_DOM!==!1,To=k.SANITIZE_NAMED_PROPS||!1,sa=k.KEEP_CONTENT!==!1,rn=k.IN_PLACE||!1,be=k.ALLOWED_URI_REGEXP||cc,Ot=k.NAMESPACE||ze,Gn=k.MATHML_TEXT_INTEGRATION_POINTS||Gn,Yn=k.HTML_INTEGRATION_POINTS||Yn,Y=k.CUSTOM_ELEMENT_HANDLING||{},k.CUSTOM_ELEMENT_HANDLING&&Eo(k.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Y.tagNameCheck=k.CUSTOM_ELEMENT_HANDLING.tagNameCheck),k.CUSTOM_ELEMENT_HANDLING&&Eo(k.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Y.attributeNameCheck=k.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),k.CUSTOM_ELEMENT_HANDLING&&typeof k.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(Y.allowCustomizedBuiltInElements=k.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),It&&(Pt=!1),jn&&(Dt=!0),Nt&&(B=O({},ur),X=[],Nt.html===!0&&(O(B,dr),O(X,pr)),Nt.svg===!0&&(O(B,ga),O(X,ya),O(X,es)),Nt.svgFilters===!0&&(O(B,ma),O(X,ya),O(X,es)),Nt.mathMl===!0&&(O(B,va),O(X,hr),O(X,es))),k.ADD_TAGS&&(typeof k.ADD_TAGS=="function"?Je.tagCheck=k.ADD_TAGS:(B===sn&&(B=De(B)),O(B,k.ADD_TAGS,ee))),k.ADD_ATTR&&(typeof k.ADD_ATTR=="function"?Je.attributeCheck=k.ADD_ATTR:(X===an&&(X=De(X)),O(X,k.ADD_ATTR,ee))),k.ADD_URI_SAFE_ATTR&&O(ia,k.ADD_URI_SAFE_ATTR,ee),k.FORBID_CONTENTS&&(Re===aa&&(Re=De(Re)),O(Re,k.FORBID_CONTENTS,ee)),k.ADD_FORBID_CONTENTS&&(Re===aa&&(Re=De(Re)),O(Re,k.ADD_FORBID_CONTENTS,ee)),sa&&(B["#text"]=!0),pt&&O(B,["html","head","body"]),B.table&&(O(B,["tbody"]),delete Xe.tbody),k.TRUSTED_TYPES_POLICY){if(typeof k.TRUSTED_TYPES_POLICY.createHTML!="function")throw pn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof k.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw pn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');A=k.TRUSTED_TYPES_POLICY,T=A.createHTML("")}else A===void 0&&(A=rh(m,a)),A!==null&&typeof T=="string"&&(T=A.createHTML(""));he&&he(k),Ft=k}},Mo=O({},[...ga,...ma,...Qp]),Ro=O({},[...va,...Xp]),Tu=function(k){let _=$(k);(!_||!_.tagName)&&(_={namespaceURI:Ot,tagName:"template"});const P=rs(k.tagName),Q=rs(_.tagName);return ra[k.namespaceURI]?k.namespaceURI===qn?_.namespaceURI===ze?P==="svg":_.namespaceURI===Vn?P==="svg"&&(Q==="annotation-xml"||Gn[Q]):!!Mo[P]:k.namespaceURI===Vn?_.namespaceURI===ze?P==="math":_.namespaceURI===qn?P==="math"&&Yn[Q]:!!Ro[P]:k.namespaceURI===ze?_.namespaceURI===qn&&!Yn[Q]||_.namespaceURI===Vn&&!Gn[Q]?!1:!Ro[P]&&($u[P]||!Mo[P]):!!(ln==="application/xhtml+xml"&&ra[k.namespaceURI]):!1},Pe=function(k){dn(t.removed,{element:k});try{$(k).removeChild(k)}catch{x(k)}},ht=function(k,_){try{dn(t.removed,{attribute:_.getAttributeNode(k),from:_})}catch{dn(t.removed,{attribute:null,from:_})}if(_.removeAttribute(k),k==="is")if(Dt||jn)try{Pe(_)}catch{}else try{_.setAttribute(k,"")}catch{}},Po=function(k){let _=null,P=null;if(na)k="<remove></remove>"+k;else{const J=fa(k,/^[\r\n\t ]+/);P=J&&J[0]}ln==="application/xhtml+xml"&&Ot===ze&&(k='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+k+"</body></html>");const Q=A?A.createHTML(k):k;if(Ot===ze)try{_=new g().parseFromString(Q,ln)}catch{}if(!_||!_.documentElement){_=L.createDocument(Ot,"template",null);try{_.documentElement.innerHTML=oa?T:Q}catch{}}const re=_.body||_.documentElement;return k&&P&&re.insertBefore(n.createTextNode(P),re.childNodes[0]||null),Ot===ze?V.call(_,pt?"html":"body")[0]:pt?_.documentElement:re},Io=function(k){return E.call(k.ownerDocument||k,k,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},ca=function(k){return k instanceof f&&(typeof k.nodeName!="string"||typeof k.textContent!="string"||typeof k.removeChild!="function"||!(k.attributes instanceof u)||typeof k.removeAttribute!="function"||typeof k.setAttribute!="function"||typeof k.namespaceURI!="string"||typeof k.insertBefore!="function"||typeof k.hasChildNodes!="function")},Do=function(k){return typeof l=="function"&&k instanceof l};function Ke(I,k,_){Zn(I,P=>{P.call(t,k,_,Ft)})}const No=function(k){let _=null;if(Ke(H.beforeSanitizeElements,k,null),ca(k))return Pe(k),!0;const P=ee(k.nodeName);if(Ke(H.uponSanitizeElement,k,{tagName:P,allowedTags:B}),Wn&&k.hasChildNodes()&&!Do(k.firstElementChild)&&ue(/<[/\w!]/g,k.innerHTML)&&ue(/<[/\w!]/g,k.textContent)||k.nodeType===fn.progressingInstruction||Wn&&k.nodeType===fn.comment&&ue(/<[/\w]/g,k.data))return Pe(k),!0;if(!(Je.tagCheck instanceof Function&&Je.tagCheck(P))&&(!B[P]||Xe[P])){if(!Xe[P]&&Fo(P)&&(Y.tagNameCheck instanceof RegExp&&ue(Y.tagNameCheck,P)||Y.tagNameCheck instanceof Function&&Y.tagNameCheck(P)))return!1;if(sa&&!Re[P]){const Q=$(k)||k.parentNode,re=p(k)||k.childNodes;if(re&&Q){const J=re.length;for(let me=J-1;me>=0;--me){const We=S(re[me],!0);We.__removalCount=(k.__removalCount||0)+1,Q.insertBefore(We,C(k))}}}return Pe(k),!0}return k instanceof c&&!Tu(k)||(P==="noscript"||P==="noembed"||P==="noframes")&&ue(/<\/no(script|embed|frames)/i,k.innerHTML)?(Pe(k),!0):(It&&k.nodeType===fn.text&&(_=k.textContent,Zn([se,ge,D],Q=>{_=un(_,Q," ")}),k.textContent!==_&&(dn(t.removed,{element:k.cloneNode()}),k.textContent=_)),Ke(H.afterSanitizeElements,k,null),!1)},Oo=function(k,_,P){if(xo&&(_==="id"||_==="name")&&(P in n||P in xu))return!1;if(!(Pt&&!ut[_]&&ue(M,_))){if(!(on&&ue(W,_))){if(!(Je.attributeCheck instanceof Function&&Je.attributeCheck(_,k))){if(!X[_]||ut[_]){if(!(Fo(k)&&(Y.tagNameCheck instanceof RegExp&&ue(Y.tagNameCheck,k)||Y.tagNameCheck instanceof Function&&Y.tagNameCheck(k))&&(Y.attributeNameCheck instanceof RegExp&&ue(Y.attributeNameCheck,_)||Y.attributeNameCheck instanceof Function&&Y.attributeNameCheck(_,k))||_==="is"&&Y.allowCustomizedBuiltInElements&&(Y.tagNameCheck instanceof RegExp&&ue(Y.tagNameCheck,P)||Y.tagNameCheck instanceof Function&&Y.tagNameCheck(P))))return!1}else if(!ia[_]){if(!ue(be,un(P,N,""))){if(!((_==="src"||_==="xlink:href"||_==="href")&&k!=="script"&&Vp(P,"data:")===0&&_o[k])){if(!(ea&&!ue(Z,un(P,N,"")))){if(P)return!1}}}}}}}return!0},Fo=function(k){return k!=="annotation-xml"&&fa(k,Me)},Bo=function(k){Ke(H.beforeSanitizeAttributes,k,null);const{attributes:_}=k;if(!_||ca(k))return;const P={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:X,forceKeepAttr:void 0};let Q=_.length;for(;Q--;){const re=_[Q],{name:J,namespaceURI:me,value:We}=re,Bt=ee(J),da=We;let ae=J==="value"?da:qp(da);if(P.attrName=Bt,P.attrValue=ae,P.keepAttr=!0,P.forceKeepAttr=void 0,Ke(H.uponSanitizeAttribute,k,P),ae=P.attrValue,To&&(Bt==="id"||Bt==="name")&&(ht(J,k),ae=wu+ae),Wn&&ue(/((--!?|])>)|<\/(style|title|textarea)/i,ae)){ht(J,k);continue}if(Bt==="attributename"&&fa(ae,"href")){ht(J,k);continue}if(P.forceKeepAttr)continue;if(!P.keepAttr){ht(J,k);continue}if(!Ao&&ue(/\/>/i,ae)){ht(J,k);continue}It&&Zn([se,ge,D],zo=>{ae=un(ae,zo," ")});const Uo=ee(k.nodeName);if(!Oo(Uo,Bt,ae)){ht(J,k);continue}if(A&&typeof m=="object"&&typeof m.getAttributeType=="function"&&!me)switch(m.getAttributeType(Uo,Bt)){case"TrustedHTML":{ae=A.createHTML(ae);break}case"TrustedScriptURL":{ae=A.createScriptURL(ae);break}}if(ae!==da)try{me?k.setAttributeNS(me,J,ae):k.setAttribute(J,ae),ca(k)?Pe(k):cr(t.removed)}catch{ht(J,k)}}Ke(H.afterSanitizeAttributes,k,null)},_u=function I(k){let _=null;const P=Io(k);for(Ke(H.beforeSanitizeShadowDOM,k,null);_=P.nextNode();)Ke(H.uponSanitizeShadowNode,_,null),No(_),Bo(_),_.content instanceof i&&I(_.content);Ke(H.afterSanitizeShadowDOM,k,null)};return t.sanitize=function(I){let k=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},_=null,P=null,Q=null,re=null;if(oa=!I,oa&&(I="<!-->"),typeof I!="string"&&!Do(I))if(typeof I.toString=="function"){if(I=I.toString(),typeof I!="string")throw pn("dirty is not a string, aborting")}else throw pn("toString is not a function");if(!t.isSupported)return I;if(ta||la(k),t.removed=[],typeof I=="string"&&(rn=!1),rn){if(I.nodeName){const We=ee(I.nodeName);if(!B[We]||Xe[We])throw pn("root node is forbidden and cannot be sanitized in-place")}}else if(I instanceof l)_=Po("<!---->"),P=_.ownerDocument.importNode(I,!0),P.nodeType===fn.element&&P.nodeName==="BODY"||P.nodeName==="HTML"?_=P:_.appendChild(P);else{if(!Dt&&!It&&!pt&&I.indexOf("<")===-1)return A&&Hn?A.createHTML(I):I;if(_=Po(I),!_)return Dt?null:Hn?T:""}_&&na&&Pe(_.firstChild);const J=Io(rn?I:_);for(;Q=J.nextNode();)No(Q),Bo(Q),Q.content instanceof i&&_u(Q.content);if(rn)return I;if(Dt){if(jn)for(re=F.call(_.ownerDocument);_.firstChild;)re.appendChild(_.firstChild);else re=_;return(X.shadowroot||X.shadowrootmode)&&(re=j.call(s,re,!0)),re}let me=pt?_.outerHTML:_.innerHTML;return pt&&B["!doctype"]&&_.ownerDocument&&_.ownerDocument.doctype&&_.ownerDocument.doctype.name&&ue(dc,_.ownerDocument.doctype.name)&&(me="<!DOCTYPE "+_.ownerDocument.doctype.name+`>
`+me),It&&Zn([se,ge,D],We=>{me=un(me,We," ")}),A&&Hn?A.createHTML(me):me},t.setConfig=function(){let I=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};la(I),ta=!0},t.clearConfig=function(){Ft=null,ta=!1},t.isValidAttribute=function(I,k,_){Ft||la({});const P=ee(I),Q=ee(k);return Oo(P,Q,_)},t.addHook=function(I,k){typeof k=="function"&&dn(H[I],k)},t.removeHook=function(I,k){if(k!==void 0){const _=jp(H[I],k);return _===-1?void 0:Hp(H[I],_,1)[0]}return cr(H[I])},t.removeHooks=function(I){H[I]=[]},t.removeAllHooks=function(){H=gr()},t}var Rn=uc();function Ei(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Rt=Ei();function pc(e){Rt=e}var St={exec:()=>null};function U(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(a,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(pe.caret,"$1"),n=n.replace(a,o),s},getRegex:()=>new RegExp(n,t)};return s}var lh=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),pe={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},ch=/^(?:[ \t]*(?:\n|$))+/,dh=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,uh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Nn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ph=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Mi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,hc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,fc=U(hc).replace(/bull/g,Mi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),hh=U(hc).replace(/bull/g,Mi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Ri=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,fh=/^[^\n]+/,Pi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,gh=U(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Pi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),mh=U(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Mi).getRegex(),Os="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ii=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,vh=U("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ii).replace("tag",Os).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),gc=U(Ri).replace("hr",Nn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Os).getRegex(),yh=U(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",gc).getRegex(),Di={blockquote:yh,code:dh,def:gh,fences:uh,heading:ph,hr:Nn,html:vh,lheading:fc,list:mh,newline:ch,paragraph:gc,table:St,text:fh},mr=U("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Nn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Os).getRegex(),bh={...Di,lheading:hh,table:mr,paragraph:U(Ri).replace("hr",Nn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",mr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Os).getRegex()},wh={...Di,html:U(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Ii).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:St,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:U(Ri).replace("hr",Nn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",fc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},kh=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,$h=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,mc=/^( {2,}|\\)\n(?!\s*$)/,Sh=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Fs=/[\p{P}\p{S}]/u,Ni=/[\s\p{P}\p{S}]/u,vc=/[^\s\p{P}\p{S}]/u,Ah=U(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ni).getRegex(),yc=/(?!~)[\p{P}\p{S}]/u,xh=/(?!~)[\s\p{P}\p{S}]/u,Th=/(?:[^\s\p{P}\p{S}]|~)/u,bc=/(?![*_])[\p{P}\p{S}]/u,_h=/(?![*_])[\s\p{P}\p{S}]/u,Ch=/(?:[^\s\p{P}\p{S}]|[*_])/u,Lh=U(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",lh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),wc=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Eh=U(wc,"u").replace(/punct/g,Fs).getRegex(),Mh=U(wc,"u").replace(/punct/g,yc).getRegex(),kc="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Rh=U(kc,"gu").replace(/notPunctSpace/g,vc).replace(/punctSpace/g,Ni).replace(/punct/g,Fs).getRegex(),Ph=U(kc,"gu").replace(/notPunctSpace/g,Th).replace(/punctSpace/g,xh).replace(/punct/g,yc).getRegex(),Ih=U("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,vc).replace(/punctSpace/g,Ni).replace(/punct/g,Fs).getRegex(),Dh=U(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,bc).getRegex(),Nh="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Oh=U(Nh,"gu").replace(/notPunctSpace/g,Ch).replace(/punctSpace/g,_h).replace(/punct/g,bc).getRegex(),Fh=U(/\\(punct)/,"gu").replace(/punct/g,Fs).getRegex(),Bh=U(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Uh=U(Ii).replace("(?:-->|$)","-->").getRegex(),zh=U("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Uh).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),vs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Kh=U(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",vs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),$c=U(/^!?\[(label)\]\[(ref)\]/).replace("label",vs).replace("ref",Pi).getRegex(),Sc=U(/^!?\[(ref)\](?:\[\])?/).replace("ref",Pi).getRegex(),Wh=U("reflink|nolink(?!\\()","g").replace("reflink",$c).replace("nolink",Sc).getRegex(),vr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Oi={_backpedal:St,anyPunctuation:Fh,autolink:Bh,blockSkip:Lh,br:mc,code:$h,del:St,delLDelim:St,delRDelim:St,emStrongLDelim:Eh,emStrongRDelimAst:Rh,emStrongRDelimUnd:Ih,escape:kh,link:Kh,nolink:Sc,punctuation:Ah,reflink:$c,reflinkSearch:Wh,tag:zh,text:Sh,url:St},jh={...Oi,link:U(/^!?\[(label)\]\((.*?)\)/).replace("label",vs).getRegex(),reflink:U(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",vs).getRegex()},Ja={...Oi,emStrongRDelimAst:Ph,emStrongLDelim:Mh,delLDelim:Dh,delRDelim:Oh,url:U(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",vr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:U(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",vr).getRegex()},Hh={...Ja,br:U(mc).replace("{2,}","*").getRegex(),text:U(Ja.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ts={normal:Di,gfm:bh,pedantic:wh},gn={normal:Oi,gfm:Ja,breaks:Hh,pedantic:jh},Vh={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},yr=e=>Vh[e];function Ne(e,t){if(t){if(pe.escapeTest.test(e))return e.replace(pe.escapeReplace,yr)}else if(pe.escapeTestNoEncode.test(e))return e.replace(pe.escapeReplaceNoEncode,yr);return e}function br(e){try{e=encodeURI(e).replace(pe.percentDecode,"%")}catch{return null}return e}function wr(e,t){let n=e.replace(pe.findPipe,(i,o,l)=>{let c=!1,d=o;for(;--d>=0&&l[d]==="\\";)c=!c;return c?"|":" |"}),s=n.split(pe.splitPipe),a=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;a<s.length;a++)s[a]=s[a].trim().replace(pe.slashPipe,"|");return s}function mn(e,t,n){let s=e.length;if(s===0)return"";let a=0;for(;a<s&&e.charAt(s-a-1)===t;)a++;return e.slice(0,s-a)}function qh(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Gh(e,t=0){let n=t,s="";for(let a of e)if(a==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=a,n++;return s}function kr(e,t,n,s,a){let i=t.href,o=t.title||null,l=e[1].replace(a.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,c}function Yh(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let a=s[1];return t.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=a.length?i.slice(a.length):i}).join(`
`)}var ys=class{options;rules;lexer;constructor(e){this.options=e||Rt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:mn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Yh(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=mn(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:mn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=mn(t[0],`
`).split(`
`),s="",a="",i=[];for(;n.length>0;){let o=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),o=!0;else if(!o)l.push(n[c]);else break;n=n.slice(c);let d=l.join(`
`),u=d.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${d}`:d,a=a?`${a}
${u}`:u;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,i,!0),this.lexer.state.top=f,n.length===0)break;let g=i.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let m=g,w=m.raw+`
`+n.join(`
`),S=this.blockquote(w);i[i.length-1]=S,s=s.substring(0,s.length-m.raw.length)+S.raw,a=a.substring(0,a.length-m.text.length)+S.text;break}else if(g?.type==="list"){let m=g,w=m.raw+`
`+n.join(`
`),S=this.list(w);i[i.length-1]=S,s=s.substring(0,s.length-g.raw.length)+S.raw,a=a.substring(0,a.length-m.raw.length)+S.raw,n=w.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:a}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,a={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;e;){let c=!1,d="",u="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;d=t[0],e=e.substring(d.length);let f=Gh(t[2].split(`
`,1)[0],t[1].length),g=e.split(`
`,1)[0],m=!f.trim(),w=0;if(this.options.pedantic?(w=2,u=f.trimStart()):m?w=t[1].length+1:(w=f.search(this.rules.other.nonSpaceChar),w=w>4?1:w,u=f.slice(w),w+=t[1].length),m&&this.rules.other.blankLine.test(g)&&(d+=g+`
`,e=e.substring(g.length+1),c=!0),!c){let S=this.rules.other.nextBulletRegex(w),x=this.rules.other.hrRegex(w),C=this.rules.other.fencesBeginRegex(w),p=this.rules.other.headingBeginRegex(w),$=this.rules.other.htmlBeginRegex(w),A=this.rules.other.blockquoteBeginRegex(w);for(;e;){let T=e.split(`
`,1)[0],L;if(g=T,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),L=g):L=g.replace(this.rules.other.tabCharGlobal,"    "),C.test(g)||p.test(g)||$.test(g)||A.test(g)||S.test(g)||x.test(g))break;if(L.search(this.rules.other.nonSpaceChar)>=w||!g.trim())u+=`
`+L.slice(w);else{if(m||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||C.test(f)||p.test(f)||x.test(f))break;u+=`
`+g}m=!g.trim(),d+=T+`
`,e=e.substring(T.length+1),f=L.slice(w)}}a.loose||(o?a.loose=!0:this.rules.other.doubleBlankLine.test(d)&&(o=!0)),a.items.push({type:"list_item",raw:d,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),a.raw+=d}let l=a.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let c of a.items){if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),c.task){if(c.text=c.text.replace(this.rules.other.listReplaceTask,""),c.tokens[0]?.type==="text"||c.tokens[0]?.type==="paragraph"){c.tokens[0].raw=c.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),c.tokens[0].text=c.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let d=this.rules.other.listTaskCheckbox.exec(c.raw);if(d){let u={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};c.checked=u.checked,a.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=u.raw+c.tokens[0].raw,c.tokens[0].text=u.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(u)):c.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):c.tokens.unshift(u)}}if(!a.loose){let d=c.tokens.filter(f=>f.type==="space"),u=d.length>0&&d.some(f=>this.rules.other.anyLine.test(f.raw));a.loose=u}}if(a.loose)for(let c of a.items){c.loose=!0;for(let d of c.tokens)d.type==="text"&&(d.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:a}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=wr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),a=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of a)i.rows.push(wr(o,i.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[c]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=mn(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=qh(t[2],"()");if(i===-2)return;if(i>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],a="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],a=i[3])}else a=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),kr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=t[s.toLowerCase()];if(!a){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return kr(n,a,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,c=0,d=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,t=t.slice(-1*e.length+a);(s=d.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(o=[...i].length,s[3]||s[4]){l+=o;continue}else if((s[5]||s[6])&&a%3&&!((a+o)%3)){c+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+c);let u=[...s[0]][0].length,f=e.slice(0,a+s.index+u+o);if(Math.min(a,o)%2){let m=f.slice(1,-1);return{type:"em",raw:f,text:m,tokens:this.lexer.inlineTokens(m)}}let g=f.slice(2,-2);return{type:"strong",raw:f,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),a=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&a&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+a);(s=c.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(o=[...i].length,o!==a))continue;if(s[3]||s[4]){l+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l);let d=[...s[0]][0].length,u=e.slice(0,a+s.index+d+o),f=u.slice(a,-a);return{type:"del",raw:u,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(a!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},_e=class Za{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Rt,this.options.tokenizer=this.options.tokenizer||new ys,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:pe,block:ts.normal,inline:gn.normal};this.options.pedantic?(n.block=ts.pedantic,n.inline=gn.pedantic):this.options.gfm&&(n.block=ts.gfm,this.options.breaks?n.inline=gn.breaks:n.inline=gn.gfm),this.tokenizer.rules=n}static get rules(){return{block:ts,inline:gn}}static lex(t,n){return new Za(n).lex(t)}static lexInline(t,n){return new Za(n).inlineTokens(t)}lex(t){t=t.replace(pe.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(pe.tabCharGlobal,"    ").replace(pe.spaceLine,""));t;){let a;if(this.options.extensions?.block?.some(o=>(a=o.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let o=n.at(-1);a.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let i=t;if(this.options.extensions?.startBlock){let o=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(d=>{c=d.call({lexer:this},l),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(i=t.substring(0,o+1))}if(this.state.top&&(a=this.tokenizer.paragraph(i))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a),s=i.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,a=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,a.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(a=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=a[2]?a[2].length:0,s=s.slice(0,a.index+i)+"["+"a".repeat(a[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,l="";for(;t;){o||(l=""),o=!1;let c;if(this.options.extensions?.inline?.some(u=>(c=u.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let u=n.at(-1);c.type==="text"&&u?.type==="text"?(u.raw+=c.raw,u.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let d=t;if(this.options.extensions?.startInline){let u=1/0,f=t.slice(1),g;this.options.extensions.startInline.forEach(m=>{g=m.call({lexer:this},f),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(d=t.substring(0,u+1))}if(c=this.tokenizer.inlineText(d)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(l=c.raw.slice(-1)),o=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=c.raw,u.text+=c.text):n.push(c);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},bs=class{options;parser;constructor(e){this.options=e||Rt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(pe.notSpaceStart)?.[0],a=e.replace(pe.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ne(s)+'">'+(n?a:Ne(a,!0))+`</code></pre>
`:"<pre><code>"+(n?a:Ne(a,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ne(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),a=br(e);if(a===null)return s;e=a;let i='<a href="'+e+'"';return t&&(i+=' title="'+Ne(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let a=br(e);if(a===null)return Ne(n);e=a;let i=`<img src="${e}" alt="${Ne(n)}"`;return t&&(i+=` title="${Ne(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ne(e.text)}},Fi=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ce=class ei{options;renderer;textRenderer;constructor(t){this.options=t||Rt,this.options.renderer=this.options.renderer||new bs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Fi}static parse(t,n){return new ei(n).parse(t)}static parseInline(t,n){return new ei(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let a=t[s];if(this.options.extensions?.renderers?.[a.type]){let o=a,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=l||"";continue}}let i=a;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let a=0;a<t.length;a++){let i=t[a];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let o=i;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},bn=class{options;block;constructor(t){this.options=t||Rt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?_e.lex:_e.lexInline}provideParser(){return this.block?Ce.parse:Ce.parseInline}},Qh=class{defaults=Ei();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ce;Renderer=bs;TextRenderer=Fi;Lexer=_e;Tokenizer=ys;Hooks=bn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let a=s;for(let i of a.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of a.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let a=s;n=n.concat(this.walkTokens(a.items,t));break}default:{let a=s;this.defaults.extensions?.childTokens?.[a.type]?this.defaults.extensions.childTokens[a.type].forEach(i=>{let o=a[i].flat(1/0);n=n.concat(this.walkTokens(o,t))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){let i=t.renderers[a.name];i?t.renderers[a.name]=function(...o){let l=a.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:t.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[a.level];i?i.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level==="block"?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level==="inline"&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),s.extensions=t),n.renderer){let a=this.defaults.renderer||new bs(this.defaults);for(let i in n.renderer){if(!(i in a))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=n.renderer[o],c=a[o];a[o]=(...d)=>{let u=l.apply(a,d);return u===!1&&(u=c.apply(a,d)),u||""}}s.renderer=a}if(n.tokenizer){let a=this.defaults.tokenizer||new ys(this.defaults);for(let i in n.tokenizer){if(!(i in a))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=n.tokenizer[o],c=a[o];a[o]=(...d)=>{let u=l.apply(a,d);return u===!1&&(u=c.apply(a,d)),u}}s.tokenizer=a}if(n.hooks){let a=this.defaults.hooks||new bn;for(let i in n.hooks){if(!(i in a))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=n.hooks[o],c=a[o];bn.passThroughHooks.has(i)?a[o]=d=>{if(this.defaults.async&&bn.passThroughHooksRespectAsync.has(i))return(async()=>{let f=await l.call(a,d);return c.call(a,f)})();let u=l.call(a,d);return c.call(a,u)}:a[o]=(...d)=>{if(this.defaults.async)return(async()=>{let f=await l.apply(a,d);return f===!1&&(f=await c.apply(a,d)),f})();let u=l.apply(a,d);return u===!1&&(u=c.apply(a,d)),u}}s.hooks=a}if(n.walkTokens){let a=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),a&&(l=l.concat(a.call(this,o))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return _e.lex(e,t??this.defaults)}parser(e,t){return Ce.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},a={...this.defaults,...s},i=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(a.hooks&&(a.hooks.options=a,a.hooks.block=e),a.async)return(async()=>{let o=a.hooks?await a.hooks.preprocess(t):t,l=await(a.hooks?await a.hooks.provideLexer():e?_e.lex:_e.lexInline)(o,a),c=a.hooks?await a.hooks.processAllTokens(l):l;a.walkTokens&&await Promise.all(this.walkTokens(c,a.walkTokens));let d=await(a.hooks?await a.hooks.provideParser():e?Ce.parse:Ce.parseInline)(c,a);return a.hooks?await a.hooks.postprocess(d):d})().catch(i);try{a.hooks&&(t=a.hooks.preprocess(t));let o=(a.hooks?a.hooks.provideLexer():e?_e.lex:_e.lexInline)(t,a);a.hooks&&(o=a.hooks.processAllTokens(o)),a.walkTokens&&this.walkTokens(o,a.walkTokens);let l=(a.hooks?a.hooks.provideParser():e?Ce.parse:Ce.parseInline)(o,a);return a.hooks&&(l=a.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Ne(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Lt=new Qh;function K(e,t){return Lt.parse(e,t)}K.options=K.setOptions=function(e){return Lt.setOptions(e),K.defaults=Lt.defaults,pc(K.defaults),K};K.getDefaults=Ei;K.defaults=Rt;K.use=function(...e){return Lt.use(...e),K.defaults=Lt.defaults,pc(K.defaults),K};K.walkTokens=function(e,t){return Lt.walkTokens(e,t)};K.parseInline=Lt.parseInline;K.Parser=Ce;K.parser=Ce.parse;K.Renderer=bs;K.TextRenderer=Fi;K.Lexer=_e;K.lexer=_e.lex;K.Tokenizer=ys;K.Hooks=bn;K.parse=K;K.options;K.setOptions;K.use;K.walkTokens;K.parseInline;Ce.parse;_e.lex;K.setOptions({gfm:!0,breaks:!0,mangle:!1});const ws=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],ks=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width"];let $r=!1;const Xh=14e4,Jh=14e4,Zh=200,ba=5e4,xt=new Map;function ef(e){const t=xt.get(e);return t===void 0?null:(xt.delete(e),xt.set(e,t),t)}function Sr(e,t){if(xt.set(e,t),xt.size<=Zh)return;const n=xt.keys().next().value;n&&xt.delete(n)}function Bi(){$r||($r=!0,Rn.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function ke(e){const t=e.trim();if(!t)return"";if(Bi(),t.length<=ba){const o=ef(t);if(o!==null)return o}const n=rc(t,Xh),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Jh){const l=`<pre class="code-block">${sf(`${n.text}${s}`)}</pre>`,c=Rn.sanitize(l,{ALLOWED_TAGS:ws,ALLOWED_ATTR:ks});return t.length<=ba&&Sr(t,c),c}const a=K.parse(`${n.text}${s}`),i=Rn.sanitize(a,{ALLOWED_TAGS:ws,ALLOWED_ATTR:ks});return t.length<=ba&&Sr(t,i),i}function tf(e){const t=e.trim();if(!t)return"";Bi();const n=K.parse(t);return Rn.sanitize(n,{ALLOWED_TAGS:ws,ALLOWED_ATTR:ks}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}function nf(e){const t=e.trim();return t?(Bi(),Rn.sanitize(t,{ALLOWED_TAGS:ws,ALLOWED_ATTR:ks,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}function sf(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const af=500;let vt="",yt="";function of(e){const t=e.trim();if(!t)return"";if(t.length<af)return ke(t);const n=lf(t);if(n<0)return ke(t);const s=t.slice(0,n),a=t.slice(n);if(s===vt)return yt+ke(a);if(s.startsWith(vt)&&vt.length>0){const i=s.slice(vt.length);return yt=yt+ke(i),vt=s,yt+ke(a)}return yt=ke(s),vt=s,yt+ke(a)}function rf(){vt="",yt=""}function lf(e){let t=!1,n="";const s=[];let a=0;for(;a<e.length;){const i=e.indexOf(`
`,a),o=i===-1?e.length:i,l=e.slice(a,o),c=l.trimStart(),d=c.match(/^(`{3,}|~{3,})/);if(d){const u=d[1];t?u.charAt(0)===n.charAt(0)&&u.length>=n.length&&c.slice(u.length).trim()===""&&(t=!1,n=""):(t=!0,n=u)}if(!t&&l.trim()===""){let u=o+1;for(;u<e.length&&e[u]===`
`;)u++;u<e.length&&(s.length===0||s[s.length-1]!==u)&&s.push(u)}a=i===-1?e.length:i+1}return s.length<2?-1:s[s.length-2]}const G={messageSquare:r`
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
  `,flask:r`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `},cf=1500,df=2e3,Ac="Copy as markdown",uf="Copied",pf="Copy failed";async function hf(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function ns(e,t){e.title=t,e.setAttribute("aria-label",t)}function ff(e){const t=e.label??Ac;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const a=await hf(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!a){s.dataset.error="1",ns(s,pf),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,ns(s,t))},df);return}s.dataset.copied="1",ns(s,uf),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,ns(s,t))},cf)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${G.copy}</span>
        <span class="chat-copy-btn__icon-check">${G.check}</span>
      </span>
    </button>
  `}function gf(e){return ff({text:()=>e,label:Ac})}const Ar="NO_REPLY",mf=/^\[([^\]]+)\]\s*/,vf=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],wa=new WeakMap,ka=new WeakMap;function yf(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:vf.some(t=>e.startsWith(`${t} `))}function $a(e){const t=e.match(mf);if(!t)return e;const n=t[1]??"";return yf(n)?e.slice(t[0].length):e}function Sa(e){const t=e.trim();return t===Ar||t.startsWith(`${Ar}
`)}function ti(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const a=n==="assistant"?pa(s):$a(s);return Sa(a)?null:a}if(Array.isArray(s)){const a=s.map(i=>{const o=i;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(i=>typeof i=="string");if(a.length>0){const i=a.join(`
`),o=n==="assistant"?pa(i):$a(i);return Sa(o)?null:o}}if(typeof t.text=="string"){const a=n==="assistant"?pa(t.text):$a(t.text);return Sa(a)?null:a}return null}function xc(e){if(!e||typeof e!="object")return ti(e);const t=e;if(wa.has(t))return wa.get(t)??null;const n=ti(e);return wa.set(t,n),n}function xr(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const c=l;if(c.type==="thinking"&&typeof c.thinking=="string"){const d=c.thinking.trim();d&&s.push(d)}}if(s.length>0)return s.join(`
`);const a=wf(e);if(!a)return null;const o=[...a.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function bf(e){if(!e||typeof e!="object")return xr(e);const t=e;if(ka.has(t))return ka.get(t)??null;const n=xr(e);return ka.set(t,n),n}function wf(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(a=>{const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>typeof a=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function kf(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}function Tc(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",a=t.content,i=Array.isArray(a)?a:null,o=Array.isArray(i)&&i.some(f=>{const g=f,m=(typeof g.type=="string"?g.type:"").toLowerCase();return m==="toolresult"||m==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||l)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(f=>({type:f.type||"text",text:f.text,name:f.name,args:f.args||f.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const d=typeof t.timestamp=="number"?t.timestamp:Date.now(),u=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:d,id:u}}function Ui(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function _c(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const $f={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Sf={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Af={fallback:$f,tools:Sf},Cc=Af,Tr=Cc.fallback??{icon:"puzzle"},xf=Cc.tools??{};function Tf(e){return(e??"tool").trim()}function _f(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Cf(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function Lc(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>Lc(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function Lf(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function Ef(e,t){for(const n of t){const s=Lf(e,n),a=Lc(s);if(a)return a}}function Mf(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,a=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&a!==void 0?`${n}:${s}-${s+a}`:n}function Rf(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Pf(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function If(e){const t=Tf(e.name),n=t.toLowerCase(),s=xf[n],a=s?.icon??Tr.icon??"puzzle",i=s?.title??_f(t),o=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof l=="string"?l.trim():void 0,d=Pf(s,c),u=Cf(d?.label??c);let f;n==="read"&&(f=Mf(e.args)),!f&&(n==="write"||n==="edit"||n==="attach")&&(f=Rf(e.args));const g=d?.detailKeys??s?.detailKeys??Tr.detailKeys??[];return!f&&g.length>0&&(f=Ef(e.args,g)),!f&&e.meta&&(f=e.meta),f&&(f=Nf(f)),{name:t,icon:a,title:i,label:o,verb:u,detail:f}}function Df(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Nf(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Of=80,Ff=2,_r=100,Bf=3;function Uf(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function zf(e){const t=e.split(`
`),n=t.slice(0,Ff),s=n.join(`
`);return s.length>_r?s.slice(0,_r)+"…":n.length<t.length?s+"…":s}function Kf(e){const t=e,n=Wf(t.content),s=[];for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(i)||typeof a.name=="string"&&a.arguments!=null)&&s.push({kind:"call",name:a.name??"tool",args:jf(a.arguments??a.args)})}for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();if(i!=="toolresult"&&i!=="tool_result")continue;const o=Hf(a);if(Lr(o))continue;const l=typeof a.name=="string"?a.name:"tool";s.push({kind:"result",name:l,text:o})}if(_c(e)&&!s.some(a=>a.kind==="result")){const a=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",i=xc(e)??void 0;Lr(i)||s.push({kind:"result",name:a,text:i})}return s}function Cr(e,t){const n=If({name:e.name,args:e.args}),s=Df(n),a=!!e.text?.trim(),i=!!t,o=i?m=>{if(m.stopPropagation(),a){t(Uf(e.text));return}const w=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(w)}:void 0,l=e.text?e.text.split(`
`).length:0,c=a&&(e.text?.length??0)<=Of,d=a&&!c&&l>Bf,u=a&&!d,f=!a,g=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${g} ${i?"chat-tool-card--clickable":""}"
      @click=${o}
      role=${i?"button":h}
      tabindex=${i?"0":h}
      @keydown=${i?m=>{m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),m.stopPropagation(),o?.(m))}:h}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${G[n.icon]}</span>
          <span>${n.label}</span>
        </div>
        ${i?r`<span class="chat-tool-card__action">${a?"View":""} ${G.check}</span>`:h}
        ${f&&!i?r`<span class="chat-tool-card__status">${G.check}</span>`:h}
      </div>
      ${s?r`<div class="chat-tool-card__detail">${s}</div>`:h}
      ${f?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:h}
      ${d?r`<details class="chat-tool-card__expandable" @click=${m=>m.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${zf(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:h}
      ${u?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:h}
    </div>
  `}function Wf(e){return Array.isArray(e)?e.filter(Boolean):[]}function jf(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Hf(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Lr(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}const Er={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function Ec(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=Er[t]??Er.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}const Mr={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function Vf(e){const t=e.split(".").pop()?.toLowerCase()||"";return Mr[t]??Mr.default}function qf(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File"}[n]||e.split("/")[1]?.toUpperCase()||"File"}function Gf(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],a=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let i;for(;(i=a.exec(n))!==null;)s.push({fileName:i[1].trim(),fileId:i[2].trim(),size:i[3].trim(),mimeType:i[4].trim()});return s.length>0?s:null}function Yf(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${Vf(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${qf(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function Qf(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}function Xf(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")){const i=e.indexOf(`

`);return i!==-1?e.slice(i+2).trim():""}let a=e.split(`
`).filter(i=>{const o=i.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;a.startsWith(`
`);)a=a.slice(1);return a.trim()}function Jf(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function ni(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"){const l=o.source;if(l?.type==="base64"&&typeof l.data=="string"){const c=l.data,d=l.media_type||"image/png",u=c.startsWith("data:")?c:`data:${d};base64,${c}`;s.push({url:u})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const c=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:c})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const l=o.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,c=o.text.match(l);if(c)for(const d of c)s.push({url:d})}if(Array.isArray(o.content))for(const l of o.content){if(typeof l!="object"||l===null)continue;const c=l;if(c.type==="image"){const d=c.source;if(d?.type==="base64"&&typeof d.data=="string"){const u=d.media_type||"image/png",f=d.data.startsWith("data:")?d.data:`data:${u};base64,${d.data}`;s.push({url:f})}else if(typeof c.data=="string"&&typeof c.mimeType=="string"){const u=c.data.startsWith("data:")?c.data:`data:${c.mimeType};base64,${c.data}`;s.push({url:u})}else c.omitted===!0&&s.push({omitted:!0,bytes:typeof c.bytes=="number"?c.bytes:void 0,mimeType:typeof c.mimeType=="string"?c.mimeType:void 0,alt:typeof c.fileName=="string"?c.fileName:void 0})}}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"&&typeof o.content=="string"){const l=o.mimeType||"image/png",c=o.content.startsWith("data:")?o.content:`data:${l};base64,${o.content}`;s.push({url:c,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function Zf(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="attachment"&&typeof o.content=="string"){const l=o.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:l,content:o.content})}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function eg(e,t){return r`
    <div class="chat-group assistant">
      ${zi("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Ec(t.name)}</span>
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
  `}function tg(e,t,n,s,a){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${zi("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${a?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Ec(a.name)}</span>
                    <strong>${a.name}</strong>
                  </span>
                </div>
                ${a.details?r`<span class="chat-working-indicator__details">${a.details}</span>`:h}
              </div>
            `:h}
        ${Mc({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function ng(e,t){const n=Ui(e.role),s=t.assistantName??"Assistant",a=t.userName??"You",i=n==="user"?a:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${zi(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:a,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,d)=>Mc(c.message,{isStreaming:e.isStreaming&&d===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onImageClick,t.resolveImageUrl))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function zi(e,t){const n=Ui(e),s=t?.assistantName?.trim()||"Assistant",a=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",i=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&Rr(o)?r`<img
        class="chat-avatar ${l}"
        src="${o}"
        alt="${i}"
      />`:o?r`<div class="chat-avatar ${l}">${o}</div>`:r`<div class="chat-avatar ${l}">${i.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?a&&Rr(a)?r`<img
        class="chat-avatar ${l}"
        src="${a}"
        alt="${s}"
      />`:a?r`<div class="chat-avatar ${l}" style="color: var(--accent);">${a}</div>`:r`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${l}">⚙</div>`:r`<div class="chat-avatar ${l}">?</div>`}function Rr(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Pr(e,t,n){if(e.length===0)return h;const s=e.map((i,o)=>{if((i.omitted||!i.url)&&n){const l=n(o);if(l)return{...i,resolvedUrl:l}}return i}),a=s.filter(i=>(i.resolvedUrl||i.url)&&!i.omitted||i.resolvedUrl).map(i=>({url:i.resolvedUrl||i.url,alt:i.alt}));return r`
    <div class="chat-message-images">
      ${s.map(i=>{const o=i.resolvedUrl||i.url;if(!o){const c=Jf(i.bytes),u=[i.mimeType?i.mimeType.replace("image/","").toUpperCase():null,c,"preview omitted"].filter(Boolean).join(" - ");return r`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${i.alt??"Attached image"}
              aria-label="Attached image preview omitted"
            >
              <span class="chat-message-image__omitted-label">Image attached</span>
              <span class="chat-message-image__omitted-meta">${u}</span>
            </div>
          `}const l=a.findIndex(c=>c.url===o);return r`
          <img
            src=${o}
            alt=${i.alt??"Attached image"}
            class="chat-message-image"
            @error=${c=>{const d=c.target;d.style.display="none"}}
            @click=${()=>{t&&t(o,a,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function sg(e){return e.length===0?h:r`
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
  `}function Mc(e,t,n,s,a){try{return ag(e,t,n,s,a)}catch(i){return console.error("[chat] message render error:",i),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function ag(e,t,n,s,a){const i=e,o=typeof i.role=="string"?i.role:"unknown",l=_c(e)||o.toLowerCase()==="toolresult"||o.toLowerCase()==="tool_result"||typeof i.toolCallId=="string"||typeof i.tool_call_id=="string",c=Kf(e),d=c.length>0,u=ni(e),f=u.length>0,g=typeof i._chatIdx=="number"?i._chatIdx:-1,m=a&&g>=0?j=>a(g,j):void 0,w=Zf(e),S=w.length>0,x=xc(e),C=t.showReasoning&&o==="assistant"?bf(e):null,p=o==="user"&&x?Gf(x):null,$=p&&p.length>0;let A=x;o==="user"&&A&&(A=Xf(A)),$&&A&&(A=Qf(A));const T=A?.trim()?A:null,L=C?kf(C):null,E=T,F=o==="assistant"&&!!E?.trim(),V=["chat-bubble",F?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(d&&l)return r`
      ${f?Pr(u,s,m):h}
      ${c.map(j=>Cr(j,n))}
    `;if(!E&&!d&&!f&&!S&&!$&&!L){const j=typeof i.errorMessage=="string"?i.errorMessage:null;if(i.stopReason==="error"&&j){let H=j;const se=j.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(se){const ge=parseInt(se[1]).toLocaleString(),D=parseInt(se[2]).toLocaleString();H=`Context overflow: ${ge} tokens exceeded the ${D} token limit. The conversation needs to be compacted.`}else j.includes("prompt is too long")&&(H="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${H}</div>
        </div>
      `}return h}return r`
    <div class="${V}">
      ${F?gf(E):h}
      ${$?Yf(p):h}
      ${Pr(u,s,m)}
      ${sg(w)}
      ${L?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${lt(ke(L))}</div>
            </details>`:h}
      ${E?r`<div class="chat-text">${lt(t.isStreaming?of(E):ke(E))}</div>`:h}
      ${c.map(j=>Cr(j,n))}
    </div>
  `}function ig(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,a=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:h}
      </div>
      <div class="chat-compaction-summary__content">
        ${lt(ke(n))}
      </div>
      ${a?r`<div class="chat-compaction-summary__timestamp">${a}</div>`:h}
    </div>
  `}function og(e){return e.isCompactionSummary===!0}async function rg(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}const Rc=50,Pc=200,lg="Assistant";function $s(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function si(e){const t=$s(e?.name,Rc)??lg,n=$s(e?.avatar??void 0,Pc)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function cg(){return si(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const dg="You";function Ir(e){const t=$s(e?.name,Rc)??dg,n=$s(e?.avatar??void 0,Pc)??null;return{name:t,avatar:n}}function ug(){return Ir(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function Ic(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const a=await e.client.request("agent.identity.get",s);if(!a)return;const i=si(a);e.assistantName=i.name,e.assistantAvatar=i.avatar,e.assistantAgentId=i.agentId??null}catch{}}let Dr=!1;function Nr(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function pg(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function hg(){Dr||(Dr=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function Bs(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Nr(t)}return hg(),Nr(pg())}let bt=null,ls=null;function Dc(){return ls}const Ss=new Map,Be=new Map;function ai(e,t){const n=t.filter(s=>s?.role==="user").length;Ss.set(e,n)}async function Ki(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return Be.set(t,s),ai(t,s),s}catch{return Be.get(t)??[]}}let Ut=0;async function ce(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Ut;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Ut||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ai(t,e.chatMessages),Be.set(t,e.chatMessages)}catch{if(n!==Ut||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Ut||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ai(t,e.chatMessages),Be.set(t,e.chatMessages)}catch(s){if(n!==Ut||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Ut&&(e.chatLoading=!1)}}function fg(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Wi(e,t,n,s){if(!e.client||!e.connected)return!1;let a=t.trim();const i=n&&n.length>0;if(!a&&!i)return!1;!a&&i&&(a=n.some(u=>u.mimeType.startsWith("image/"))?"What's in this image?":"See attached file.");const o=Date.now();if(!s?.skipOptimisticUpdate){const d=[];if(a&&d.push({type:"text",text:a}),i)for(const u of n)u.mimeType.startsWith("image/")?d.push({type:"image",source:{type:"base64",media_type:u.mimeType,data:u.dataUrl}}):d.push({type:"attachment",mimeType:u.mimeType,fileName:u.fileName,content:u.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:d,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=Bs();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=o,bt={message:a,attachments:i?n:void 0};let c;if(i){const d=[],u=[];for(const f of n){const g=fg(f.dataUrl);if(g)if(g.mimeType.startsWith("image/"))d.push({type:"image",mimeType:g.mimeType,content:g.content,fileName:f.fileName});else{const m=f.fileName||"file";u.push(`<document>
<source>${m}</source>
<mime_type>${g.mimeType}</mime_type>
<content encoding="base64">
${g.content}
</content>
</document>`)}}if(d.length>0&&(c=d),u.length>0&&(a=`${u.join(`

`)}

${a}`),d.length>0){const f=e.chatMessages.length-1,g=e.sessionKey,m=e.client.request("images.cache",{images:d.map(w=>({data:w.content,mimeType:w.mimeType,fileName:w.fileName})),sessionKey:g}).then(w=>{if(w?.cached&&w.cached.length>0){const S=w.cached.map((x,C)=>({messageIndex:f,imageIndex:C,hash:x.hash,mimeType:x.mimeType,bytes:x.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:g,images:S}).catch(()=>{})}}).catch(()=>{});ls=m,m.finally(()=>{ls===m&&(ls=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:a,deliver:!1,idempotencyKey:l,attachments:c,...e.chatPrivateMode?{privateMode:!0}:{}}),!0}catch(d){const u=String(d);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=u,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+u}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Nc(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,Wi(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function gg(e){e.pendingRetry=null}async function ji(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Oc(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&rf(),t.state==="delta"){const n=ti(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatStream&&e.chatStream.trim()&&(e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:e.chatStream}],timestamp:Date.now()}]),e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,bt=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,bt=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&bt&&(e.pendingRetry={message:bt.message,attachments:bt.attachments,timestamp:Date.now()}),bt=null;let a=n;if(s){const i=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(i){const o=parseInt(i[1]).toLocaleString(),l=parseInt(i[2]).toLocaleString();a=`⚠️ Context overflow: ${o} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else a='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:a}],timestamp:Date.now(),isError:!0}]}return t.state}const mg=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:ji,clearPendingRetry:gg,getPendingImageCache:Dc,handleChatEvent:Oc,laneMessageCache:Be,loadChatHistory:ce,loadLaneHistory:Ki,retryPendingMessage:Nc,sendChatMessage:Wi,sessionTurnCounts:Ss},Symbol.toStringTag,{value:"Module"})),Fc="godmode.device.auth.v1";function Hi(e){return e.trim()}function vg(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function Vi(){try{const e=window.localStorage.getItem(Fc);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Bc(e){try{window.localStorage.setItem(Fc,JSON.stringify(e))}catch{}}function yg(e){const t=Vi();if(!t||t.deviceId!==e.deviceId)return null;const n=Hi(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Uc(e){const t=Hi(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=Vi();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const a={token:e.token,role:t,scopes:vg(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=a,Bc(n),a}function zc(e){const t=Vi();if(!t||t.deviceId!==e.deviceId)return;const n=Hi(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Bc(s)}const Kc={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:le,n:cs,Gx:Or,Gy:Fr,a:Aa,d:xa,h:bg}=Kc,Et=32,qi=64,wg=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},te=(e="")=>{const t=new Error(e);throw wg(t,te),t},kg=e=>typeof e=="bigint",$g=e=>typeof e=="string",Sg=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",ct=(e,t,n="")=>{const s=Sg(e),a=e?.length,i=t!==void 0;if(!s||i&&a!==t){const o=n&&`"${n}" `,l=i?` of length ${t}`:"",c=s?`length=${a}`:`type=${typeof e}`;te(o+"expected Uint8Array"+l+", got "+c)}return e},Us=e=>new Uint8Array(e),Wc=e=>Uint8Array.from(e),jc=(e,t)=>e.toString(16).padStart(t,"0"),Hc=e=>Array.from(ct(e)).map(t=>jc(t,2)).join(""),je={_0:48,_9:57,A:65,F:70,a:97,f:102},Br=e=>{if(e>=je._0&&e<=je._9)return e-je._0;if(e>=je.A&&e<=je.F)return e-(je.A-10);if(e>=je.a&&e<=je.f)return e-(je.a-10)},Vc=e=>{const t="hex invalid";if(!$g(e))return te(t);const n=e.length,s=n/2;if(n%2)return te(t);const a=Us(s);for(let i=0,o=0;i<s;i++,o+=2){const l=Br(e.charCodeAt(o)),c=Br(e.charCodeAt(o+1));if(l===void 0||c===void 0)return te(t);a[i]=l*16+c}return a},qc=()=>globalThis?.crypto,Ag=()=>qc()?.subtle??te("crypto.subtle must be defined, consider polyfill"),Pn=(...e)=>{const t=Us(e.reduce((s,a)=>s+ct(a).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},xg=(e=Et)=>qc().getRandomValues(Us(e)),As=BigInt,wt=(e,t,n,s="bad number: out of range")=>kg(e)&&t<=e&&e<n?e:te(s),R=(e,t=le)=>{const n=e%t;return n>=0n?n:t+n},Gc=e=>R(e,cs),Tg=(e,t)=>{(e===0n||t<=0n)&&te("no inverse n="+e+" mod="+t);let n=R(e,t),s=t,a=0n,i=1n;for(;n!==0n;){const o=s/n,l=s%n,c=a-i*o;s=n,n=l,a=i,i=c}return s===1n?R(a,t):te("no inverse")},_g=e=>{const t=Jc[e];return typeof t!="function"&&te("hashes."+e+" not set"),t},Ta=e=>e instanceof Se?e:te("Point expected"),ii=2n**256n;class Se{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,a){const i=ii;this.X=wt(t,0n,i),this.Y=wt(n,0n,i),this.Z=wt(s,1n,i),this.T=wt(a,0n,i),Object.freeze(this)}static CURVE(){return Kc}static fromAffine(t){return new Se(t.x,t.y,1n,R(t.x*t.y))}static fromBytes(t,n=!1){const s=xa,a=Wc(ct(t,Et)),i=t[31];a[31]=i&-129;const o=Qc(a);wt(o,0n,n?ii:le);const c=R(o*o),d=R(c-1n),u=R(s*c+1n);let{isValid:f,value:g}=Lg(d,u);f||te("bad point: y not sqrt");const m=(g&1n)===1n,w=(i&128)!==0;return!n&&g===0n&&w&&te("bad point: x==0, isLastByteOdd"),w!==m&&(g=R(-g)),new Se(g,o,1n,R(g*o))}static fromHex(t,n){return Se.fromBytes(Vc(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=Aa,n=xa,s=this;if(s.is0())return te("bad point: ZERO");const{X:a,Y:i,Z:o,T:l}=s,c=R(a*a),d=R(i*i),u=R(o*o),f=R(u*u),g=R(c*t),m=R(u*R(g+d)),w=R(f+R(n*R(c*d)));if(m!==w)return te("bad point: equation left != right (1)");const S=R(a*i),x=R(o*l);return S!==x?te("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:a}=this,{X:i,Y:o,Z:l}=Ta(t),c=R(n*l),d=R(i*a),u=R(s*l),f=R(o*a);return c===d&&u===f}is0(){return this.equals(Wt)}negate(){return new Se(R(-this.X),this.Y,this.Z,R(-this.T))}double(){const{X:t,Y:n,Z:s}=this,a=Aa,i=R(t*t),o=R(n*n),l=R(2n*R(s*s)),c=R(a*i),d=t+n,u=R(R(d*d)-i-o),f=c+o,g=f-l,m=c-o,w=R(u*g),S=R(f*m),x=R(u*m),C=R(g*f);return new Se(w,S,C,x)}add(t){const{X:n,Y:s,Z:a,T:i}=this,{X:o,Y:l,Z:c,T:d}=Ta(t),u=Aa,f=xa,g=R(n*o),m=R(s*l),w=R(i*f*d),S=R(a*c),x=R((n+s)*(o+l)-g-m),C=R(S-w),p=R(S+w),$=R(m-u*g),A=R(x*C),T=R(p*$),L=R(x*$),E=R(C*p);return new Se(A,T,E,L)}subtract(t){return this.add(Ta(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return Wt;if(wt(t,1n,cs),t===1n)return this;if(this.equals(Mt))return Ug(t).p;let s=Wt,a=Mt;for(let i=this;t>0n;i=i.double(),t>>=1n)t&1n?s=s.add(i):n&&(a=a.add(i));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(Wt))return{x:0n,y:1n};const a=Tg(s,le);R(s*a)!==1n&&te("invalid inverse");const i=R(t*a),o=R(n*a);return{x:i,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Yc(n);return s[31]|=t&1n?128:0,s}toHex(){return Hc(this.toBytes())}clearCofactor(){return this.multiply(As(bg),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(cs/2n,!1).double();return cs%2n&&(t=t.add(this)),t.is0()}}const Mt=new Se(Or,Fr,1n,R(Or*Fr)),Wt=new Se(0n,1n,1n,0n);Se.BASE=Mt;Se.ZERO=Wt;const Yc=e=>Vc(jc(wt(e,0n,ii),qi)).reverse(),Qc=e=>As("0x"+Hc(Wc(ct(e)).reverse())),Ie=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=le;return n},Cg=e=>{const n=e*e%le*e%le,s=Ie(n,2n)*n%le,a=Ie(s,1n)*e%le,i=Ie(a,5n)*a%le,o=Ie(i,10n)*i%le,l=Ie(o,20n)*o%le,c=Ie(l,40n)*l%le,d=Ie(c,80n)*c%le,u=Ie(d,80n)*c%le,f=Ie(u,10n)*i%le;return{pow_p_5_8:Ie(f,2n)*e%le,b2:n}},Ur=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Lg=(e,t)=>{const n=R(t*t*t),s=R(n*n*t),a=Cg(e*s).pow_p_5_8;let i=R(e*n*a);const o=R(t*i*i),l=i,c=R(i*Ur),d=o===e,u=o===R(-e),f=o===R(-e*Ur);return d&&(i=l),(u||f)&&(i=c),(R(i)&1n)===1n&&(i=R(-i)),{isValid:d||u,value:i}},oi=e=>Gc(Qc(e)),Gi=(...e)=>Jc.sha512Async(Pn(...e)),Eg=(...e)=>_g("sha512")(Pn(...e)),Xc=e=>{const t=e.slice(0,Et);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Et,qi),s=oi(t),a=Mt.multiply(s),i=a.toBytes();return{head:t,prefix:n,scalar:s,point:a,pointBytes:i}},Yi=e=>Gi(ct(e,Et)).then(Xc),Mg=e=>Xc(Eg(ct(e,Et))),Rg=e=>Yi(e).then(t=>t.pointBytes),Pg=e=>Gi(e.hashable).then(e.finish),Ig=(e,t,n)=>{const{pointBytes:s,scalar:a}=e,i=oi(t),o=Mt.multiply(i).toBytes();return{hashable:Pn(o,s,n),finish:d=>{const u=Gc(i+oi(d)*a);return ct(Pn(o,Yc(u)),qi)}}},Dg=async(e,t)=>{const n=ct(e),s=await Yi(t),a=await Gi(s.prefix,n);return Pg(Ig(s,a,n))},Jc={sha512Async:async e=>{const t=Ag(),n=Pn(e);return Us(await t.digest("SHA-512",n.buffer))},sha512:void 0},Ng=(e=xg(Et))=>e,Og={getExtendedPublicKeyAsync:Yi,getExtendedPublicKey:Mg,randomSecretKey:Ng},xs=8,Fg=256,Zc=Math.ceil(Fg/xs)+1,ri=2**(xs-1),Bg=()=>{const e=[];let t=Mt,n=t;for(let s=0;s<Zc;s++){n=t,e.push(n);for(let a=1;a<ri;a++)n=n.add(t),e.push(n);t=n.double()}return e};let zr;const Kr=(e,t)=>{const n=t.negate();return e?n:t},Ug=e=>{const t=zr||(zr=Bg());let n=Wt,s=Mt;const a=2**xs,i=a,o=As(a-1),l=As(xs);for(let c=0;c<Zc;c++){let d=Number(e&o);e>>=l,d>ri&&(d-=i,e+=1n);const u=c*ri,f=u,g=u+Math.abs(d)-1,m=c%2!==0,w=d<0;d===0?s=s.add(Kr(m,t[f])):n=n.add(Kr(w,t[g]))}return e!==0n&&te("invalid wnaf"),{p:n,f:s}},_a="godmode-device-identity-v1";function li(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function ed(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),a=new Uint8Array(s.length);for(let i=0;i<s.length;i+=1)a[i]=s.charCodeAt(i);return a}function zg(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function td(e){const t=await crypto.subtle.digest("SHA-256",e);return zg(new Uint8Array(t))}async function Kg(){const e=Og.randomSecretKey(),t=await Rg(e);return{deviceId:await td(t),publicKey:li(t),privateKey:li(e)}}async function Qi(){try{const n=localStorage.getItem(_a);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const a=await td(ed(s.publicKey));if(a!==s.deviceId){const i={...s,deviceId:a};return localStorage.setItem(_a,JSON.stringify(i)),{deviceId:a,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Kg(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(_a,JSON.stringify(t)),e}async function Wg(e,t){const n=ed(e),s=new TextEncoder().encode(t),a=await Dg(s,n);return li(a)}async function dt(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function jg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await dt(e)}catch(n){e.devicesError=String(n)}}async function Hg(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await dt(e)}catch(s){e.devicesError=String(s)}}async function Vg(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await Qi(),a=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Uc({deviceId:s.deviceId,role:a,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await dt(e)}catch(n){e.devicesError=String(n)}}async function qg(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await Qi();t.deviceId===s.deviceId&&zc({deviceId:s.deviceId,role:t.role}),await dt(e)}catch(s){e.devicesError=String(s)}}function ci(e){return typeof e=="object"&&e!==null}function Gg(e){if(!ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!ci(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const a=typeof e.createdAtMs=="number"?e.createdAtMs:0,i=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!a||!i?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:a,expiresAtMs:i}}function Yg(e){if(!ci(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function nd(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function Qg(e,t){const n=nd(e).filter(s=>s.id!==t.id);return n.push(t),n}function Wr(e,t){return nd(e).filter(n=>n.id!==t)}async function sd(e){if(!(!e.client||!e.connected)){e.missionLoading=!0,e.missionError=null;try{const[t,n,s,a]=await Promise.all([e.client.request("agents.list",{}).catch(()=>null),e.client.request("agentLog.get",{}).catch(()=>null),e.client.request("subagents.list",{limit:50}).catch(()=>null),e.client.request("tasks.list",{status:"pending"}).catch(()=>null)]),i=t;i?.agents&&(e.missionAgents=im(i.agents,e.workingSessions??new Set));const o=n;o?.activeRuns&&(e.missionActiveRuns=o.activeRuns.map(d=>({runId:d.runId,sessionKey:d.sessionKey,agentName:Xi(d.sessionKey),agentEmoji:am(d.sessionKey,e.missionAgents),startedAt:d.startedAt,durationMs:d.durationMs})));const l=s;l?.runs&&(e.missionSubagentRuns=l.runs);const c=a;c?.tasks&&(e.missionTasks=c.tasks)}catch(t){console.error("[Mission] Failed to load mission data:",t),e.missionError=String(t)}finally{e.missionLoading=!1}}}async function Xg(e){await sd(e)}async function Jg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("tasks.update",{id:t,status:"complete",completedAt:new Date().toISOString()}),e.missionTasks=e.missionTasks.filter(n=>n.id!==t),Tt(e,{agent:"You",action:"completed task",details:e.missionTasks.find(n=>n.id===t)?.title??t})}catch(n){console.error("[Mission] Failed to complete task:",n)}}const Zg=50;let em=0;function Tt(e,t){const n={id:`feed-${++em}-${Date.now()}`,timestamp:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),...t};e.missionFeedItems=[n,...e.missionFeedItems].slice(0,Zg)}function tm(e,t){if(!t)return;const n=t.data??{},s=t.sessionKey??"unknown",a=Xi(s);if(t.stream==="tool"){const i=typeof n.phase=="string"?n.phase:"",o=typeof n.name=="string"?n.name:"tool";i==="start"&&Tt(e,{agent:a,action:"using",details:o});return}if(t.stream==="message"){(typeof n.phase=="string"?n.phase:"")==="start"&&Tt(e,{agent:a,action:"thinking",details:di(s,e.sessionsResult)});return}if(t.stream==="final"){Tt(e,{agent:a,action:"finished",details:di(s,e.sessionsResult)});return}}function nm(e,t){if(!t)return;const n=t.sessionKey??"unknown",s=Xi(n),a=di(n,e.sessionsResult);t.state==="started"?Tt(e,{agent:s,action:"started",details:a}):t.state==="final"?Tt(e,{agent:s,action:"completed",details:a}):t.state==="error"&&Tt(e,{agent:s,action:"error",details:a})}function Ca(e,t){const n=new Set;for(const s of t){const i=s.split(":")[0]?.toLowerCase();i&&n.add(i)}e.missionAgents=e.missionAgents.map(s=>({...s,status:n.has(s.id)||n.has(s.name.toLowerCase())?"WORKING":"IDLE"}))}const ad={atlas:"⚛️",oracle:"🔮",builder:"🔨",herald:"📢",sentinel:"🛡️",muse:"🎨",treasurer:"💰",main:"⚛️"},sm={atlas:"Primary",oracle:"Research",builder:"Technical",herald:"Communications",sentinel:"Security",muse:"Creative",treasurer:"Finance",main:"Primary"};function Xi(e){const t=e.split(":"),n=t[0]?.toLowerCase()??"";return{atlas:"Atlas",oracle:"Oracle",builder:"Builder",herald:"Herald",sentinel:"Sentinel",muse:"Muse",treasurer:"Treasurer",main:"Atlas",agent:t[1]?t[1].charAt(0).toUpperCase()+t[1].slice(1):"Agent"}[n]??n.charAt(0).toUpperCase()+n.slice(1)}function am(e,t){const s=e.split(":")[0]?.toLowerCase()??"",a=t.find(i=>i.id===s);return a?a.emoji:ad[s]??"🤖"}function di(e,t){if(t?.sessions){const i=t.sessions.find(o=>o.key===e);if(i?.displayName)return i.displayName}const n=e.split(":");return(n[n.length-1]??e).replace(/-[a-f0-9]{6,}$/i,"")||e}function im(e,t){const n=new Set;for(const s of t){const i=s.split(":")[0]?.toLowerCase();i&&n.add(i)}return e.map(s=>{const a=s.id.toLowerCase(),i=s.identity?.name??s.name??s.id,o=s.identity?.emoji??ad[a]??"🤖",l=sm[a]??"Agent",c=n.has(a);return{id:a,emoji:o,name:i,role:l,model:s.model??void 0,workspace:s.workspace??void 0,status:c?"WORKING":"IDLE",activeSessions:0}})}async function zs(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const it=new Map;async function ne(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,a=t?.activeMinutes??ms(e.sessionsFilterActive,0),i=t?.limit??ms(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};a>0&&(o.activeMinutes=a),i>0&&(o.limit=i);const l=await e.client.request("sessions.list",o);if(l){if(l.sessions){const c=new Map;if(e.sessionsResult?.sessions)for(const d of e.sessionsResult.sessions)d.displayName&&c.set(d.key,d.displayName);l.sessions=l.sessions.map(d=>{if(d.displayName)return d;const u=it.get(d.key);if(u)return{...d,displayName:u};const f=c.get(d.key);return f?{...d,displayName:f}:d})}e.sessionsResult=l}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function La(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{return{ok:!0,canonicalKey:(await e.client.request("sessions.patch",s))?.key??t}}catch(a){return e.sessionsError=String(a),{ok:!1}}}async function om(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await ne(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Qt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function rm(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Qt(e),await ne(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function lm(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Qt(e),await ne(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function cm(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Qt(e),await ne(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const dm=1800*1e3;function id(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,fetchOk:e.fetchOk}}function od(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,fetchOk:e.fetchOk}}async function um(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=id(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=od(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function jr(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=id(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=od(t),e.updateLastChecked=Date.now()}catch{}}}function pm(e){e.updatePollInterval==null&&(jr(e),e.updatePollInterval=window.setInterval(()=>{jr(e)},dm))}function hm(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}const rd={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Hr=rd,ui={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(rd));new Set(Object.values(ui));function fm(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",a=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&a.push(e.nonce??""),a.join("|")}const gm=4008;class mm{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let a=null,i=!1,o=this.opts.token;if(t){a=await Qi();const u=yg({deviceId:a.deviceId,role:s})?.token;o=u??this.opts.token,i=!!(u&&this.opts.token)}const l=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let c;if(t&&a){const u=Date.now(),f=this.connectNonce??void 0,g=fm({deviceId:a.deviceId,clientId:this.opts.clientName??Hr.CONTROL_UI,clientMode:this.opts.mode??ui.WEBCHAT,role:s,scopes:n,signedAtMs:u,token:o??null,nonce:f}),m=await Wg(a.privateKey,g);c={id:a.deviceId,publicKey:a.publicKey,signature:m,signedAt:u,nonce:f}}const d={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Hr.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??ui.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",d).then(u=>{u?.auth?.deviceToken&&a&&Uc({deviceId:a.deviceId,role:u.auth.role??s,token:u.auth.deviceToken,scopes:u.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(u)}).catch(()=>{i&&a&&zc({deviceId:a.deviceId,role:s}),this.ws?.close(gm,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const a=n;if(a.event==="connect.challenge"){const o=a.payload,l=o&&typeof o.nonce=="string"?o.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const i=typeof a.seq=="number"?a.seq:null;i!==null&&(this.lastSeq!==null&&i>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:i}),this.lastSeq=i);try{this.opts.onEvent?.(a)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const a=n,i=this.pending.get(a.id);if(!i)return;this.pending.delete(a.id),a.ok?i.resolve(a.payload):i.reject(new Error(a.error?.message??"request failed"));return}}request(t,n){if(console.log("[Gateway] request() called",{method:t,hasWs:!!this.ws,wsState:this.ws?.readyState,wsOpen:this.ws?.readyState===WebSocket.OPEN}),!this.ws||this.ws.readyState!==WebSocket.OPEN)return console.log("[Gateway] request() - WS not ready, rejecting"),Promise.reject(new Error("gateway not connected"));const s=Bs(),a={type:"req",id:s,method:t,params:n},i=new Promise((o,l)=>{this.pending.set(s,{resolve:c=>o(c),reject:l})});return console.log("[Gateway] Sending frame:",t,s.slice(0,8)),this.ws.send(JSON.stringify(a)),i}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const pi=new Map;let Vr=null,Ea=!1;function vm(e,t,n){return pi.get(`${e}:${t}:${n}`)??null}async function ld(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const a=e.chatMessages[s],i=ni(a);for(let o=0;o<i.length;o++)if(i[o].url&&!i[o].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(i[o].url);l&&n.push({data:l[2],mimeType:l[1],messageIndex:s,imageIndex:o,role:a.role||"unknown",timestamp:typeof a.timestamp=="number"?a.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(a=>({data:a.data,mimeType:a.mimeType})),sessionKey:t});if(s?.cached){const a=n.map((i,o)=>({messageIndex:i.messageIndex,imageIndex:i.imageIndex,hash:s.cached[o]?.hash,mimeType:i.mimeType,bytes:s.cached[o]?.bytes??0,role:i.role,timestamp:i.timestamp})).filter(i=>!!i.hash);a.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:a})}}catch{}if(!Ea){Ea=!0;try{const s=Dc();s&&await s.catch(()=>{});const a=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){Vr!==t&&pi.clear();for(const[l,c]of Object.entries(o.images))pi.set(`${t}:${l}`,c);return Vr=t,e.chatMessages=[...e.chatMessages],!0}return!1};!await a()&&e.chatMessages?.some(o=>ni(o).some(c=>c.omitted||!c.url))&&(await new Promise(o=>setTimeout(o,500)),await a())}catch{}finally{Ea=!1}}}function cd(e){ld(e)}const wn=[];function ym(){return[...wn]}let st=null;const bm=10,wm=1e3,jt=new Map;function Ma(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const a=t.mainKey?.trim()||"main",i=t.defaultAgentId?.trim();return n==="main"||n===a||i&&(n===`agent:${i}:main`||n===`agent:${i}:${a}`)?s:n}function km(e,t){if(!t?.mainSessionKey)return;const n=Ma(e.sessionKey,t),s=Ma(e.settings.sessionKey,t),a=Ma(e.settings.lastActiveSessionKey,t),i=n||s||e.sessionKey,o={...e.settings,sessionKey:s||i,lastActiveSessionKey:a||i},l=o.sessionKey!==e.settings.sessionKey||o.lastActiveSessionKey!==e.settings.lastActiveSessionKey;i!==e.sessionKey&&(e.sessionKey=i),l&&qe(e,o)}function $m(e){st&&(clearTimeout(st),st=null);const t=(e.reconnectAttempt??0)+1;if(t>bm){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(wm*Math.pow(2,t-1),3e4);st=setTimeout(()=>{st=null,e.connected||Ji(e)},n)}async function Sm(e){if(e.client)try{const t=await e.client.request("projects.list",{}),n=e;n.workspaceNeedsSetup=!t?.projects||t.projects.length===0}catch{}}async function Am(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;n&&!n.completedAt?(s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n):(s.onboardingActive=!1,s.onboardingData=n??null)}catch{}}function xm(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const qr=new Set;async function Tm(e,t){if(!(!t.includes("webchat")||qr.has(t)||e.sessionsResult?.sessions?.find(s=>s.key===t)?.displayName?.trim())){if(qr.add(t),!e.client||!e.connected){console.warn("[auto-title] skipped: not connected");return}try{const s=await e.client.request("sessions.autoTitle",{key:t});s?.ok||console.warn("[auto-title] failed:",s?.reason??"unknown"),s?.ok&&s.title&&(it.set(t,s.title),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(a=>a.key===t?{...a,displayName:s.title}:a)}),e.requestUpdate?.())}catch(s){console.error("[auto-title] RPC call failed:",s)}}}function Ji(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null;const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),"missionLoading"in t&&(t.missionLoading=!1),st&&(clearTimeout(st),st=null),e.client?.stop(),e.client=new mm({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const i=e;"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null),e.workingSessions.clear(),e.requestUpdate?.();for(const o of jt.values())clearTimeout(o);jt.clear()}Mm(e,n),Ic(e),rg(e),zs(e,{quiet:!0}),dt(e,{quiet:!0}),ne(e),Bn(e),Sm(e).then(()=>Am(e)),Lm(e),Em(e),pm(e)},onClose:({code:n,reason:s})=>{e.connected=!1,hm(e);const a=e;"chatSending"in a&&(a.chatSending=!1),"chatSendingSessionKey"in a&&(a.chatSendingSessionKey=null),"chatRunId"in a&&(a.chatRunId=null),"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const i=e;"sessionsLoading"in i&&(i.sessionsLoading=!1),"agentsLoading"in i&&(i.agentsLoading=!1),"nodesLoading"in i&&(i.nodesLoading=!1),"devicesLoading"in i&&(i.devicesLoading=!1),"channelsLoading"in i&&(i.channelsLoading=!1),"presenceLoading"in i&&(i.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),$m(e)},onEvent:n=>_m(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function _m(e,t){try{Cm(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Cm(e,t){if(wn.unshift({ts:Date.now(),event:t.event,payload:t.payload}),wn.length>250&&(wn.length=250),e.tab==="debug"&&(e.eventLog=[...wn]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.(),Ca(e,e.workingSessions))),Up(e,n),tm(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(po(e,n.sessionKey),n.state==="delta"){const a=jt.get(n.sessionKey);a&&(clearTimeout(a),jt.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.(),Ca(e,e.workingSessions))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=jt.get(n.sessionKey);a&&(clearTimeout(a),jt.delete(n.sessionKey)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.(),Ca(e,e.workingSessions)}}n.state==="final"&&xm(e,n.sessionKey);const s=Oc(e,n);nm(e,n),n.state==="final"&&(async()=>{try{await ne(e,{activeMinutes:0})}catch(a){console.error("[auto-title] loadSessions failed, proceeding anyway:",a)}Tm(e,n.sessionKey)})(),(s==="final"||s==="error"||s==="aborted")&&(Ti(e),Ud(e),s==="final"&&e.compactionStatus?.active&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()}),(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1),s==="final"&&ce(e).then(()=>{ld(e)});return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Qs(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&dt(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=Gg(t.payload);if(n){e.execApprovalQueue=Qg(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Wr(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,a=n.status==="completed"?"✓":"✗",i=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${a} Process ${o} ${n.status} (${s})`,i,5e3)}return}if(t.event==="exec.approval.resolved"){const n=Yg(t.payload);n&&(e.execApprovalQueue=Wr(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){console.log("[gateway] Daily brief update received:",n.date);const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const i={...e.dynamicSlots};delete i[n.tabId],e.dynamicSlots=i}e.requestUpdate?.()}return}if(t.event==="focusPulse:update"){const n=t.payload;if(n){const s=e;s.focusPulseData=n,s.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),s.requestUpdate?.()}return}}async function Lm(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Em(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}function Mm(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&km(e,n.sessionDefaults)}async function Ks(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,a]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const i=s;e.debugModels=Array.isArray(i?.models)?i?.models:[],e.debugHeartbeat=a}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Rm(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Pm=2e3,Im=new Set(["trace","debug","info","warn","error","fatal"]);function Dm(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function Nm(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Im.has(t)?t:null}function Om(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,a=Nm(n?.logLevelName??n?.level),i=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=Dm(i);let l=null;o&&(typeof o.subsystem=="string"?l=o.subsystem:typeof o.module=="string"&&(l=o.module)),!l&&i&&i.length<120&&(l=i);let c=null;return typeof t[1]=="string"?c=t[1]:!o&&typeof t[0]=="string"?c=t[0]:typeof t.message=="string"&&(c=t.message),{raw:e,time:s,level:a,subsystem:l,message:c??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function Zi(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),i=(Array.isArray(s.lines)?s.lines.filter(l=>typeof l=="string"):[]).map(Om),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?i:[...e.logsEntries,...i].slice(-Pm),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}function eo(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{zs(e,{quiet:!0})},5e3))}function to(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function no(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&Zi(e,{quiet:!0})},2e3))}function so(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function ao(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&Ks(e)},3e3))}function io(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}async function On(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function Ws(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function Fm(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=ms(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function Bm(e){if(e.payloadKind==="systemEvent"){const a=e.payloadText.trim();if(!a)throw new Error("System event text required.");return{kind:"systemEvent",text:a}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=ms(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function Um(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Fm(e.cronForm),n=Bm(e.cronForm),s=e.cronForm.agentId.trim(),a={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!a.name)throw new Error("Name required.");await e.client.request("cron.add",a),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await Ws(e),await On(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function zm(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await Ws(e),await On(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function Km(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await dd(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Wm(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await Ws(e),await On(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function dd(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function js(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function jm(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const a=e.guardrailsData?.gates.find(i=>i.id===t)?.name??t;e.showToast(`${a} ${n?"enabled":"disabled"}`,"success",2e3),await js(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function Hm(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await js(e)}catch(a){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",a)}}const Ra=Object.freeze(Object.defineProperty({__proto__:null,loadGuardrails:js,toggleGuardrail:jm,updateGuardrailThreshold:Hm},Symbol.toStringTag,{value:"Module"}));function Vm(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function qm(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function oo(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Vm(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Gm(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Gm(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Ct(t.file??{}))}async function Ym(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},a=qm(t,{file:s,baseHash:n});if(!a){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(a.method,a.params),e.execApprovalsDirty=!1,await oo(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Qm(e,t,n){const s=Ct(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Zl(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Xm(e,t){const n=Ct(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});ec(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function ud(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("lifetracks.config.get",{});t&&(e.lifetracksConfig=t)}catch(t){console.error("Failed to load lifetracks config:",t)}}async function Ts(e){if(!e.client||!e.connected){e.lifetracksError="Not connected to gateway";return}e.lifetracksLoading=!0,e.lifetracksError=null;try{await ud(e);const t=await e.client.request("lifetracks.list",{});if(t?.lifetracks)if(e.lifetracksData=t.lifetracks,t.lifetracks.length>0){const n=de(),s=t.lifetracks.find(a=>a.date===n);e.lifetracksCurrentTrack=s||t.lifetracks[0]}else e.lifetracksCurrentTrack=null;else e.lifetracksData=[],e.lifetracksCurrentTrack=null}catch(t){e.lifetracksError=t instanceof Error?t.message:"Failed to load lifetracks"}finally{e.lifetracksLoading=!1}}function Jm(e,t){e.lifetracksCurrentTrack=t}async function Zm(e){if(!e.client||!e.connected)return e.lifetracksError="Not connected to gateway",!1;try{const t=await e.client.request("lifetracks.config.update",{enabled:!0});return t?.updated?(e.lifetracksConfig=t.config,await Ts(e),!0):!1}catch(t){return e.lifetracksError=t instanceof Error?t.message:"Failed to enable lifetracks",!1}}async function ev(e,t){if(!e.client||!e.connected)return e.lifetracksGenerationError="Not connected to gateway",!1;e.lifetracksGenerating=!0,e.lifetracksGenerationError=null;try{const n=await e.client.request("lifetracks.generate",t||{});return n?.generated&&n.track?(e.lifetracksData=[n.track,...e.lifetracksData||[]],e.lifetracksCurrentTrack=n.track,await ud(e),!0):n?.alreadyExists&&n.track?(e.lifetracksCurrentTrack=n.track,!0):(e.lifetracksGenerationError=n?.error||"Generation failed",!1)}catch(n){return e.lifetracksGenerationError=n instanceof Error?n.message:"Failed to generate lifetrack",!1}finally{e.lifetracksGenerating=!1}}const tv=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function nv(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...tv]}function sv(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function pd(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function hd(e,t,n){const s=t||de(),a="agentLog.get";try{const i=await e.request(a,{date:s});if(i?.content?.trim()&&i?.sourcePath)return{date:i.date||s,content:i.content,updatedAt:i.updatedAt||new Date().toISOString(),sourcePath:i.sourcePath}}catch(i){console.warn(`[MyDay] ${a} unavailable, falling back to files.read:`,i)}return av(e,s)}async function av(e,t){const n=nv(t),s=a=>a.includes("AGENT-DAY.md");for(const a of n)try{const i=await e.request("files.read",{path:a,maxSize:1e6});if(!i?.content?.trim()||!sv(i.content)||s(a)&&typeof i.modifiedAt=="number"&&de(new Date(i.modifiedAt))!==t)continue;return{date:t,content:i.content,updatedAt:typeof i.modifiedAt=="number"?new Date(i.modifiedAt).toISOString():new Date().toISOString(),sourcePath:a}}catch{}return null}function ss(e,t,n){return new Promise((s,a)=>{const i=setTimeout(()=>a(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(i),s(o)},o=>{clearTimeout(i),a(o)})})}async function fd(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const n=((await e.client.request("tasks.today",{date:e.todaySelectedDate??de()})).tasks??[]).map(s=>({id:s.id,title:s.title,status:s.status,project:s.project,dueDate:s.dueDate,priority:s.priority,createdAt:s.createdAt,completedAt:s.completedAt}));return e.todayTasks=n,n}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}function gd(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function ds(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await pd(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function kt(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await hd(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function md(e){const t=e||de(),n="VAULT",s=`01-Daily/${t}`,a=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(a,"_blank")}async function _s(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?ss(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([ss(pd(e.client,t),1e4,"Daily Brief"),n,ss(hd(e.client,t),1e4,"Agent Log"),ss(fd(e),8e3,"Today Tasks")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null,gd(e.client,e.todaySelectedDate);const a=["Brief","Brief Notes","Agent Log","Today Tasks"],i=s.map((o,l)=>o.status==="rejected"?{section:a[l],reason:o.reason}:null).filter(Boolean);if(i.length>0){for(const o of i)console.warn(`[MyDay] ${o.section} failed:`,o.reason);i.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}function iv(e,t){const n=s=>{console.log("[MyDay] Received daily brief update:",s.date),t(s)};return e.on("daily-brief:update",n),()=>{e.off("daily-brief:update",n)}}function vd(e,t){const n=()=>{console.log("[MyDay] Received agent log update"),t()};return e.on("agent-log:update",n),()=>{e.off("agent-log:update",n)}}const ov=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:kt,loadBriefOnly:ds,loadMyDay:_s,loadTodayTasks:fd,openBriefInObsidian:md,subscribeToAgentLogUpdates:vd,subscribeToBriefUpdates:iv,syncTodayTasks:gd},Symbol.toStringTag,{value:"Module"}));async function yd(e){if(!(!e.client||!e.connected)){e.peopleLoading=!0,e.peopleError=null;try{const t=await e.client.request("people.list",{});e.peopleList=t.people??[]}catch(t){console.error("[People] Failed to load contacts:",t),e.peopleError=t instanceof Error?t.message:"Failed to load contacts"}finally{e.peopleLoading=!1}}}async function ro(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function Xt(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function Hs(e){return e instanceof Error?e.message:String(e)}async function Fn(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=Hs(n)}finally{e.skillsLoading=!1}}}function rv(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function lv(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await Fn(e),Xt(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const a=Hs(s);e.skillsError=a,Xt(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function cv(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await Fn(e),Xt(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=Hs(n);e.skillsError=s,Xt(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function dv(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const a=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await Fn(e),Xt(e,t,{kind:"success",message:a?.message??"Installed"})}catch(a){const i=Hs(a);e.skillsError=i,Xt(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function hi(e){if(!e.client||!e.connected){e.visionBoardError="Not connected to gateway";return}e.visionBoardLoading=!0,e.visionBoardError=null;try{const[t,n]=await Promise.all([e.client.request("visionBoard.get",{}),e.client.request("visionBoard.identityToday",{})]);t?e.visionBoardData=t:e.visionBoardError="No data returned",n&&(e.visionBoardIdentityToday=n.identity)}catch(t){e.visionBoardError=t instanceof Error?t.message:"Failed to load vision board"}finally{e.visionBoardLoading=!1}}async function Cs(e){if(!e.client||!e.connected){e.wheelOfLifeError="Not connected to gateway";return}e.wheelOfLifeLoading=!0,e.wheelOfLifeError=null;try{const t=await e.client.request("wheelOfLife.get",{});t?e.wheelOfLifeData=t:e.wheelOfLifeError="No data returned"}catch(t){e.wheelOfLifeError=t instanceof Error?t.message:"Failed to load wheel data"}finally{e.wheelOfLifeLoading=!1}}async function uv(e,t){if(!e.client||!e.connected)return e.wheelOfLifeError="Not connected to gateway",!1;try{return(await e.client.request("wheelOfLife.update",{updates:t}))?.updated?(await Cs(e),!0):!1}catch(n){return e.wheelOfLifeError=n instanceof Error?n.message:"Failed to update wheel",!1}}function pv(e){e.wheelOfLifeEditMode=!0}function Gr(e){e.wheelOfLifeEditMode=!1}async function bd(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function hv(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const a=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:a}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}function Vs(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function lo(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:Vs(e.lastUpdated,e.lastScanned)}}function Yr(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:Vs(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function Qr(e){return{id:e.id,key:e.key,title:e.title,created:Vs(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function tn(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function wd(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?Vs(t.modified):void 0,children:t.children?wd(t.children):void 0}))}function fv(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function qs(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(lo),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=fv(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function Gs(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...lo(n.workspace),pinned:(n.pinned??[]).map(Yr),pinnedSessions:(n.pinnedSessions??[]).map(Qr),outputs:(n.outputs??[]).map(Yr),folderTree:n.folderTree?wd(n.folderTree):void 0,sessions:(n.sessions??[]).map(Qr),tasks:(n.tasks??[]).map(tn)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function gv(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function mv(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await qs(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function vv(e,t){if(!t){e.selectedWorkspace=null;return}const n=await Gs(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function yv(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const a=await Gs(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] pin toggle failed:",a),!1}}async function bv(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const a=await Gs(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] session pin toggle failed:",a),!1}}async function wv(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",a=String(t.path??"").trim();try{const i=await e.client.request("workspaces.create",{name:n,type:s,...a?{path:a}:{}});if(!i.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=lo(i.workspace),l=e.workspaces??[],c=new Map(l.map(d=>[d.id,d]));return c.set(o.id,o),e.workspaces=Array.from(c.values()).toSorted((d,u)=>u.lastUpdated.getTime()-d.lastUpdated.getTime()),e.workspacesError=null,o}catch(i){return console.error("[Workspaces] create failed:",i),e.workspacesError=i instanceof Error?i.message:"Failed to create workspace",null}}async function kv(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function $v(e,t){e.workspacesSearchQuery=t}function Sv(e){e.selectedWorkspace=null}async function Av(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function xv(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function Tv(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(tn)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function _v(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(tn)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}async function Cv(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const a=await e.client.request("tasks.update",{id:t,status:s});return tn(a)}catch(a){return console.error("[Workspaces] toggleTaskComplete failed:",a),null}}async function Lv(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return tn(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function Ev(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function Mv(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return tn(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}const ye=Object.freeze(Object.defineProperty({__proto__:null,clearWorkspaceSelection:Sv,createTask:Mv,createWorkspace:wv,deleteWorkspace:kv,getWorkspace:Gs,loadAllTasks:_v,loadWorkspaceTasks:Tv,loadWorkspaces:qs,readWorkspaceFile:gv,scanWorkspaces:mv,selectWorkspace:vv,setWorkspacesSearchQuery:$v,startTask:Ev,startTeamSetup:Av,toggleTaskComplete:Cv,toggleWorkspaceFolder:xv,toggleWorkspacePin:yv,toggleWorkspaceSessionPin:bv,updateTask:Lv},Symbol.toStringTag,{value:"Module"})),Rv=[{label:"",tabs:["chat","today","workspaces"]},{label:"Control",tabs:["overview","trust","guardrails","channels","instances","sessions","cron","options"]},{label:"Agent",tabs:["skills","nodes"]},{label:"Settings",tabs:["config","debug","logs"]}],kd={options:"/options",overview:"/overview",mission:"/mission",workspaces:"/workspaces",today:"/today",work:"/work",people:"/people",life:"/life",data:"/data","my-day":"/today","wheel-of-life":"/wheel-of-life","vision-board":"/vision-board",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs"},Jt=new Map(Object.entries(kd).map(([e,t])=>[t,e]));Jt.set("/today","today");Jt.set("/my-day","today");Jt.set("/work","workspaces");function Ys(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function In(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function co(e,t=""){const n=Ys(t),s=kd[e];return n?`${n}${s}`:s}function $d(e,t=""){const n=Ys(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let a=In(s).toLowerCase();return a.endsWith("/index.html")&&(a="/"),a==="/"?"chat":Jt.get(a)??null}function Pv(e){let t=In(e);if(t.endsWith("/index.html")&&(t=In(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const a=`/${n.slice(s).join("/")}`.toLowerCase();if(Jt.has(a)){const i=n.slice(0,s);return!i.length||i.some(l=>Jt.has(`/${l.toLowerCase()}`))?"":`/${i.join("/")}`}}return`/${n.join("/")}`}function Ls(e){switch(e){case"chat":return"Chat";case"today":case"my-day":return"Today";case"work":return"Work";case"people":return"People";case"life":return"Life";case"data":return"Data";case"overview":return"Overview";case"mission":return"Mission Control";case"workspaces":return"Work";case"wheel-of-life":return"Wheel of Life";case"vision-board":return"Vision Board";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"nodes":return"Nodes";case"options":return"Lab";case"trust":return"Trust";case"guardrails":return"Guardrails";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function Iv(e){switch(e){case"chat":return"💬";case"today":case"my-day":return"☀️";case"work":return"💼";case"people":return"👥";case"life":return"✨";case"data":return"📊";case"overview":return"🎯";case"mission":return"⚡";case"workspaces":return"📂";case"wheel-of-life":return"🎡";case"vision-board":return"🌠";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function Dv(e){switch(e){case"chat":return"Your command center. Ask anything, customize any view.";case"today":case"my-day":return"Calendar, brief, tasks, and schedule for the day.";case"work":return"Your projects, files, tasks, and team — organized by workspace.";case"people":return"Contacts, relationships, and follow-up suggestions.";case"life":return"Vision board, goals, life scores, and LifeTracks.";case"data":return"Connected integrations, data sources, and query interface.";case"overview":return"Gateway status, entry points, and a fast health read.";case"mission":return"Agent orchestration — active runs, fleet status, and task queue.";case"workspaces":return"Content explorer organized by project and client.";case"wheel-of-life":return"Track balance across 8 life dimensions with scores, targets, and trends.";case"vision-board":return"Your Chief Definite Aim, annual themes, values, and identity statements.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage skill availability and API key injection.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"options":return"Toggle experimental features and modules on and off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Safety gates that prevent runaway loops, bad searches, and lazy responses.";case"config":return"Edit ~/.openclaw/config.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const Sd="godmode.ui.settings.v1";function Nv(){const e=new URLSearchParams(location.search),t=(()=>{const a=e.get("gatewayUrl");return a||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:["agent:main:main"],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const a=localStorage.getItem(Sd);if(!a)return s;const i=JSON.parse(a);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof i.gatewayUrl=="string"&&i.gatewayUrl.trim()?i.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof i.token=="string"?i.token:""),sessionKey:typeof i.sessionKey=="string"&&i.sessionKey.trim()?i.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof i.lastActiveSessionKey=="string"&&i.lastActiveSessionKey.trim()?i.lastActiveSessionKey.trim():typeof i.sessionKey=="string"&&i.sessionKey.trim()||s.lastActiveSessionKey,theme:i.theme==="light"||i.theme==="dark"||i.theme==="system"||i.theme==="lifetrack"?i.theme:s.theme,chatFocusMode:typeof i.chatFocusMode=="boolean"?i.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof i.chatShowThinking=="boolean"?i.chatShowThinking:s.chatShowThinking,splitRatio:typeof i.splitRatio=="number"&&i.splitRatio>=.4&&i.splitRatio<=.7?i.splitRatio:s.splitRatio,navCollapsed:typeof i.navCollapsed=="boolean"?i.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof i.navGroupsCollapsed=="object"&&i.navGroupsCollapsed!==null?i.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(i.openTabs)&&i.openTabs.every(o=>typeof o=="string")?i.openTabs:s.openTabs,tabLastViewed:typeof i.tabLastViewed=="object"&&i.tabLastViewed!==null?i.tabLastViewed:s.tabLastViewed,userName:typeof i.userName=="string"?i.userName.trim().slice(0,50):s.userName,userAvatar:typeof i.userAvatar=="string"?i.userAvatar.trim():s.userAvatar,chatParallelView:typeof i.chatParallelView=="boolean"?i.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(i.parallelLanes)&&i.parallelLanes.length===4?i.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function Ov(e){localStorage.setItem(Sd,JSON.stringify(e))}const Fv=56,Bv="quantum-particles",Uv="quantum-particle";let at=null,An=null;function we(e,t){return Math.random()*(t-e)+e}function Ad(){if(xd(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){An=requestAnimationFrame(()=>{An=null,Ad()});return}at=document.createElement("div"),at.className=Bv,Object.assign(at.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<Fv;t++){const n=document.createElement("div");n.className=Uv;const s=we(2,5),a=we(.3,.65),i=we(15,35),o=we(0,12),l=we(5,95),c=we(5,95),d=we(-150,150),u=we(-200,200),f=we(-250,250),g=we(-350,350),m=we(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${l}%`,top:`${c}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${we(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${a*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${i}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(a)),n.style.setProperty("--drift-x",`${d}px`),n.style.setProperty("--drift-y",`${u}px`),n.style.setProperty("--drift-end-x",`${f}px`),n.style.setProperty("--drift-end-y",`${g}px`),n.style.setProperty("--particle-scale-mid",String(m)),at.appendChild(n)}e.prepend(at)}function xd(){An!==null&&(cancelAnimationFrame(An),An=null),at&&(at.remove(),at=null)}function zv(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function uo(e){return e==="system"?zv():e}const as=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Kv=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,vn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},Wv=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const a=globalThis.document??null;if(!a){t();return}const i=a.documentElement,o=a,l=Kv();if(!!o.startViewTransition&&!l){let d=.5,u=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")d=as(n.pointerClientX/window.innerWidth),u=as(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(d=as((g.left+g.width/2)/window.innerWidth),u=as((g.top+g.height/2)/window.innerHeight))}i.style.setProperty("--theme-switch-x",`${d*100}%`),i.style.setProperty("--theme-switch-y",`${u*100}%`),i.classList.add("theme-transition");const f=setTimeout(()=>{vn(i)},1e3);try{const g=o.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>{clearTimeout(f),vn(i)}):(clearTimeout(f),vn(i))}catch{clearTimeout(f),vn(i),t()}return}t(),vn(i)};function jv(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];return n.length===0&&n.push(t),n}function Hv(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const a=n.trim();!a||typeof s!="number"||!Number.isFinite(s)||(t[a]=Math.max(t[a]??0,s))}return t}function qe(e,t){const n=t.sessionKey.trim()||"main",s=jv(t.openTabs,n),a=Hv(t.tabLastViewed),i={...t,sessionKey:n,openTabs:s,tabLastViewed:a,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=i,Ov(i),i.theme!==e.theme&&(e.theme=i.theme,Un(e,uo(i.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function po(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&qe(e,{...e.settings,lastActiveSessionKey:n})}function Td(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),a=t.get("session"),i=t.get("gatewayUrl");let o=!1;if(n!=null){const c=n.trim();c&&c!==e.settings.token&&qe(e,{...e.settings,token:c}),t.delete("token"),o=!0}if(s!=null){const c=s.trim();c&&(e.password=c),t.delete("password"),o=!0}if(a!=null){const c=a.trim();if(c){e.sessionKey=c;const d=e.settings.openTabs.includes(c)?e.settings.openTabs:[...e.settings.openTabs,c];qe(e,{...e.settings,sessionKey:c,lastActiveSessionKey:c,openTabs:d})}}if(i!=null){const c=i.trim();c&&c!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=c),t.delete("gatewayUrl"),o=!0}if(!o)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function _d(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?eo(e):to(e),t==="logs"?no(e):so(e),t==="debug"?ao(e):io(e),Bn(e),fo(e,t,!1)}function Cd(e,t,n){Wv({nextTheme:t,applyTheme:()=>{e.theme=t,qe(e,{...e.settings,theme:t}),Un(e,uo(t))},context:n,currentTheme:e.theme})}async function Bn(e){if(e.tab==="overview"&&await go(e),(e.tab==="today"||e.tab==="my-day")&&await _s(e),e.tab==="work"&&await bd(e),e.tab==="people"&&await yd(e),e.tab==="mission"&&await sd(e),e.tab==="workspaces"&&(await qs(e),q(()=>Promise.resolve().then(()=>ye),void 0,import.meta.url).then(async({loadAllTasks:t})=>{e.allTasks=await t(e)})),e.tab==="wheel-of-life"&&await Cs(e),e.tab==="vision-board"&&await hi(e),e.tab==="lifetracks"&&await Ts(e),e.tab==="life"&&await Promise.all([Cs(e),hi(e),Ts(e)]),e.tab==="data"&&e.handleDataRefresh(),e.tab==="channels"&&await Dd(e),e.tab==="instances"&&await ro(e),e.tab==="sessions"&&(await ne(e),await Qt(e)),e.tab==="cron"&&await Qs(e),e.tab==="skills"&&await Fn(e),e.tab==="nodes"&&(await zs(e),await dt(e),await Ve(e),await oo(e)),e.tab==="chat"&&(await yo(e),Yt(e,!e.chatHasAutoScrolled)),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(js(t)),n.push(ne(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}e.tab==="config"&&(await tc(e),await Ve(e)),e.tab==="debug"&&(await Ks(e),e.eventLog=ym()),e.tab==="logs"&&(e.logsAtBottom=!0,await Zi(e,{reset:!0}),ic(e,!0))}function Ld(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Ys(e):Pv(window.location.pathname)}function Ed(e){e.theme=e.settings.theme??"system",Un(e,uo(e.theme))}function Un(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?Ad():xd()}function Md(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&Un(e,n.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Rd(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Pd(e,t){if(typeof window>"u")return;const n=$d(window.location.pathname,e.basePath)??"chat";ho(e,n),fo(e,n,t)}function Id(e){if(typeof window>"u")return;const t=$d(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const a=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];qe(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:a})}ho(e,t)}function ho(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?eo(e):to(e),t==="logs"?no(e):so(e),t==="debug"?ao(e):io(e),e.connected&&Bn(e)}function fo(e,t,n){if(typeof window>"u")return;const s=In(co(t,e.basePath)),a=In(window.location.pathname),i=new URL(window.location.href);t==="chat"&&e.sessionKey?i.searchParams.set("session",e.sessionKey):i.searchParams.delete("session"),a!==s&&(i.pathname=s),n?window.history.replaceState({},"",i.toString()):window.history.pushState({},"",i.toString())}function ve(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function go(e){await Promise.all([Ee(e,!1),ro(e),ne(e),On(e),Ks(e)])}async function Dd(e){await Promise.all([Ee(e,!0),tc(e),Ve(e)])}async function Qs(e){await Promise.all([Ee(e,!1),On(e),Ws(e)])}const Vv=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:Un,applySettings:qe,applySettingsFromUrl:Td,attachThemeListener:Md,detachThemeListener:Rd,inferBasePath:Ld,loadChannelsTab:Dd,loadCron:Qs,loadOverview:go,onPopState:Id,refreshActiveTab:Bn,setLastActiveSessionKey:po,setTab:_d,setTabFromRoute:ho,setTheme:Cd,syncTabWithLocation:Pd,syncThemeWithSettings:Ed,syncUrlWithSessionKey:ve,syncUrlWithTab:fo},Symbol.toStringTag,{value:"Module"}));function Es(e){return e.chatSending||!!e.chatRunId}function $e(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:a,...i}=e.chatDrafts;e.chatDrafts=i}}function Fe(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Nd(e,t){const n=t??e.sessionKey,{[n]:s,...a}=e.chatDrafts;e.chatDrafts=a,n===e.sessionKey&&(e.chatMessage="")}function Od(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function qv(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function mo(e){e.connected&&(e.chatMessage="",await ji(e))}function Gv(e,t,n){const s=t.trim(),a=!!(n&&n.length>0);if(!s&&!a)return;const i=Date.now();e.chatQueue=[...e.chatQueue,{id:Bs(),text:s,createdAt:i,attachments:a?n?.map(l=>({...l})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),a&&n)for(const l of n)o.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:i}],Yt(e,!0)}async function fi(e,t,n){Ti(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{Yt(e,!0)});const a=await Wi(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!a&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!a&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),a&&(po(e,e.sessionKey),e.chatAttachments=[]),a&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),a&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),Yt(e,!0),a&&!e.chatRunId&&vo(e),a&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),a}async function vo(e){if(!e.connected||Es(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await fi(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Fd(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function Bd(e,t,n){if(!e.connected)return;const s=e.chatMessage,a=(t??e.chatMessage).trim(),i=e.chatAttachments??[],o=t==null?i:[],l=o.length>0;if(!a&&!l)return;if(Od(a)){await mo(e);return}const c=qv(a);if(t==null&&(e.chatMessage="",Nd(e)),n?.queue){Gv(e,a,o),Es(e)||await vo(e);return}if(Es(e)){await ji(e),await new Promise(d=>setTimeout(d,50)),await fi(e,a,{attachments:l?o:void 0,refreshSessions:c});return}await fi(e,a,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?o:void 0,previousAttachments:t==null?i:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function yo(e){await Promise.all([ce(e),ne(e,{activeMinutes:0}),Ms(e)]),Yt(e,!0)}const Ud=vo;function Yv(e){const t=ac(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Qv(e,t){const n=Ys(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Ms(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Yv(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Qv(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const a=await s.json(),i=typeof a.avatarUrl=="string"?a.avatarUrl.trim():"";e.chatAvatarUrl=i||null}catch{e.chatAvatarUrl=null}}const Xv=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Nd,flushChatQueueForEvent:Ud,handleAbortChat:mo,handleSendChat:Bd,isChatBusy:Es,isChatStopCommand:Od,refreshChat:yo,refreshChatAvatar:Ms,removeQueuedMessage:Fd,restoreDraft:Fe,saveDraft:$e},Symbol.toStringTag,{value:"Module"})),Jv={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Zv={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:ey}=Yu,Xr=e=>e,ty=e=>e.strings===void 0,Jr=()=>document.createComment(""),yn=(e,t,n)=>{const s=e._$AA.parentNode,a=t===void 0?e._$AB:t._$AA;if(n===void 0){const i=s.insertBefore(Jr(),a),o=s.insertBefore(Jr(),a);n=new ey(i,o,e,e.options)}else{const i=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(i!==a||l){let c=n._$AA;for(;c!==i;){const d=Xr(c).nextSibling;Xr(s).insertBefore(c,a),c=d}}}return n},gt=(e,t,n=e)=>(e._$AI(t,n),e),ny={},sy=(e,t=ny)=>e._$AH=t,ay=e=>e._$AH,Pa=e=>{e._$AR(),e._$AA.remove()};const Zr=(e,t,n)=>{const s=new Map;for(let a=t;a<=n;a++)s.set(e[a],a);return s},Xs=Ci(class extends Li{constructor(e){if(super(e),e.type!==_i.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const a=[],i=[];let o=0;for(const l of e)a[o]=s?s(l,o):o,i[o]=n(l,o),o++;return{values:i,keys:a}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const a=ay(e),{values:i,keys:o}=this.dt(t,n,s);if(!Array.isArray(a))return this.ut=o,i;const l=this.ut??=[],c=[];let d,u,f=0,g=a.length-1,m=0,w=i.length-1;for(;f<=g&&m<=w;)if(a[f]===null)f++;else if(a[g]===null)g--;else if(l[f]===o[m])c[m]=gt(a[f],i[m]),f++,m++;else if(l[g]===o[w])c[w]=gt(a[g],i[w]),g--,w--;else if(l[f]===o[w])c[w]=gt(a[f],i[w]),yn(e,c[w+1],a[f]),f++,w--;else if(l[g]===o[m])c[m]=gt(a[g],i[m]),yn(e,a[f],a[g]),g--,m++;else if(d===void 0&&(d=Zr(o,m,w),u=Zr(l,f,g)),d.has(l[f]))if(d.has(l[g])){const S=u.get(o[m]),x=S!==void 0?a[S]:null;if(x===null){const C=yn(e,a[f]);gt(C,i[m]),c[m]=C}else c[m]=gt(x,i[m]),yn(e,a[f],x),a[S]=null;m++}else Pa(a[g]),g--;else Pa(a[f]),f++;for(;m<=w;){const S=yn(e,c[w+1]);gt(S,i[m]),c[m++]=S}for(;f<=g;){const S=a[f++];S!==null&&Pa(S)}return this.ut=o,sy(e,c),rt}});function bo(e){$e(e);const n=`agent:main:webchat-${Bs().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ve(e,n,!0),ce(e)}function zd(e,t){const n=co(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Ls(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${Iv(t)}</span>
      <span class="nav-item__text">${Ls(t)}</span>
    </a>
  `}function Kd(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,a=e.onboarding?!0:e.settings.chatFocusMode,i=r`
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
        @click=${()=>bo(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${d=>{const f=d.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:f.bottom+8,right:window.innerWidth-f.right},e.sessionPickerOpen||ne(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${G.folderOpen}
        </button>
        ${e.sessionPickerOpen?ry(e):h}
      </div>
      <!-- Session search -->
      <div class="session-search-container">
        <button
          class="chat-toolbar__btn ${e.sessionSearchOpen?"active":""}"
          @click=${d=>e.handleToggleSessionSearch(d)}
          title="Search sessions"
          aria-label="Search session contents"
          aria-expanded=${e.sessionSearchOpen}
        >
          ${c}
        </button>
        ${e.sessionSearchOpen?oy(e):h}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),yo(e)}}
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
        ${G.brain}
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
        title=${e.chatPrivateMode?"Private mode ON — click to disable":"Enable private mode (no memory/logging)"}
      >
        ${G.lock}
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
        ${G.minimize}
      </button>
    </div>
  `}function iy(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=n),yesterday:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=s&&new Date(a.updatedAt)<n),older:e.filter(a=>!a.updatedAt||new Date(a.updatedAt)<s)}}let Ia=null;function oy(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=a=>{const i=a.target.value;e.sessionSearchQuery=i,Ia&&clearTimeout(Ia),Ia=setTimeout(()=>{e.handleSessionSearchQuery(i)},300)},n=a=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],$e(e),e.settings.openTabs.includes(a)?(e.sessionKey=a,e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,a],sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.sessionKey=a),Fe(e,a),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ve(e,a,!0),ce(e)},s=a=>{const i=a.label??a.displayName??a.key,o=a.matches.length>0;return r`
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
  `}function ry(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(g=>!e.settings.openTabs.includes(g.key));t&&(n=n.filter(g=>[g.label,g.displayName,g.key].filter(Boolean).some(w=>w.toLowerCase().includes(t))));const s=50,a=n.length,i=n.slice(0,s),o=iy(i),l=g=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",$e(e),e.settings.openTabs.includes(g)?(e.sessionKey=g,e.applySettings({...e.settings,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,g],sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.sessionKey=g),Fe(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ve(e,g,!0),ce(e)},c=async(g,m)=>{if(g.stopPropagation(),!!window.confirm(`Delete session "${m}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(S=>S.key!==m)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:m,deleteTranscript:!0}),ne(e)}catch(S){console.error("Failed to delete session:",S),ne(e)}},d=g=>r`
    <div class="session-picker-item" @click=${()=>l(g.key)}>
      <span class="session-picker-item__status ${g.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${g.label??g.displayName??g.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${g.updatedAt?r`<span class="session-picker-item__time">${Ep(g.updatedAt)}</span>`:h}
        <button
          class="session-picker-item__close"
          @click=${m=>c(m,g.key)}
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
  `,u=(g,m)=>m.length===0?h:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${g}</div>
        ${Xs(m,w=>w.key,d)}
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
          @input=${g=>{e.sessionPickerSearch=g.target.value}}
          @click=${g=>g.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${f===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${u("Today",o.today)}
              ${u("Yesterday",o.yesterday)}
              ${u("Older",o.older)}
              ${a>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${a} sessions. Use search to find more.
                  </div>`:h}
            `}
      </div>
    </div>
  `}const ly=["system","light","dark","lifetrack"];function Wd(e){const t=Math.max(0,ly.indexOf(e.theme)),n=s=>a=>{const o={element:a.currentTarget};(a.clientX||a.clientY)&&(o.pointerClientX=a.clientX,o.pointerClientY=a.clientY),e.setTheme(s,o)};return r`
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
          ${uy()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${cy()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${dy()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${py()}
        </button>
      </div>
    </div>
  `}function cy(){return r`
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
  `}function dy(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function uy(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function py(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const Da=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:bo,renderChatControls:Kd,renderTab:zd,renderThemeToggle:Wd},Symbol.toStringTag,{value:"Module"})),Na=new Set;function el(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const a=Le(e.sessionsResult?.sessions,n)?.key??n;if(Be.has(n)||Be.has(a)||Na.has(a))continue;Na.add(a);const o=e.client;Ki(o,a).then(l=>{a!==n&&l.length>0&&Be.set(n,l)}).finally(()=>{Na.delete(a),e.applySettings({...e.settings})})}}function hy(e){e.basePath=Ld(),e._urlSettingsApplied||(Td(e),e._urlSettingsApplied=!0),Pd(e,!0),Ed(e),Md(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),bo(e);return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="h"){t.preventDefault(),e.handleConsciousnessFlush();return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const a=s[n];a!==e.sessionKey&&(t.preventDefault(),$e(e),e.sessionKey=a,Fe(e,a),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.loadAssistantIdentity(),ve(e,a,!0),ce(e).then(()=>{cd(e)}))},window.addEventListener("keydown",e.keydownHandler),Ji(e),e.tab==="nodes"&&eo(e),e.tab==="logs"&&no(e),e.tab==="debug"&&ao(e)}function fy(e){Tp(e)}function gy(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),to(e),so(e),io(e),Rd(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Le(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),a=s[s.length-1];if(a&&a.length>=4){const o=e.find(l=>l.key.includes(a));if(o)return o}const i=t.replace(/^webchat:/,"");if(i!==t){const o=e.find(l=>l.key.endsWith(i)||l.key.includes(i));if(o)return o}}function my(e,t){if(!t||t.length===0)return;const n=(l,c)=>{const d=l?.sessionId?.trim();if(d)return`session:${d}`;if(l){const f=[l.kind,l.surface,l.subject,l.room,l.space,l.label,l.displayName].map(g=>String(g??"").trim().toLowerCase()).join("|");if(f.replace(/\|/g,"").length>0)return`meta:${f}`}return`key:${c}`};let s=!1;const a=new Map,i=[];for(const l of e.settings.openTabs){const c=l.trim();if(!c){s=!0;continue}const d=Le(t,c),u=d?.key??c;u!==l&&(s=!0);const f=n(d,u);if(a.has(f)){s=!0;continue}a.set(f,u),i.push(u)}const o=i.length!==e.settings.openTabs.length;if(s||o){i.length===0&&i.push(e.sessionKey.trim()||"main");const l={};for(const[g,m]of Object.entries(e.settings.tabLastViewed)){const w=g.trim();if(!w||typeof m!="number"||!Number.isFinite(m))continue;const S=Le(t,w),x=n(S,S?.key??w),C=a.get(x)??S?.key??w;l[C]=Math.max(l[C]??0,m)}const c=Le(t,e.sessionKey),d=n(c,c?.key??e.sessionKey.trim()),u=a.get(d)??c?.key??(e.sessionKey.trim()||i[0]),f=i.includes(u)?u:i[0];e.applySettings({...e.settings,openTabs:i,sessionKey:f,lastActiveSessionKey:f,tabLastViewed:l}),e.sessionKey!==f&&(e.sessionKey=f)}}function vy(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&my(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&el(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,a=!n||n.parallelLanes.some((i,o)=>i!==e.settings.parallelLanes[o]);(s||a)&&el(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-picker-container"),i=s.closest(".session-picker-dropdown");!a&&!i&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-search-container"),i=s.closest(".session-search-dropdown");!a&&!i&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&ce(e).then(()=>{cd(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&Bn(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const i=e.chatMessages;i[i.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s)&&oc(e),Yt(e,n||s||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&ic(e,t.has("tab")||t.has("logsAutoFollow"))}function Ue(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function jd(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Ue(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function Js(e){return e.filter(t=>typeof t=="string").join(".")}function Ae(e,t){const n=Js(e),s=t[n];if(s)return s;const a=n.split(".");for(const[i,o]of Object.entries(t)){if(!i.includes("*"))continue;const l=i.split(".");if(l.length!==a.length)continue;let c=!0;for(let d=0;d<a.length;d+=1)if(l[d]!=="*"&&l[d]!==a[d]){c=!1;break}if(c)return o}}function Ye(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function yy(e){const t=Js(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function Vt(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const by=new Set(["title","description","default","nullable"]);function wy(e){return Object.keys(e??{}).filter(n=>!by.has(n)).length===0}function ky(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Dn={chevronDown:r`
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
  `};function Ge(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,c=e.showLabel??!0,d=Ue(t),u=Ae(s,a),f=u?.label??t.title??Ye(String(s.at(-1))),g=u?.help??t.description,m=Js(s);if(i.has(m))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const S=(t.anyOf??t.oneOf??[]).filter(T=>!(T.type==="null"||Array.isArray(T.type)&&T.type.includes("null")));if(S.length===1)return Ge({...e,schema:S[0]});const x=T=>{if(T.const!==void 0)return T.const;if(T.enum&&T.enum.length===1)return T.enum[0]},C=S.map(x),p=C.every(T=>T!==void 0);if(p&&C.length>0&&C.length<=5){const T=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${f}</label>`:h}
          ${g?r`<div class="cfg-field__help">${g}</div>`:h}
          <div class="cfg-segmented">
            ${C.map((L,E)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${L===T||Vt(L)===Vt(T)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,L)}
              >
                ${Vt(L)}
              </button>
            `)}
          </div>
        </div>
      `}if(p&&C.length>5)return nl({...e,options:C,value:n??t.default});const $=new Set(S.map(T=>Ue(T)).filter(Boolean)),A=new Set([...$].map(T=>T==="integer"?"number":T));if([...A].every(T=>["string","number","boolean"].includes(T))){const T=A.has("string"),L=A.has("number");if(A.has("boolean")&&A.size===1)return Ge({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(T||L)return tl({...e,inputType:L&&!T?"number":"text"})}}if(t.enum){const w=t.enum;if(w.length<=5){const S=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${f}</label>`:h}
          ${g?r`<div class="cfg-field__help">${g}</div>`:h}
          <div class="cfg-segmented">
            ${w.map(x=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${x===S||String(x)===String(S)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,x)}
              >
                ${String(x)}
              </button>
            `)}
          </div>
        </div>
      `}return nl({...e,options:w,value:n??t.default})}if(d==="object")return Sy(e);if(d==="array")return Ay(e);if(d==="boolean"){const w=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${f}</span>
          ${g?r`<span class="cfg-toggle-row__help">${g}</span>`:h}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${w}
            ?disabled=${o}
            @change=${S=>l(s,S.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return d==="number"||d==="integer"?$y(e):d==="string"?tl({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported type: ${d}. Use Raw mode.</div>
    </div>
  `}function tl(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o,inputType:l}=e,c=e.showLabel??!0,d=Ae(s,a),u=d?.label??t.title??Ye(String(s.at(-1))),f=d?.help??t.description,g=d?.sensitive??yy(s),m=d?.placeholder??(g?"••••":t.default!==void 0?`Default: ${Vt(t.default)}`:""),w=n??"";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${u}</label>`:h}
      ${f?r`<div class="cfg-field__help">${f}</div>`:h}
      <div class="cfg-input-wrap">
        <input
          type=${g?"password":l}
          class="cfg-input"
          placeholder=${m}
          .value=${Vt(w)}
          ?disabled=${i}
          @input=${S=>{const x=S.target.value;if(l==="number"){if(x.trim()===""){o(s,void 0);return}const C=Number(x);o(s,Number.isNaN(C)?x:C);return}o(s,x)}}
          @change=${S=>{if(l==="number")return;const x=S.target.value;o(s,x.trim())}}
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
  `}function $y(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o}=e,l=e.showLabel??!0,c=Ae(s,a),d=c?.label??t.title??Ye(String(s.at(-1))),u=c?.help??t.description,f=n??t.default??"",g=typeof f=="number"?f:0;return r`
    <div class="cfg-field">
      ${l?r`<label class="cfg-field__label">${d}</label>`:h}
      ${u?r`<div class="cfg-field__help">${u}</div>`:h}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,g-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${Vt(f)}
          ?disabled=${i}
          @input=${m=>{const w=m.target.value,S=w===""?void 0:Number(w);o(s,S)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,g+1)}
        >+</button>
      </div>
    </div>
  `}function nl(e){const{schema:t,value:n,path:s,hints:a,disabled:i,options:o,onPatch:l}=e,c=e.showLabel??!0,d=Ae(s,a),u=d?.label??t.title??Ye(String(s.at(-1))),f=d?.help??t.description,g=n??t.default,m=o.findIndex(S=>S===g||String(S)===String(g)),w="__unset__";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${u}</label>`:h}
      ${f?r`<div class="cfg-field__help">${f}</div>`:h}
      <select
        class="cfg-select"
        ?disabled=${i}
        .value=${m>=0?String(m):w}
        @change=${S=>{const x=S.target.value;l(s,x===w?void 0:o[Number(x)])}}
      >
        <option value=${w}>Select...</option>
        ${o.map((S,x)=>r`
          <option value=${String(x)}>${String(S)}</option>
        `)}
      </select>
    </div>
  `}function Sy(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e;e.showLabel;const c=Ae(s,a),d=c?.label??t.title??Ye(String(s.at(-1))),u=c?.help??t.description,f=n??t.default,g=f&&typeof f=="object"&&!Array.isArray(f)?f:{},m=t.properties??{},S=Object.entries(m).toSorted(($,A)=>{const T=Ae([...s,$[0]],a)?.order??0,L=Ae([...s,A[0]],a)?.order??0;return T!==L?T-L:$[0].localeCompare(A[0])}),x=new Set(Object.keys(m)),C=t.additionalProperties,p=!!C&&typeof C=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${S.map(([$,A])=>Ge({schema:A,value:g[$],path:[...s,$],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${p?sl({schema:C,value:g,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:x,onPatch:l}):h}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${d}</span>
        <span class="cfg-object__chevron">${Dn.chevronDown}</span>
      </summary>
      ${u?r`<div class="cfg-object__help">${u}</div>`:h}
      <div class="cfg-object__content">
        ${S.map(([$,A])=>Ge({schema:A,value:g[$],path:[...s,$],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${p?sl({schema:C,value:g,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:x,onPatch:l}):h}
      </div>
    </details>
  `}function Ay(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,c=e.showLabel??!0,d=Ae(s,a),u=d?.label??t.title??Ye(String(s.at(-1))),f=d?.help??t.description,g=Array.isArray(t.items)?t.items[0]:t.items;if(!g)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${u}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const m=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${c?r`<span class="cfg-array__label">${u}</span>`:h}
        <span class="cfg-array__count">${m.length} item${m.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const w=[...m,jd(g)];l(s,w)}}
        >
          <span class="cfg-array__add-icon">${Dn.plus}</span>
          Add
        </button>
      </div>
      ${f?r`<div class="cfg-array__help">${f}</div>`:h}

      ${m.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${m.map((w,S)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${S+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const x=[...m];x.splice(S,1),l(s,x)}}
                >
                  ${Dn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${Ge({schema:g,value:w,path:[...s,S],hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:l})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function sl(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:l,onPatch:c}=e,d=wy(t),u=Object.entries(n??{}).filter(([f])=>!l.has(f));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const f={...n};let g=1,m=`custom-${g}`;for(;m in f;)g+=1,m=`custom-${g}`;f[m]=d?{}:jd(t),c(s,f)}}
        >
          <span class="cfg-map__add-icon">${Dn.plus}</span>
          Add Entry
        </button>
      </div>

      ${u.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${u.map(([f,g])=>{const m=[...s,f],w=ky(g);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${f}
                    ?disabled=${o}
                    @change=${S=>{const x=S.target.value.trim();if(!x||x===f)return;const C={...n};x in C||(C[x]=C[f],delete C[f],c(s,C))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${d?r`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${w}
                          ?disabled=${o}
                          @change=${S=>{const x=S.target,C=x.value.trim();if(!C){c(m,void 0);return}try{c(m,JSON.parse(C))}catch{x.value=w}}}
                        ></textarea>
                      `:Ge({schema:t,value:g,path:m,hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:c})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const S={...n};delete S[f],c(s,S)}}
                >
                  ${Dn.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const al={env:r`
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
  `},wo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function il(e){return al[e]??al.default}function xy(e,t,n){if(!n)return!0;const s=n.toLowerCase(),a=wo[e];return e.toLowerCase().includes(s)||a&&(a.label.toLowerCase().includes(s)||a.description.toLowerCase().includes(s))?!0:kn(t,s)}function kn(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,a]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||kn(a,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const a of s)if(a&&kn(a,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&kn(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&kn(s,t))return!0}return!1}function Ty(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Ue(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),a=t.properties,i=e.searchQuery??"",o=e.activeSection,l=e.activeSubsection??null,d=Object.entries(a).toSorted((f,g)=>{const m=Ae([f[0]],e.uiHints)?.order??50,w=Ae([g[0]],e.uiHints)?.order??50;return m!==w?m-w:f[0].localeCompare(g[0])}).filter(([f,g])=>!(o&&f!==o||i&&!xy(f,g,i)));let u=null;if(o&&l&&d.length===1){const f=d[0]?.[1];f&&Ue(f)==="object"&&f.properties&&f.properties[l]&&(u={sectionKey:o,subsectionKey:l,schema:f.properties[l]})}return d.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${G.search}</div>
        <div class="config-empty__text">
          ${i?`No settings match "${i}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${u?(()=>{const{sectionKey:f,subsectionKey:g,schema:m}=u,w=Ae([f,g],e.uiHints),S=w?.label??m.title??Ye(g),x=w?.help??m.description??"",C=n[f],p=C&&typeof C=="object"?C[g]:void 0,$=`config-section-${f}-${g}`;return r`
              <section class="config-section-card" id=${$}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${il(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${S}</h3>
                    ${x?r`<p class="config-section-card__desc">${x}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Ge({schema:m,value:p,path:[f,g],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():d.map(([f,g])=>{const m=wo[f]??{label:f.charAt(0).toUpperCase()+f.slice(1),description:g.description??""};return r`
              <section class="config-section-card" id="config-section-${f}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${il(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${m.label}</h3>
                    ${m.description?r`<p class="config-section-card__desc">${m.description}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Ge({schema:g,value:n[f],path:[f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const _y=new Set(["title","description","default","nullable"]);function Cy(e){return Object.keys(e??{}).filter(n=>!_y.has(n)).length===0}function Hd(e){const t=e.filter(a=>a!=null),n=t.length!==e.length,s=[];for(const a of t)s.some(i=>Object.is(i,a))||s.push(a);return{enumValues:s,nullable:n}}function Vd(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:xn(e,[])}function xn(e,t){const n=new Set,s={...e},a=Js(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const l=Ly(e,t);return l||{schema:e,unsupportedPaths:[a]}}const i=Array.isArray(e.type)&&e.type.includes("null"),o=Ue(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=i||e.nullable,s.enum){const{enumValues:l,nullable:c}=Hd(s.enum);s.enum=l,c&&(s.nullable=!0),l.length===0&&n.add(a)}if(o==="object"){const l=e.properties??{},c={};for(const[d,u]of Object.entries(l)){const f=xn(u,[...t,d]);f.schema&&(c[d]=f.schema);for(const g of f.unsupportedPaths)n.add(g)}if(s.properties=c,e.additionalProperties===!0)n.add(a);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Cy(e.additionalProperties)){const d=xn(e.additionalProperties,[...t,"*"]);s.additionalProperties=d.schema??e.additionalProperties,d.unsupportedPaths.length>0&&n.add(a)}}else if(o==="array"){const l=Array.isArray(e.items)?e.items[0]:e.items;if(!l)n.add(a);else{const c=xn(l,[...t,"*"]);s.items=c.schema??l,c.unsupportedPaths.length>0&&n.add(a)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(a);return{schema:s,unsupportedPaths:Array.from(n)}}function Ly(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],a=[];let i=!1;for(const l of n){if(!l||typeof l!="object")return null;if(Array.isArray(l.enum)){const{enumValues:c,nullable:d}=Hd(l.enum);s.push(...c),d&&(i=!0);continue}if("const"in l){if(l.const==null){i=!0;continue}s.push(l.const);continue}if(Ue(l)==="null"){i=!0;continue}a.push(l)}if(s.length>0&&a.length===0){const l=[];for(const c of s)l.some(d=>Object.is(d,c))||l.push(c);return{schema:{...e,enum:l,nullable:i,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(a.length===1){const l=xn(a[0],t);return l.schema&&(l.schema.nullable=i||l.schema.nullable),l}const o=new Set(["string","number","integer","boolean"]);return a.length>0&&s.length===0&&a.every(l=>l.type&&o.has(String(l.type)))?{schema:{...e,nullable:i},unsupportedPaths:[]}:null}function Ey(e,t){let n=e;for(const s of t){if(!n)return null;const a=Ue(n);if(a==="object"){const i=n.properties??{};if(typeof s=="string"&&i[s]){n=i[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(a==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function My(e,t){const s=(e.channels??{})[t],a=e[t];return(s&&typeof s=="object"?s:null)??(a&&typeof a=="object"?a:null)??{}}function Ry(e){const t=Vd(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Ey(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const a=e.configValue??{},i=My(a,e.channelId);return r`
    <div class="config-form">
      ${Ge({schema:s,value:i,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function Qe(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:Ry({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function Py(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${Qe({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Iy(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${Qe({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Dy(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:h}

      ${Qe({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function ol(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Ny(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:a,profileFormState:i,profileFormCallbacks:o,onEditProfile:l}=e,c=s[0],d=n?.configured??c?.configured??!1,u=n?.running??c?.running??!1,f=n?.publicKey??c?.publicKey,g=n?.lastStartAt??c?.lastStartAt??null,m=n?.lastError??c?.lastError??null,w=s.length>1,S=i!=null,x=p=>{const $=p.publicKey,A=p.profile,T=A?.displayName??A?.name??p.name??p.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${T}</div>
          <div class="account-card-id">${p.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${p.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${p.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${$??""}">${ol($)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${p.lastInboundAt?z(p.lastInboundAt):"n/a"}</span>
          </div>
          ${p.lastError?r`
                <div class="account-card-error">${p.lastError}</div>
              `:h}
        </div>
      </div>
    `},C=()=>{if(S&&o)return lp({state:i,callbacks:o,accountId:s[0]?.accountId??"default"});const p=c?.profile??n?.profile,{name:$,displayName:A,about:T,picture:L,nip05:E}=p??{},F=$||A||T||L||E;return r`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${d?r`
                <button
                  class="btn btn-sm"
                  @click=${l}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:h}
        </div>
        ${F?r`
              <div class="status-list">
                ${L?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${L}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${V=>{V.target.style.display="none"}}
                        />
                      </div>
                    `:h}
                ${$?r`<div><span class="label">Name</span><span>${$}</span></div>`:h}
                ${A?r`<div><span class="label">Display Name</span><span>${A}</span></div>`:h}
                ${T?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${T}</span></div>`:h}
                ${E?r`<div><span class="label">NIP-05</span><span>${E}</span></div>`:h}
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

      ${w?r`
            <div class="account-card-list">
              ${s.map(p=>x(p))}
            </div>
          `:r`
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
                <span class="monospace" title="${f??""}"
                  >${ol(f)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${g?z(g):"n/a"}</span>
              </div>
            </div>
          `}

      ${m?r`<div class="callout danger" style="margin-top: 12px;">${m}</div>`:h}

      ${C()}

      ${Qe({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Oy(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function Fy(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const a=s[e],i=typeof a?.configured=="boolean"&&a.configured,o=typeof a?.running=="boolean"&&a.running,l=typeof a?.connected=="boolean"&&a.connected,d=(n.channelAccounts?.[e]??[]).some(u=>u.configured||u.running||u.connected);return i||o||l||d}function By(e,t){return t?.[e]?.length??0}function qd(e,t){const n=By(e,t);return n<2?h:r`<div class="account-count">Accounts (${n})</div>`}function Uy(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${Qe({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function zy(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${Qe({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ky(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:a}=e,i=s.length>1,o=l=>{const d=l.probe?.bot?.username,u=l.name||l.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${d?`@${d}`:u}
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
            <span>${l.lastInboundAt?z(l.lastInboundAt):"n/a"}</span>
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
                <span>${n?.lastStartAt?z(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?z(n.lastProbeAt):"n/a"}</span>
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

      ${Qe({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Wy(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
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
            ${n?.lastConnectedAt?z(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?z(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?Oy(n.authAgeMs):"n/a"}
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

      ${Qe({channelId:"whatsapp",props:t})}
    </div>
  `}function jy(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,a=t?.discord??null;t?.googlechat;const i=t?.slack??null,o=t?.signal??null,l=t?.imessage??null,c=t?.nostr??null,u=Hy(e.snapshot).map((f,g)=>({key:f,enabled:Fy(f,e),order:g})).toSorted((f,g)=>f.enabled!==g.enabled?f.enabled?-1:1:f.order-g.order);return r`
    <section class="grid grid-cols-2">
      ${u.map(f=>Vy(f.key,e,{whatsapp:n,telegram:s,discord:a,slack:i,signal:o,imessage:l,nostr:c,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?z(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:h}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Hy(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Vy(e,t,n){const s=qd(e,n.channelAccounts);switch(e){case"whatsapp":return Wy({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return Ky({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Py({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return Iy({props:t,accountCountLabel:s});case"slack":return zy({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Uy({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Dy({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const a=n.channelAccounts?.nostr??[],i=a[0],o=i?.accountId??"default",l=i?.profile??null,c=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,d=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ny({props:t,nostr:n.nostr,nostrAccounts:a,accountCountLabel:s,profileFormState:c,profileFormCallbacks:d,onEditProfile:()=>t.onNostrProfileEdit(o,l)})}default:return qy(e,t,n.channelAccounts??{})}}function qy(e,t,n){const s=Yy(t.snapshot,e),a=t.snapshot?.channels?.[e],i=typeof a?.configured=="boolean"?a.configured:void 0,o=typeof a?.running=="boolean"?a.running:void 0,l=typeof a?.connected=="boolean"?a.connected:void 0,c=typeof a?.lastError=="string"?a.lastError:void 0,d=n[e]??[],u=qd(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${u}

      ${d.length>0?r`
            <div class="account-card-list">
              ${d.map(f=>Zy(f))}
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

      ${Qe({channelId:e,props:t})}
    </div>
  `}function Gy(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Yy(e,t){return Gy(e)[t]?.label??e?.channelLabels?.[t]??t}const Qy=600*1e3;function Gd(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Qy:!1}function Xy(e){return e.running?"Yes":Gd(e)?"Active":"No"}function Jy(e){return e.connected===!0?"Yes":e.connected===!1?"No":Gd(e)?"Active":"n/a"}function Zy(e){const t=Xy(e),n=Jy(e);return r`
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
          <span>${e.lastInboundAt?z(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?r`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:h}
      </div>
    </div>
  `}const Tn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),Tn(s,t);return!0},Rs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Yd=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),nb(t)}};function eb(e){this._$AN!==void 0?(Rs(this),this._$AM=e,Yd(this)):this._$AM=e}function tb(e,t=!1,n=0){const s=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(s))for(let i=n;i<s.length;i++)Tn(s[i],!1),Rs(s[i]);else s!=null&&(Tn(s,!1),Rs(s));else Tn(this,e)}const nb=e=>{e.type==_i.CHILD&&(e._$AP??=tb,e._$AQ??=eb)};class sb extends Li{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Yd(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(Tn(this,t),Rs(this))}setValue(t){if(ty(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const Oa=new WeakMap,ab=Ci(class extends sb{render(e){return h}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),h}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=Oa.get(t);n===void 0&&(n=new WeakMap,Oa.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?Oa.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),rl=25*1024*1024,ll=50*1024*1024,cl=20;function Fa(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function ko(e,t=0){const n=[],s=[];let a=t;const i=Array.from(e);for(const o of i){if(n.length>=cl){s.push(`Maximum ${cl} files allowed per upload`);break}if(o.size>rl){s.push(`"${o.name}" is too large (${Fa(o.size)}). Max ${Fa(rl)}. For larger files, tell Atlas the file path instead.`);continue}if(a+o.size>ll){s.push(`Total upload size exceeds ${Fa(ll)} limit`);break}a+=o.size,n.push(o)}return{validFiles:n,errors:s}}const ib=new Set(["md","markdown","mdx"]),ob=new Set(["htm","html"]),rb=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function lb(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function cb(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?ib.has(n)?"text/markdown":ob.has(n)?"text/html":rb.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function db(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return cb(e.filePath??null)??"text/markdown"}function ub(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=db(e),n=e.content,s=n.trim();return t.startsWith("image/")?s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${lb(e.filePath??"Image preview")} />
        </div>
      `:r`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `:t==="text/html"||t==="application/xhtml+xml"?r`<div class="sidebar-html">${lt(nf(n))}</div>`:t==="text/markdown"||t==="text/x-markdown"?r`<div class="sidebar-markdown">${lt(ke(n))}</div>`:r`<pre class="sidebar-plain">${n}</pre>`}function Qd(e){const t=e.title?.trim()||"Tool Output";return r`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?r`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:h}
        </div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ${G.x}
        </button>
      </div>
      <div class="sidebar-content">${ub(e)}</div>
    </div>
  `}var pb=Object.defineProperty,hb=Object.getOwnPropertyDescriptor,Zs=(e,t,n,s)=>{for(var a=s>1?void 0:s?hb(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&pb(t,n,a),a};let Zt=class extends Ht{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,a=(e.clientX-this.startX)/n;let i=this.startRatio+a;i=Math.max(this.minRatio,Math.min(this.maxRatio,i)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:i},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Zt.styles=Mu`
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
  `;Zs([Ns({type:Number})],Zt.prototype,"splitRatio",2);Zs([Ns({type:Number})],Zt.prototype,"minRatio",2);Zs([Ns({type:Number})],Zt.prototype,"maxRatio",2);Zt=Zs([Jl("resizable-divider")],Zt);const fb=5e3;function gb(e){const t=(e??"").trim();if(!t||t==="/")return"/consciousness-icon.webp";const n=t.startsWith("/")?t:`/${t}`;return`${n.endsWith("/")?n.slice(0,-1):n}/consciousness-icon.webp`}function dl(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function mb(e){const t=e.sessions?.sessions?.find(a=>a.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function vb(e){const t=mb(e);if(t===null)return h;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",a=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),i=a?.totalTokens??0,o=a?.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return r`
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
  `}function yb(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${G.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<fb?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${G.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:h:h}function $o(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function bb(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function wb(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function kb(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function $b(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((u,f)=>u+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ko(s,i);for(const u of l)t.showToast?.(u,"error");if(o.length===0)return;const c=[];let d=o.length;for(const u of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;c.push({id:$o(),dataUrl:g,mimeType:u.type||"application/octet-stream",fileName:u.name}),d--,d===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${u.name}"`,"error"),d--,d===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(u)}}function Sb(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let u=0;u<n.length;u++){const f=n[u];if(f.type.startsWith("image/")){const g=f.getAsFile();g&&s.push(g)}}if(s.length===0)return;e.preventDefault();const a=t.attachments??[],i=a.reduce((u,f)=>u+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ko(s,i);for(const u of l)t.showToast?.(u,"error");if(o.length===0)return;const c=[];let d=o.length;for(const u of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;c.push({id:$o(),dataUrl:g,mimeType:u.type,fileName:u.name||"pasted-image"}),d--,d===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),d--,d===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(u)}}function Ab(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((u,f)=>u+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ko(s,i);for(const u of l)t.showToast?.(u,"error");if(o.length===0){n.value="";return}const c=[];let d=o.length;for(const u of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;c.push({id:$o(),dataUrl:g,mimeType:u.type||"application/octet-stream",fileName:u.name}),d--,d===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${u.name}"`,"error"),d--,d===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(u)}n.value=""}function xb(e){const t=e.attachments??[];return t.length===0?h:r`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),a=n.fileName||"file",i=a.length>20?a.slice(0,17)+"...":a;return r`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?r`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:r`<div class="chat-attachment__file">
                  ${G.fileText}
                  <span class="chat-attachment__filename" title=${a}>${i}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(l=>l.id!==n.id);e.onAttachmentsChange?.(o)}}
            >
              ${G.x}
            </button>
          </div>
        `})}
    </div>
  `}function Tb(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function _b(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Cb(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function Lb(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Tb(e))return;const a=s.closest("a");if(a instanceof HTMLAnchorElement){if(a.hasAttribute("download"))return;const l=a.getAttribute("href");if(!l)return;e.preventDefault(),await t.onMessageLinkClick(l)||_b(a);return}const i=s.closest("code");if(!(i instanceof HTMLElement))return;const o=Cb(i.textContent??"");o&&(e.preventDefault(),await t.onMessageLinkClick(o))}function Eb(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const a=e.sessions?.sessions?.find(m=>m.key===e.sessionKey)?.reasoningLevel??"off",i=e.showThinking&&a!=="off",o={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,c=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",d=e.splitRatio??.6,u=!!(e.sidebarOpen&&e.onCloseSidebar),f=gb(e.basePath),g=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${m=>{Lb(m,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:h}
      ${Xs(Pb(e),m=>m.key,m=>{try{if(m.kind==="reading-indicator")return eg(o,e.currentToolInfo);if(m.kind==="stream")return tg(m.text,m.startedAt,e.onOpenSidebar,o,e.currentToolInfo);if(m.kind==="compaction-summary")return ig(m.message);if(m.kind==="group"){const w=e.resolveImageUrl?(S,x)=>e.resolveImageUrl(S,x):void 0;return ng(m,{onOpenSidebar:e.onOpenSidebar,onImageClick:e.onImageClick,resolveImageUrl:w,showReasoning:i,assistantName:e.assistantName,assistantAvatar:o.avatar,userName:e.userName,userAvatar:e.userAvatar})}return h}catch(w){return console.error("[chat] item render error:",w,m.key),h}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${bb}
      @dragenter=${m=>wb(m,m.currentTarget)}
      @dragleave=${m=>kb(m,m.currentTarget)}
      @drop=${m=>$b(m,e)}
    >
      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:h}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:h}

      ${yb(e.compactionStatus)}

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
              ${G.x}
            </button>
          `:h}

      <div
        class="chat-split-container ${u?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${u?`0 0 ${d*100}%`:"1 1 100%"}"
          @click=${u?()=>e.onCloseSidebar?.():h}
        >
          ${g}
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

        ${u?r`
              <resizable-divider
                .splitRatio=${d}
                @resize=${m=>e.onSplitRatioChange?.(m.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${Qd({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})}})}
              </div>
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
                        ${G.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:h}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${m=>Ab(m,e)}
          />
          ${xb(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${ab(m=>m&&dl(m))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${m=>{if(m.key!=="Enter"||m.isComposing||m.keyCode===229||m.shiftKey||!e.connected)return;m.preventDefault();const w=m.ctrlKey||m.metaKey;t&&e.onSend(w)}}
              @input=${m=>{const w=m.target;dl(w),e.onDraftChange(w.value)}}
              @paste=${m=>Sb(m,e)}
              placeholder=${c}
            ></textarea>

            <div class="chat-compose__actions">
              ${vb(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${G.paperclip}
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
                    ${e.consciousnessStatus==="loading"?G.loader:r`<img src=${f} width="18" height="18" alt="" style="display:block;opacity:0.9;" />`}
                  </button>
                `:h}

              <button
                class="chat-compose__send-btn"
                ?disabled=${!e.canSend||!e.connected}
                @click=${()=>e.onSend(!1)}
                title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
              >
                ${G.arrowUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const ul=200;function Mb(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const a=Tc(s.message),i=Ui(a.role),o=a.timestamp||Date.now();!n||n.role!==i?(n&&t.push(n),n={kind:"group",key:`group:${i}:${s.key}`,role:i,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Rb(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const a=s;if(a.type==="image")return!0;if(Array.isArray(a.content)){for(const i of a.content)if(!(typeof i!="object"||i===null)&&i.type==="image")return!0}}return!1}function Pb(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],a=Math.max(0,n.length-ul);a>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${ul} messages (${a} hidden).`,timestamp:Date.now()}});for(let i=a;i<n.length;i++){const o=n[i];if(o._chatIdx=i,og(o)){t.push({kind:"compaction-summary",key:`compaction:${i}`,message:o});continue}const l=Tc(o);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Rb(o)||t.push({kind:"message",key:pl(o,i),message:o})}if(e.showThinking)for(let i=0;i<s.length;i++)t.push({kind:"message",key:pl(s[i],i+n.length),message:s[i]});if(e.stream!==null){const i=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:i,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:i})}else if(e.isWorking){const i=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}else if(e.sending||e.canAbort){const i=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}return Mb(t)}function pl(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const a=typeof n.id=="string"?n.id:"";if(a)return`msg:${a}`;const i=typeof n.messageId=="string"?n.messageId:"";if(i)return`msg:${i}`;const o=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";return o!=null?`msg:${l}:${o}:${t}`:`msg:${l}:${t}`}function Ib(e,t=128){return new Promise((n,s)=>{const a=new Image;a.addEventListener("load",()=>{const i=document.createElement("canvas");i.width=t,i.height=t;const o=i.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const l=Math.min(a.width,a.height),c=(a.width-l)/2,d=(a.height-l)/2;o.drawImage(a,c,d,l,l,0,0,t,t),n(i.toDataURL("image/png"))}),a.addEventListener("error",()=>s(new Error("Failed to load image"))),a.src=URL.createObjectURL(e)})}let Kt="",$n=null,$t=null,hl=!1,et=!1;function Db(e){hl||(Kt=e.userName||"",$n=e.userAvatar||null,$t=e.userAvatar||null,hl=!0,et=!1)}function Nb(e){Db(e);const t=c=>{Kt=c.target.value,et=!0},n=async c=>{const u=c.target.files?.[0];if(u){if(!u.type.startsWith("image/")){alert("Please select an image file");return}if(u.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const f=await Ib(u,128);$n=f,$t=f,et=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(f){console.error("Failed to process image:",f),alert("Failed to process image")}}},s=()=>{$n=null,$t=null,et=!0;const c=document.getElementById("user-avatar-input");c&&(c.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},a=()=>{e.onUpdate(Kt,$n||""),et=!1;const c=document.querySelector(".user-settings__save");c&&(c.textContent="Saved!",setTimeout(()=>{c.textContent="Save"},1500))},i=()=>{Kt=e.userName||"",$n=e.userAvatar||null,$t=e.userAvatar||null,et=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=Kt||"You",l=$t?r`<img src="${$t}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
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
                  ${$t?r`
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
                .value=${Kt}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${et?r`
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
                ?disabled=${!et}
                @click=${a}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const gi={all:r`
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
  `},Ba=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],fl=new Set(["user"]),gl="__all__";function ml(e){return gi[e]??gi.default}function Ob(e,t){const n=wo[e];return n||{label:t?.title??Ye(e),description:t?.description??""}}function Fb(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Ue(n)!=="object"||!n.properties)return[];const a=Object.entries(n.properties).map(([i,o])=>{const l=Ae([t,i],s),c=l?.label??o.title??Ye(i),d=l?.help??o.description??"",u=l?.order??50;return{key:i,label:c,description:d,order:u}});return a.sort((i,o)=>i.order!==o.order?i.order-o.order:i.key.localeCompare(o.key)),a}function Bb(e,t){if(!e||!t)return[];const n=[];function s(a,i,o){if(a===i)return;if(typeof a!=typeof i){n.push({path:o,from:a,to:i});return}if(typeof a!="object"||a===null||i===null){a!==i&&n.push({path:o,from:a,to:i});return}if(Array.isArray(a)&&Array.isArray(i)){JSON.stringify(a)!==JSON.stringify(i)&&n.push({path:o,from:a,to:i});return}const l=a,c=i,d=new Set([...Object.keys(l),...Object.keys(c)]);for(const u of d)s(l[u],c[u],o?`${o}.${u}`:u)}return s(e,t,""),n}function vl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function Ub(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Vd(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,a=n.schema?.properties??{},i=Ba.filter(E=>E.key in a&&!fl.has(E.key)),o=new Set(Ba.map(E=>E.key)),l=Object.keys(a).filter(E=>!o.has(E)).map(E=>({key:E,label:E.charAt(0).toUpperCase()+E.slice(1)})),c=Ba.filter(E=>fl.has(E.key)),d=[...i,...l,...c],u=e.activeSection&&n.schema&&Ue(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,f=e.activeSection?Ob(e.activeSection,u):null,g=e.activeSection?Fb({key:e.activeSection,schema:u,uiHints:e.uiHints}):[],m=e.formMode==="form"&&!!e.activeSection&&g.length>0,w=e.activeSubsection===gl,S=e.searchQuery||w?null:e.activeSubsection??g[0]?.key??null,x=e.formMode==="form"?Bb(e.originalValue,e.formValue):[],C=e.formMode==="raw"&&e.raw!==e.originalRaw,p=e.formMode==="form"?x.length>0:C,$=!!e.formValue&&!e.loading&&!!n.schema,A=e.connected&&!e.saving&&p&&(e.formMode==="raw"?!0:$),T=e.connected&&!e.applying&&!e.updating&&p&&(e.formMode==="raw"?!0:$),L=e.connected&&!e.applying&&!e.updating;return r`
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
          `:h}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${gi.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${d.map(E=>r`
            <button
              class="config-nav__item ${e.activeSection===E.key?"active":""}"
              @click=${()=>e.onSectionChange(E.key)}
            >
              <span class="config-nav__icon">${ml(E.key)}</span>
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
            ${p?r`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${x.length} unsaved change${x.length!==1?"s":""}`}</span>
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
              ?disabled=${!A}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!T}
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
        ${p&&e.formMode==="form"?r`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${x.length} pending change${x.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${x.map(E=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${E.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${vl(E.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${vl(E.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:h}

        ${f&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${ml(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${f.label}</div>
                  ${f.description?r`<div class="config-section-hero__desc">${f.description}</div>`:h}
                </div>
              </div>
            `:h}

        ${m?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${S===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(gl)}
                >
                  All
                </button>
                ${g.map(E=>r`
                    <button
                      class="config-subnav__item ${S===E.key?"active":""}"
                      title=${E.description||E.label}
                      @click=${()=>e.onSubsectionChange(E.key)}
                    >
                      ${E.label}
                    </button>
                  `)}
              </div>
            `:h}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="user"?Nb({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Ty({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:S})}
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
                      @input=${E=>e.onRawChange(E.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:h}
      </main>
    </div>
  `}function zb(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",a=e.version??"";return`${t} ${n} ${s} ${a}`.trim()}function Kb(e){const t=e.ts??null;return t?z(t):"n/a"}function Xd(e){return e?`${Mn(e)} (${z(e)})`:"n/a"}function Wb(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function jb(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function Hb(e){const t=e.state??{},n=t.nextRunAtMs?Mn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Mn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function Vb(e){const t=e.schedule;return t.kind==="at"?`At ${Mn(t.atMs)}`:t.kind==="every"?`Every ${xi(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function qb(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function Gb(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(a=>s.has(a)?!1:(s.add(a),!0))}function Yb(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Qb(e){const t=Gb(e);return r`
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
            <div class="stat-value">${Xd(e.status?.nextWakeAtMs??null)}</div>
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
        ${Xb(e)}
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
                            ${Yb(e,n)}
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
              ${e.jobs.map(n=>Jb(n,e))}
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
                ${e.runs.map(n=>Zb(n))}
              </div>
            `}
    </section>
  `}function Xb(e){const t=e.form;return t.scheduleKind==="at"?r`
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
  `}function Jb(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${Vb(e)}</div>
        <div class="muted">${qb(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:h}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${Hb(e)}</div>
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
  `}function Zb(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Mn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:h}
      </div>
    </div>
  `}const ew={health:"❤️",calendar:"📅",tasks:"✅",email:"📧",meetings:"🎤",environment:"🌤️"},tw={connected:"#10b981",pending:"#f59e0b",disconnected:"#ef4444"},yl={connected:"Connected",pending:"Pending",disconnected:"Disconnected"};function nw(e){return ew[e.toLowerCase()]??"🔗"}function sw(e){if(!e)return"Never";const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function aw(e,t){const n=tw[e.status];return r`
    <div class="my-day-card data-source-card">
      <div class="data-source-header">
        <span class="data-source-icon">${nw(e.type)}</span>
        <div class="data-source-info">
          <div class="data-source-name">${e.name}</div>
          <span class="data-source-type-badge">${e.type}</span>
        </div>
        <div class="data-source-status" title="${yl[e.status]}">
          <span
            class="data-source-status-dot"
            style="background: ${n};"
          ></span>
          <span class="data-source-status-label">${yl[e.status]}</span>
        </div>
      </div>
      <div class="data-source-body">
        ${e.skill?r`<div class="data-source-skill">
              <span class="data-source-detail-label">Skill:</span>
              <span class="data-source-detail-value">${e.skill}</span>
            </div>`:h}
        <div class="data-source-sync">
          <span class="data-source-detail-label">Last sync:</span>
          <span class="data-source-detail-value">${sw(e.lastSync)}</span>
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
          `:h}
    </div>
  `}function iw(e,t){return e.length===0?r`
      <div class="my-day-card">
        <div class="my-day-card-content">
          <div class="my-day-empty">
            No data sources configured. Chat to connect your first integration.
          </div>
        </div>
      </div>
    `:r`
    <div class="data-sources-grid">
      ${e.map(n=>aw(n,t))}
    </div>
  `}function ow(e){return r`
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
          `:h}
    </div>
  `}function rw(e){if(e.loading)return r`
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
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:h}
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
              `:h}
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
        ${e.subtab==="dashboard"?ow(e.onQuerySubmit):iw(e.sources,e.onConnectSource)}
      </div>
    </div>
  `}function lw(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,a=n?.warn??0,i=n?.info??0,o=s>0?"danger":a>0?"warn":"success",l=s>0?`${s} critical`:a>0?`${a} warnings`:"No critical issues";return r`
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
                      <pre class="code-block">${jb(c.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function cw(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function mt(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:h}function dw(e){const t=e.execApprovalQueue[0];if(!t)return h;const n=t.request,s=t.expiresAtMs-Date.now(),a=s>0?`expires in ${cw(s)}`:"expired",i=e.execApprovalQueue.length;return r`
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
          ${mt("Host",n.host)}
          ${mt("Agent",n.agentId)}
          ${mt("Session",n.sessionKey)}
          ${mt("CWD",n.cwd)}
          ${mt("Resolved",n.resolvedPath)}
          ${mt("Security",n.security)}
          ${mt("Ask",n.ask)}
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
  `}function uw(e){const{pendingGatewayUrl:t}=e;return t?r`
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
  `:h}const pw={professional:"#3b82f6",personal:"#10b981",health:"#ef4444",financial:"#f59e0b",creative:"#a855f7",relationship:"#ec4899"},hw={active:"Active",completed:"Completed",paused:"Paused"},fw={active:"●",completed:"✓",paused:"⏸"};function gw(e){return e?pw[e.toLowerCase()]??"var(--mc-text-muted)":"var(--mc-text-muted)"}function mw(e){const t={active:[],completed:[],paused:[]};for(const n of e)t[n.status].push(n);return t}function vw(e){const t=Math.max(0,Math.min(100,e));return r`
    <div class="goals-progress-bar">
      <div
        class="goals-progress-fill"
        style="width: ${t}%; background: ${t>=100?"#10b981":"var(--mc-accent)"}"
      ></div>
    </div>
    <span class="goals-progress-label">${t}%</span>
  `}function yw(e){const t=gw(e.area);return r`
    <div class="my-day-card goals-card goals-status-${e.status}">
      <div class="goals-card-header">
        <div class="goals-card-title">${e.title}</div>
        <span class="goals-status-indicator goals-status-${e.status}" title="${hw[e.status]}">
          ${fw[e.status]}
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
            `:h}
        ${e.target?r`<div class="goals-target-text">${e.target}</div>`:h}
        ${e.progress!=null?r`<div class="goals-progress-row">${vw(e.progress)}</div>`:h}
      </div>
    </div>
  `}function Ua(e,t){return t.length===0?h:r`
    <div class="goals-group">
      <div class="goals-group-label">
        <span>${e}</span>
        <span class="goals-group-count">${t.length}</span>
      </div>
      <div class="goals-group-cards">
        ${t.map(n=>yw(n))}
      </div>
    </div>
  `}function bw(e){if(e.loading)return r`
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
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:h}
        </div>
      </div>
    `;const t=mw(e.goals),n=t.active.length,s=t.completed.length;return r`
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
              `:h}
          ${e.onRefresh?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">↻</button>
              `:h}
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
              ${Ua("ACTIVE",t.active)}
              ${Ua("COMPLETED",t.completed)}
              ${Ua("PAUSED",t.paused)}
            `}
      </div>
    </div>
  `}function ww(e){return r`
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
              `:e.entries.map(t=>kw(t))}
      </div>
    </section>
  `}function kw(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],a=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],i=a.length>0?a.length>3?`${a.length} scopes`:`scopes: ${a.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${zb(e)}</div>
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
        <div>${Kb(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}function $w(e){return new Date(e).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}function Sw(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric"})}function Jd(e){return e===de()}function Aw(e){const t=new Date,n=new Date(e),s=Math.floor((t.getTime()-n.getTime())/(1e3*60*60*24));return s===0?"Today":s===1?"Yesterday":s<7?`${s} days ago`:Sw(e)}function xw(e){if(!e||e.length===0)return!1;const t=de();return e.some(n=>n.date===t)}function Tw(e){return r`
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
            </button>`:h}
        <p class="cta-note">You can pause or disable anytime in settings.</p>
      </div>
    </div>
  `}function _w(e,t,n){return r`
    <div class="lifetracks-generate-cta">
      <div class="generate-header">
        <h3>No tracks yet</h3>
        <p>Generate your first personalized LifeTrack based on your Vision Board and goals.</p>
      </div>

      ${t?r`<div class="generate-error">
            <span class="error-icon">⚠️</span>
            <span>${t}</span>
          </div>`:h}

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
  `}function Cw(e,t,n,s){return e?r`
    <div class="lifetracks-player">
      <div class="player-header">
        <div class="player-info">
          <span class="player-date">${$w(e.date)}</span>
          ${Jd(e.date)?r`
                  <span class="player-badge today">Today's Track</span>
                `:h}
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
            </button>`:h}
      </div>
    </div>
  `:r`
      <div class="lifetracks-player-empty">
        <span class="player-empty-icon">🎧</span>
        <span class="player-empty-text">Select a track to play</span>
      </div>
    `}function Lw(e,t,n){return!e||e.length===0?r`
      <div class="lifetracks-empty-list">
        <span>No tracks available yet.</span>
      </div>
    `:r`
    <div class="lifetracks-list">
      ${e.map(s=>{const a=t?.date===s.date,i=Jd(s.date);return r`
          <button
            class="lifetracks-list-item ${a?"active":""} ${i?"today":""}"
            @click=${()=>n?.(s)}
          >
            <span class="list-item-date">${Aw(s.date)}</span>
            ${i?r`
                    <span class="list-item-badge">NEW</span>
                  `:h}
            ${a?r`
                    <span class="list-item-playing">▶</span>
                  `:h}
          </button>
        `})}
    </div>
  `}function Ew(e){if(!e?.stats)return h;const{totalGenerated:t,estimatedCost:n}=e.stats;return t===0?h:r`
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
  `}function bl(e){if(!e.config?.enabled&&!e.loading)return Tw(e.onEnable);if(e.loading)return r`
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
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:h}
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

        ${_w(e.generating??!1,e.generationError??null,e.onGenerate)}
      </div>
    `;const t=xw(e.data);return r`
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
              </button>`:h}
          ${e.onRefresh?r`<button class="lifetracks-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:h}
        </div>
      </div>

      <!-- Main content -->
      <div class="lifetracks-content">
        <!-- Player section -->
        <div class="lifetracks-player-section">
          <div class="lifetracks-section-label">NOW PLAYING</div>
          ${Cw(e.currentTrack,t,e.generating??!1,e.onGenerate)}
        </div>

        <!-- Track list section -->
        <div class="lifetracks-list-section">
          <div class="lifetracks-section-label">ALL TRACKS (${e.data.length})</div>
          ${Lw(e.data,e.currentTrack,e.onSelectTrack)}
        </div>
      </div>

      <!-- Stats -->
      ${Ew(e.config??null)}

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
  `}const wl=["trace","debug","info","warn","error","fatal"];function Mw(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function Rw(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function Pw(e){const t=e.filterText.trim().toLowerCase(),n=wl.some(i=>!e.levelFilters[i]),s=e.entries.filter(i=>i.level&&!e.levelFilters[i.level]?!1:Rw(i,t)),a=t||n?"filtered":"visible";return r`
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
        ${wl.map(i=>r`
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
                  <div class="log-time mono">${Mw(i.time)}</div>
                  <div class="log-level ${i.level??""}">${i.level??""}</div>
                  <div class="log-subsystem mono">${i.subsystem??""}</div>
                  <div class="log-message mono">${i.message??i.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function Iw(e){return r`
    <div class="mission-iframe-container">
      <iframe
        src="/ops/"
        class="mission-iframe"
        title="Mission Control"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  `}const Dw=/(^~\/|^\/|^\.\.?\/|[\\/])/;function kl(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!Dw.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function Zd(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const a=n.getAttribute("href")??"";let i=a;if(a.includes("%"))try{i=decodeURIComponent(a)}catch{i=a}return kl(i)}const s=t.closest("code");return!s||s.closest("pre")?null:kl(s.textContent??"")}function Nw(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const a=Oe(n,{listDepth:0,orderedIndex:[]});return Fw(a)}function mi(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${He(n,t)}

`;case"h2":return`## ${He(n,t)}

`;case"h3":return`### ${He(n,t)}

`;case"h4":return`#### ${He(n,t)}

`;case"h5":return`##### ${He(n,t)}

`;case"h6":return`###### ${He(n,t)}

`;case"p":return`${Oe(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Oe(n,t)}**`;case"em":case"i":return`*${Oe(n,t)}*`;case"del":return`~~${Oe(n,t)}~~`;case"a":{const a=n.getAttribute("href")??"",i=Oe(n,t);return!a||a===i?i:`[${i}](${a})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const a=n.querySelector("code"),i=a?a.textContent??"":n.textContent??"",o=a?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${i}
\`\`\`

`}case"blockquote":return Oe(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return $l(n,t,!1);case"ol":return $l(n,t,!0);case"li":return eu(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return Ow(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Oe(n,t);default:return Oe(n,t)}}function Oe(e,t){let n="";for(const s of Array.from(e.childNodes))n+=mi(s,t);return n}function He(e,t){return Oe(e,t).replace(/\n+/g," ").trim()}function $l(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),a="  ".repeat(t.listDepth);let i="";for(let o=0;o<s.length;o++){const l=s[o],c={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},d=n?`${o+1}. `:"- ",u=eu(l,c);i+=`${a}${d}${u}
`}return t.listDepth===0&&(i+=`
`),i}function eu(e,t){let n="";for(const s of Array.from(e.childNodes)){const a=s.tagName?.toLowerCase();a==="ul"||a==="ol"?n+=`
`+mi(s,t):n+=mi(s,t)}return n.trim()}function Ow(e,t){const n=[],s=e.querySelector("thead tr"),a=e.querySelectorAll("tbody tr");if(s){const d=Array.from(s.querySelectorAll("th, td")).map(u=>He(u,t));n.push(d)}for(const d of Array.from(a)){const u=Array.from(d.querySelectorAll("td, th")).map(f=>He(f,t));n.push(u)}if(n.length===0){const d=e.querySelectorAll("tr");for(const u of Array.from(d)){const f=Array.from(u.querySelectorAll("td, th")).map(g=>He(g,t));n.push(f)}}if(n.length===0)return"";const i=Math.max(...n.map(d=>d.length)),o=[];for(let d=0;d<i;d++)o[d]=Math.max(3,...n.map(u=>(u[d]??"").length));let l="";const c=d=>`| ${o.map((f,g)=>(d[g]??"").padEnd(f)).join(" | ")} |`;l+=c(n[0])+`
`,l+=`| ${o.map(d=>"-".repeat(d)).join(" | ")} |
`;for(let d=1;d<n.length;d++)l+=c(n[d])+`
`;return l+`
`}function Fw(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function Bw(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function Uw(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function zw(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let _n=null,en=null;function Sl(e,t,n=1500){_n&&clearTimeout(_n),_n=setTimeout(()=>{e!==en&&(en=e,t(e))},n)}function Kw(e,t){_n&&clearTimeout(_n),e!==en&&(en=e,t(e))}function za(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return Nw(e.innerHTML)}function Ww(e){const{data:t,loading:n,error:s,onRefresh:a,onOpenInObsidian:i,onSaveBrief:o,onToggleCheckbox:l,onOpenFile:c}=e;if(n)return r`
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
            <span class="empty-hint">Brief compiles at 5:00 AM</span>
          </div>
        </div>
      </div>
    `;en===null&&(en=t.content);const d=m=>{const w=m.currentTarget;if(o){const S=za(w);Sl(S,o)}},u=m=>{if((m.ctrlKey||m.metaKey)&&m.key==="s"){m.preventDefault();const w=m.currentTarget;if(o){const S=za(w);Kw(S,o)}}if((m.ctrlKey||m.metaKey)&&m.key==="l"){m.preventDefault();const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,x=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");if(x){const C=x.querySelector('input[type="checkbox"]');if(C)C.nextSibling?.nodeType===Node.TEXT_NODE&&C.nextSibling.textContent===" "&&C.nextSibling.remove(),C.remove();else{const $=document.createElement("input");$.type="checkbox",x.insertBefore(document.createTextNode(" "),x.firstChild),x.insertBefore($,x.firstChild)}const p=m.currentTarget;if(o){const $=za(p);Sl($,o)}}}if(m.key==="Enter"&&!m.shiftKey){const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,x=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");x&&x.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const C=window.getSelection();if(!C||C.rangeCount===0)return;const p=C.focusNode,$=p instanceof HTMLElement?p.closest("li"):p?.parentElement?.closest("li");if($&&$!==x&&!$.querySelector('input[type="checkbox"]')){const A=document.createElement("input");A.type="checkbox",$.insertBefore(A,$.firstChild),$.insertBefore(document.createTextNode(" "),A.nextSibling);const T=document.createRange();T.setStartAfter(A.nextSibling),T.collapse(!0),C.removeAllRanges(),C.addRange(T)}},0)}},f=m=>{const w=m.target;if(w.tagName==="INPUT"&&w.getAttribute("type")==="checkbox"){const x=w,C=m.currentTarget;if(l&&C){const $=Array.from(C.querySelectorAll('input[type="checkbox"]')).indexOf(x);$>=0&&l($,x.checked)}return}const S=Zd(m.target);S&&c&&(m.preventDefault(),c(S))},g=tf(Bw(t.content));return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${Uw(t.updatedAt)}</span>
          ${i?r`
                <a
                  href="${zw(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${m=>{m.preventDefault(),i()}}
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
            @input=${d}
            @keydown=${u}
            @click=${f}
          >${lt(g)}</div>
        </div>
      </div>
    </div>
  `}function jw(e){return e===de()}function Hw(e){const t=new Date(e+"T12:00:00");return Vw(t)}function Vw(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],a=n[e.getMonth()],i=e.getDate();return`${s}, ${a} ${i}`}function qw(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime()))return"";const s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleString()}function Gw(e){if(!e)return"";const t=e.split("/");return t[t.length-1]||e}function Yw(e){const t=de(),n=e.selectedDate??t,s=jw(n),a=Hw(n),i=e.viewMode??"my-day",o=e.agentLog??null;if(e.loading)return r`
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
    `;const l={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onToggleCheckbox:e.onBriefToggleCheckbox,onOpenFile:e.onOpenFile},c=d=>{if(!e.onOpenFile)return;const u=Zd(d.target);u&&(d.preventDefault(),e.onOpenFile(u))};return r`
    <div class="my-day-container">
      <!-- Header: Title + Date Nav + View Toggle -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Today</h1>
          <div class="my-day-header-nav-row">
            <div class="today-date-nav">
              ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">‹</button>`:h}
              <span class="today-date-label ${s?"":"past-date"}">${a}</span>
              ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">›</button>`:h}
              ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:h}
            </div>
            <div class="today-view-toggle">
              <button
                class="${i==="my-day"?"active":""}"
                @click=${()=>e.onViewModeChange?.("my-day")}
              >My Day</button>
              <button
                class="${i==="agent-log"?"active":""}"
                @click=${()=>e.onViewModeChange?.("agent-log")}
              >Agent Log</button>
            </div>
            ${!e.focusPulseActive&&e.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${e.onStartMorningSet} title="Start your morning focus ritual">\u2600\uFE0F Start Morning Set</button>`:h}
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
        ${i==="my-day"?Ww(l):r`
                <div class="my-day-card agent-log-section brief-editor">
                  <div class="my-day-card-header">
                    <div class="my-day-card-title">
                      <span class="my-day-card-icon">⚡</span>
                      <span>AGENT LOG</span>
                    </div>
                    <div class="agent-log-header-actions">
                      ${o?.updatedAt?r`<span class="brief-updated">${qw(o.updatedAt)}</span>`:h}
                      ${o?.sourcePath?r`<span class="agent-log-file" title=${o.sourcePath}>
                              ${Gw(o.sourcePath)}
                            </span>`:h}
                      ${e.onAgentLogRefresh?r`<button
                              class="brief-refresh-btn agent-log-refresh-btn"
                              @click=${e.onAgentLogRefresh}
                              title="Refresh agent log"
                            >
                              ↻
                            </button>`:h}
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
                                    ${lt(ke(o.content))}
                                  </div>
                                </div>
                              `:r`
                                <div class="my-day-empty">
                                  No agent day entry found for ${a}. Create/update
                                  <code>AGENT-DAY.md</code> and refresh.
                                </div>
                              `}
                  </div>
                </div>
              `}
      </div>
    </div>
  `}function Qw(e){const t=nk(e),n=lk(e);return r`
    ${dk(n)}
    ${ck(t)}
    ${Xw(e)}
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
              `:e.nodes.map(s=>wk(s))}
      </div>
    </section>
  `}function Xw(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
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
              ${n.map(a=>Jw(a,e))}
            `:h}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(a=>Zw(a,e))}
            `:h}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:h}
      </div>
    </section>
  `}function Jw(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?z(e.ts):"n/a",a=e.role?.trim()?`role: ${e.role}`:"role: -",i=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
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
  `}function Zw(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",a=`roles: ${Ha(e.roles)}`,i=`scopes: ${Ha(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
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
                ${o.map(l=>ek(e.deviceId,l,t))}
              </div>
            `}
      </div>
    </div>
  `}function ek(e,t,n){const s=t.revokedAtMs?"revoked":"active",a=`scopes: ${Ha(t.scopes)}`,i=z(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
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
  `}const ot="__defaults__",Al=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],tk=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function nk(e){const t=e.configForm,n=vk(e.nodes),{defaultBinding:s,agents:a}=bk(t),i=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:i,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:a,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function xl(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function sk(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function ak(e){const t=e?.defaults??{};return{security:xl(t.security),ask:sk(t.ask),askFallback:xl(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function ik(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(a=>{if(!a||typeof a!="object")return;const i=a,o=typeof i.id=="string"?i.id.trim():"";if(!o)return;const l=typeof i.name=="string"?i.name.trim():void 0,c=i.default===!0;s.push({id:o,name:l||void 0,isDefault:c})}),s}function ok(e,t){const n=ik(e),s=Object.keys(t?.agents??{}),a=new Map;n.forEach(o=>a.set(o.id,o)),s.forEach(o=>{a.has(o)||a.set(o,{id:o})});const i=Array.from(a.values());return i.length===0&&i.push({id:"main",isDefault:!0}),i.sort((o,l)=>{if(o.isDefault&&!l.isDefault)return-1;if(!o.isDefault&&l.isDefault)return 1;const c=o.name?.trim()?o.name:o.id,d=l.name?.trim()?l.name:l.id;return c.localeCompare(d)}),i}function rk(e,t){return e===ot?ot:e&&t.some(n=>n.id===e)?e:ot}function lk(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=ak(t),a=ok(e.configForm,t),i=yk(e.nodes),o=e.execApprovalsTarget;let l=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&l&&!i.some(f=>f.id===l)&&(l=null);const c=rk(e.execApprovalsSelectedAgent,a),d=c!==ot?(t?.agents??{})[c]??null:null,u=Array.isArray(d?.allowlist)?d.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:c,selectedAgent:d,agents:a,allowlist:u,target:o,targetNodeId:l,targetNodes:i,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function ck(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
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
                    `:e.agents.map(s=>mk(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function dk(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
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

      ${uk(e)}

      ${t?r`
            ${pk(e)}
            ${hk(e)}
            ${e.selectedScope===ot?h:fk(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function uk(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
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
  `}function pk(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===ot?"active":""}"
          @click=${()=>e.onSelectScope(ot)}
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
  `}function hk(e){const t=e.selectedScope===ot,n=e.defaults,s=e.selectedAgent??{},a=t?["defaults"]:["agents",e.selectedScope],i=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,l=typeof s.askFallback=="string"?s.askFallback:void 0,c=t?n.security:i??"__default__",d=t?n.ask:o??"__default__",u=t?n.askFallback:l??"__default__",f=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,g=f??n.autoAllowSkills,m=f==null;return r`
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
              @change=${w=>{const x=w.target.value;!t&&x==="__default__"?e.onRemove([...a,"security"]):e.onPatch([...a,"security"],x)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${c==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Al.map(w=>r`<option
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
              @change=${w=>{const x=w.target.value;!t&&x==="__default__"?e.onRemove([...a,"ask"]):e.onPatch([...a,"ask"],x)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${tk.map(w=>r`<option
                    value=${w.value}
                    ?selected=${d===w.value}
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
              @change=${w=>{const x=w.target.value;!t&&x==="__default__"?e.onRemove([...a,"askFallback"]):e.onPatch([...a,"askFallback"],x)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Al.map(w=>r`<option
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
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":m?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${g?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${g}
              @change=${w=>{const S=w.target;e.onPatch([...a,"autoAllowSkills"],S.checked)}}
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
  `}function fk(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
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
            `:n.map((s,a)=>gk(e,s,a))}
    </div>
  `}function gk(e,t,n){const s=t.lastUsedAt?z(t.lastUsedAt):"never",a=t.lastUsedCommand?Va(t.lastUsedCommand,120):null,i=t.lastResolvedPath?Va(t.lastResolvedPath,120):null;return r`
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
  `}function mk(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,a=t.nodes.length>0;return r`
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
  `}function vk(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.run"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function yk(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.execApprovals.get"||String(l)==="system.execApprovals.set"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function bk(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},a=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,i=e.agents??{},o=Array.isArray(i.list)?i.list:[];if(o.length===0)return{defaultBinding:a,agents:[t]};const l=[];return o.forEach((c,d)=>{if(!c||typeof c!="object")return;const u=c,f=typeof u.id=="string"?u.id.trim():"";if(!f)return;const g=typeof u.name=="string"?u.name.trim():void 0,m=u.default===!0,S=(u.tools??{}).exec??{},x=typeof S.node=="string"&&S.node.trim()?S.node.trim():null;l.push({id:f,name:g||void 0,index:d,isDefault:m,binding:x})}),l.length===0&&l.push(t),{defaultBinding:a,agents:l}}function wk(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),a=Array.isArray(e.caps)?e.caps:[],i=Array.isArray(e.commands)?e.commands:[];return r`
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
  `}function kk(e){const t=e.hello?.snapshot,n=t?.uptimeMs?xi(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",a=(()=>{if(e.connected||!e.lastError)return null;const o=e.lastError.toLowerCase();if(!(o.includes("unauthorized")||o.includes("connect failed")))return null;const c=!!e.settings.token.trim(),d=!!e.password.trim();return!c&&!d?r`
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
              ${e.lastChannelsRefresh?z(e.lastChannelsRefresh):"n/a"}
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
        <div class="muted">Next wake ${Xd(e.cronNext)}</div>
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
              ${e.updateLastChecked?z(e.updateLastChecked):"Never"}
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
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Run: <span class="mono">npm update -g @godmode-team/godmode</span>
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
  `}function $k(e,t=5){return e.filter(n=>n.lastContact).toSorted((n,s)=>{const a=new Date(n.lastContact).getTime();return new Date(s.lastContact).getTime()-a}).slice(0,t)}function Sk(e){const t=new Map;for(const n of e)if(n.tags.length===0){const s=t.get("uncategorized")??[];s.push(n),t.set("uncategorized",s)}else for(const s of n.tags){const a=t.get(s)??[];a.push(n),t.set(s,a)}return t}function tu(e){if(!e)return"";const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60*60*24));return a===0?"Today":a===1?"Yesterday":a<7?`${a}d ago`:a<30?`${Math.floor(a/7)}w ago`:`${Math.floor(a/30)}mo ago`}function Tl(e,t){return r`
    <button class="people-card" @click=${t} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
      <div class="people-card-main">
        <span class="people-avatar">${e.emoji??"👤"}</span>
        <div class="people-card-info">
          <span class="people-name">${e.name}</span>
          ${e.company||e.role?r`<span class="people-role">${[e.role,e.company].filter(Boolean).join(" at ")}</span>`:h}
        </div>
        ${e.lastContact?r`<span class="people-last-contact">${tu(e.lastContact)}</span>`:h}
      </div>
      ${e.tags.length>0?r`
            <div class="people-tags">
              ${e.tags.map(n=>r`<span class="people-tag">${n}</span>`)}
            </div>
          `:h}
    </button>
  `}function Ak(e,t){return r`
    <div class="my-day-card people-detail">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          ${t?r`<button class="people-back-btn" @click=${t}>← Back</button>`:h}
          <span class="my-day-card-icon">${e.emoji??"👤"}</span>
          <span>${e.name}</span>
        </div>
      </div>
      <div class="my-day-card-content">
        ${e.company||e.role?r`<div class="people-detail-row">
              <span class="people-detail-label">Role</span>
              <span>${[e.role,e.company].filter(Boolean).join(" at ")}</span>
            </div>`:h}
        ${e.email?r`<div class="people-detail-row">
              <span class="people-detail-label">Email</span>
              <a href="mailto:${e.email}">${e.email}</a>
            </div>`:h}
        ${e.phone?r`<div class="people-detail-row">
              <span class="people-detail-label">Phone</span>
              <span>${e.phone}</span>
            </div>`:h}
        ${e.birthday?r`<div class="people-detail-row">
              <span class="people-detail-label">Birthday</span>
              <span>${e.birthday}</span>
            </div>`:h}
        ${e.lastContact?r`<div class="people-detail-row">
              <span class="people-detail-label">Last Contact</span>
              <span>${tu(e.lastContact)}</span>
            </div>`:h}
        ${e.tags.length>0?r`<div class="people-detail-row">
              <span class="people-detail-label">Tags</span>
              <div class="people-tags">
                ${e.tags.map(n=>r`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:h}
        ${e.projects&&e.projects.length>0?r`<div class="people-detail-row">
              <span class="people-detail-label">Projects</span>
              <div class="people-tags">
                ${e.projects.map(n=>r`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:h}
        ${e.notes?r`<div class="people-detail-row">
              <span class="people-detail-label">Notes</span>
              <span style="white-space: pre-wrap;">${e.notes}</span>
            </div>`:h}
      </div>
    </div>
  `}function xk(e){const{people:t,loading:n,error:s,selectedId:a,searchQuery:i="",onRefresh:o,onSelectPerson:l,onBack:c,onSearchChange:d,onImportContacts:u}=e;if(n)return r`
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
          ${o?r`<button class="retry-button" @click=${o}>Retry</button>`:h}
        </div>
      </div>
    `;if(a){const w=t.find(S=>S.id===a);if(w)return r`
        <div class="my-day-container">
          <div class="my-day-header">
            <div class="my-day-header-left">
              <h1 class="my-day-title">People</h1>
              <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
            </div>
          </div>
          <div class="my-day-grid" style="grid-template-columns: 1fr;">
            ${Ak(w,c)}
          </div>
        </div>
      `}const f=i?t.filter(w=>{const S=i.toLowerCase();return w.name.toLowerCase().includes(S)||(w.company??"").toLowerCase().includes(S)||(w.role??"").toLowerCase().includes(S)||w.tags.some(x=>x.toLowerCase().includes(S))}):t,g=Sk(f),m=$k(t);return r`
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
          ${u?r`
                <div class="my-day-summary-divider"></div>
                <div style="position: relative;">
                  <button
                    class="my-day-refresh-btn"
                    @click=${w=>{const x=w.currentTarget.nextElementSibling;x.style.display=x.style.display==="block"?"none":"block"}}
                    title="Import Contacts"
                  >
                    ⬇ Import
                  </button>
                  <div
                    style="display: none; position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--mc-bg); border: 1px solid var(--mc-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000;"
                    @click=${w=>{const S=w.currentTarget;S.style.display="none"}}
                  >
                    <button
                      @click=${()=>u("apple")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      📱 Set up Apple Contacts (via Chat)
                    </button>
                    <button
                      @click=${()=>u("google")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      🌐 Set up Google Contacts (via Chat)
                    </button>
                  </div>
                </div>
              `:h}
          ${o?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${o} title="Refresh">↻</button>
              `:h}
        </div>
      </div>

      ${t.length>3?r`
            <div style="margin-bottom: 12px;">
              <input
                type="text"
                placeholder="Search contacts..."
                .value=${i}
                @input=${w=>d?.(w.target.value)}
                style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--mc-border); background: var(--mc-bg); color: var(--mc-text); font-size: 14px;"
              />
            </div>
          `:h}

      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${f.length===0?r`
              <div class="my-day-card">
                <div class="my-day-card-content">
                  <div class="my-day-empty">
                    ${t.length===0?"No contacts yet. Use chat to add people or run onboarding.":"No contacts match your search."}
                  </div>
                </div>
              </div>
            `:h}
        ${!i&&m.length>0?r`
              <div class="my-day-card">
                <div class="my-day-card-header">
                  <div class="my-day-card-title">
                    <span class="my-day-card-icon">⭐</span>
                    <span>Top Contacts</span>
                  </div>
                  <div class="my-day-card-count">${m.length}</div>
                </div>
                <div class="my-day-card-content">
                  ${m.map(w=>Tl(w,()=>l?.(w.id)))}
                </div>
              </div>
            `:h}
        ${Array.from(g.entries()).map(([w,S])=>r`
            <div class="my-day-card">
              <div class="my-day-card-header">
                <div class="my-day-card-title">
                  <span class="my-day-card-icon">${w==="uncategorized"?"📋":"🏷"}</span>
                  <span>${w==="uncategorized"?"Other":w}</span>
                </div>
                <div class="my-day-card-count">${S.length}</div>
              </div>
              <div class="my-day-card-content">
                ${S.map(x=>Tl(x,()=>l?.(x.id)))}
              </div>
            </div>
          `)}
      </div>
    </div>
  `}const Tk=["","off","minimal","low","medium","high"],_k=["","off","on"],Ck=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],Lk=["","off","on","stream"];function Ek(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function nu(e){return Ek(e)==="zai"}function Mk(e){return nu(e)?_k:Tk}function Rk(e,t){return!t||!e||e==="off"?e:"on"}function Pk(e,t){return e?t&&e==="on"?"low":e:null}function Ik(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function Dk(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function Nk(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function Ok(e){return r`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function Fk(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(i=>i.sessionKey)),s=t.filter(i=>!n.has(i.key)),a=e.archivedSessions.length;return r`
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
              `:s.map(i=>Uk(i,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${Bk(e,a)}
  `}function Bk(e,t){return t===0&&!e.archivedSessionsLoading?h:r`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${Ok(e.archivedSessionsExpanded)}
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
                ${e.archivedSessionsLoading?r`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?r`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>zk(n,e.onUnarchive,e.loading))}
              </div>
            `:h}
    </section>
  `}function Uk(e,t,n,s,a,i){const o=e.updatedAt?z(e.updatedAt):"n/a",l=e.thinkingLevel??"",c=nu(e.modelProvider),d=Rk(l,c),u=Mk(e.modelProvider),f=e.verboseLevel??"",g=e.reasoningLevel??"",m=e.displayName??e.key,w=e.kind!=="global",S=w?`${co("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${w?r`<a href=${S} class="session-link">${m}</a>`:m}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${x=>{const C=x.target.value.trim();n(e.key,{label:C||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${Wb(e)}</div>
      <div>
        <select
          .value=${d}
          ?disabled=${i}
          @change=${x=>{const C=x.target.value;n(e.key,{thinkingLevel:Pk(C,c)})}}
        >
          ${u.map(x=>r`<option value=${x}>${x||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${f}
          ?disabled=${i}
          @change=${x=>{const C=x.target.value;n(e.key,{verboseLevel:C||null})}}
        >
          ${Ck.map(x=>r`<option value=${x.value}>${x.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${g}
          ?disabled=${i}
          @change=${x=>{const C=x.target.value;n(e.key,{reasoningLevel:C||null})}}
        >
          ${Lk.map(x=>r`<option value=${x}>${x||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${i}
          @click=${()=>a(e.key)}
          title="Archive this session"
        >
          ${Dk()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function zk(e,t,n){const s=z(Date.parse(e.archivedAt));return r`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${Ik(e.reason)}</div>
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
          ${Nk()}
        </button>
      </div>
    </div>
  `}function Kk(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(n)):t;return r`
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
            @input=${a=>e.onFilterChange(a.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${s.length} shown</div>
      </div>

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

      ${s.length===0?r`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:r`
            <div class="list" style="margin-top: 16px;">
              ${s.map(a=>Wk(a,e))}
            </div>
          `}
    </section>
  `}function Wk(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",a=t.messages[e.skillKey]??null,i=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(c=>`bin:${c}`),...e.missing.env.map(c=>`env:${c}`),...e.missing.config.map(c=>`config:${c}`),...e.missing.os.map(c=>`os:${c}`)],l=[];return e.disabled&&l.push("disabled"),e.blockedByAllowlist&&l.push("blocked by allowlist"),r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Va(e.description,140)}</div>
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
  `}function su(){return{open:!1,images:[],currentIndex:0}}function jk(e,t,n){return{open:!0,images:t,currentIndex:n}}function Hk(){return su()}function Vk(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const qk=r`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,Gk=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,Yk=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function Qk(e,t){if(!e.open||e.images.length===0)return h;const n=e.images[e.currentIndex];if(!n)return h;const s=e.images.length>1,a=e.currentIndex>0,i=e.currentIndex<e.images.length-1;return r`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&i&&t.onNav(1),o.key==="ArrowLeft"&&a&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${qk}
      </button>

      ${s&&a?r`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${Gk}</button>`:h}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&i?r`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${Yk}</button>`:h}

      ${s?r`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:h}
    </div>
  `}const Xk=e=>{switch(e){case"success":return r`
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
      `}};function Jk({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${Xs(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${Xk(n.type)}</div>
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
  `}const _l={"godmode-launch":"🚀","edison-year":"👶","health-foundation":"💪","pa-systematization":"⚙️",default:"🎯"},Zk={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"};function e$(e){const t=new Date(e),n=new Date,s=t.getFullYear()-n.getFullYear();return s<=0?"This year":s===1?"Next year":`${s} years`}function au(e){return`${Math.round(e*100)}%`}function t$(e){return _l[e]||_l.default}function n$(e){const t=e.progress*100;return r`
    <div class="vision-cda-section">
      <div class="vision-cda-label">CHIEF DEFINITE AIM</div>
      <blockquote class="vision-cda-statement">"${e.statement}"</blockquote>
      <div class="vision-cda-meta">
        <div class="vision-cda-deadline">
          <span class="meta-icon">📅</span>
          <span class="meta-value">${e.deadline}</span>
          <span class="meta-label">(${e$(e.deadline)})</span>
        </div>
        <div class="vision-cda-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${t}%"></div>
          </div>
          <span class="progress-label">${au(e.progress)} progress</span>
        </div>
      </div>
    </div>
  `}function s$(e){return e?r`
    <div class="vision-identity-section">
      <div class="vision-section-label">TODAY'S IDENTITY</div>
      <div class="vision-identity-card">
        <span class="identity-icon">💎</span>
        <blockquote class="identity-statement">"${e}"</blockquote>
      </div>
    </div>
  `:null}function a$(e){return!e||e.length===0?r`
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
                <span class="theme-icon">${t$(t.id)}</span>
                <span class="theme-title">${t.theme}</span>
              </div>
              <p class="theme-description">${t.description}</p>
              <div class="theme-progress">
                <div class="progress-bar-container small">
                  <div class="progress-bar-fill" style="width: ${n}%"></div>
                </div>
                <span class="progress-label">${au(t.progress)}</span>
              </div>
              ${t.wheelSpokes&&t.wheelSpokes.length>0?r`
                    <div class="theme-spokes">
                      ${t.wheelSpokes.map(s=>r`
                          <span class="theme-spoke-badge">${Zk[s]||s}</span>
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
  `}function i$(e){return!e||e.length===0?null:r`
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
  `}function o$(e){return!e||e.length===0?null:r`
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
  `}function Cl(e){if(e.loading)return r`
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
      ${n$(t.chiefDefiniteAim)}

      <!-- Today's Identity (rotated daily) -->
      ${s$(n)}

      <!-- Annual Themes -->
      ${a$(t.annualThemes)}

      <!-- Two-column layout for Values and Anti-Goals -->
      <div class="vision-bottom-grid">
        ${i$(t.values)} ${o$(t.antiGoals)}
      </div>
    </div>
  `}const tt=["health","wealth","career","relationships","fun","environment","growth","contribution"],us={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"},iu={health:"💪",wealth:"💰",career:"🚀",relationships:"❤️",fun:"🎉",environment:"🏠",growth:"📚",contribution:"🤝"};function r$(e){return new Date(e).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}function l$(e){switch(e){case"up":return"↑";case"down":return"↓";case"stable":return"→"}}function c$(e){switch(e){case"up":return"trend-up";case"down":return"trend-down";case"stable":return"trend-stable"}}function d$(e){return e<=4?"score-low":e<=6?"score-medium":"score-high"}function u$(e){const a=2*Math.PI/tt.length,i=tt.map((l,c)=>{const d=c*a-Math.PI/2,u=(e[l]?.current??5)/10,f=150+Math.cos(d)*120*u,g=150+Math.sin(d)*120*u;return`${f},${g}`}).join(" "),o=tt.map((l,c)=>{const d=c*a-Math.PI/2,u=(e[l]?.target??8)/10,f=150+Math.cos(d)*120*u,g=150+Math.sin(d)*120*u;return`${f},${g}`}).join(" ");return r`
    <div class="wheel-chart-container">
      <svg viewBox="0 0 300 300" class="wheel-chart">
        <!-- Grid circles -->
        ${[2,4,6,8,10].map(l=>Qn`
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
        ${tt.map((l,c)=>{const d=c*a-Math.PI/2,u=150+Math.cos(d)*120,f=150+Math.sin(d)*120;return Qn`
            <line
              x1="${150}"
              y1="${150}"
              x2="${u}"
              y2="${f}"
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
          points="${i}"
          fill="var(--accent)"
          fill-opacity="0.25"
          stroke="var(--accent)"
          stroke-width="2.5"
        />

        <!-- Score dots -->
        ${tt.map((l,c)=>{const d=c*a-Math.PI/2,u=(e[l]?.current??5)/10,f=150+Math.cos(d)*120*u,g=150+Math.sin(d)*120*u;return Qn`
            <circle
              cx="${f}"
              cy="${g}"
              r="5"
              fill="var(--accent)"
              stroke="var(--bg)"
              stroke-width="2"
            />
          `})}

        <!-- Spoke labels -->
        ${tt.map((l,c)=>{const d=c*a-Math.PI/2,u=145,f=150+Math.cos(d)*u,g=150+Math.sin(d)*u,m=e[l]?.current??5;return Qn`
            <text
              x="${f}"
              y="${g}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="var(--text)"
              font-size="11"
              font-weight="500"
            >
              ${iu[l]} ${m}
            </text>
          `})}
      </svg>
    </div>
  `}function p$(e,t,n){return r`
    <div class="wheel-spokes-grid">
      ${tt.map(s=>{const a=e[s];if(!a)return null;const o=n[s]?.current??a.current,l=a.target-o;return r`
          <div class="wheel-spoke-card ${d$(o)}">
            <div class="spoke-card-header">
              <span class="spoke-icon">${iu[s]}</span>
              <span class="spoke-name">${us[s]}</span>
              <span class="spoke-trend ${c$(a.trend)}">
                ${l$(a.trend)}
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
                        <span class="spoke-score-value">${a.current}</span>
                        <span class="spoke-score-label">current</span>
                      </div>
                      <div class="spoke-target">
                        <span class="spoke-score-value">${a.target}</span>
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
  `}function Ll(e){if(e.loading)return r`
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
    `;const{data:t,editMode:n=!1}=e,s={},a=tt.filter(i=>(t.scores[i]?.current??5)<=4);return r`
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
      <div class="wheel-date-badge">As of ${r$(t.asOf)}</div>

      <!-- Alerts -->
      ${a.length>0?r`
            <div class="wheel-alerts">
              <div class="wheel-alert warning">
                <span class="alert-icon">⚠️</span>
                <span class="alert-text">
                  <strong>Attention needed:</strong>
                  ${a.map(i=>us[i]).join(", ")}
                  ${a.length===1?"is":"are"} below 5
                </span>
              </div>
            </div>
          `:null}

      <!-- Main content grid -->
      <div class="wheel-content">
        <!-- Radar chart -->
        <div class="wheel-chart-section">${u$(t.scores)}</div>

        <!-- Spoke cards -->
        <div class="wheel-spokes-section">
          ${p$(t.scores,n,s)}
        </div>
      </div>

      <!-- Insights -->
      <div class="wheel-insights">
        <div class="wheel-insight">
          <span class="insight-icon">📉</span>
          <span class="insight-label">Lowest</span>
          <span class="insight-value">${us[t.lowestSpoke]??"—"}</span>
        </div>
        <div class="wheel-insight">
          <span class="insight-icon">🎯</span>
          <span class="insight-label">Biggest Gap</span>
          <span class="insight-value">${us[t.biggestGap]??"—"}</span>
        </div>
      </div>
    </div>
  `}const El=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0},{key:"deck.enabled",icon:"🏛️",name:"Deck",description:"Parallel agent session manager. Opens in a separate tab for multi-agent workflows.",default:!1},{key:"missionControl.enabled",icon:"📡",name:"Mission Control",description:"Ops dashboard for gateway health, feed activity, and task queue. Under reconstruction.",default:!1}];function h$(e,t){return r`
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
  `}function f$(e,t,n){const a=!!(t?.[e.key]??e.default);return r`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${h$(a,()=>n(e.key,!a))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function g$(e){const{connected:t,loading:n,options:s,onToggle:a,onOpenWizard:i}=e;return t?n&&!s?r`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:r`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${El.map(o=>f$(o,s,a))}
      </div>
      ${El.length===0?r`<div class="options-empty">
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
    `}const Ml=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],m$=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],v$=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],Ka=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],Rl=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function Pl(e){const n=Math.min(Number(e),8);return r`
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
  `}function y$(e){if(e>=Rl.length)return r`${h}`;const t=Rl[e];return r`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function b$(e,t,n,s){return r`
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
  `}function ou(){return r`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function w$(e,t){function n(a){const i=a.target.value;t.onAnswerChange("name",i)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(1))}return r`
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
  `}function k$(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return r`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${Ml.includes(n)?h:r`<option value="${n}">${n} (detected)</option>`}
        ${Ml.map(s=>r`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${ou()}
    </div>
  `}function $$(e,t){function n(a){t.onAnswerChange("focus",a.target.value)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(3))}return r`
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
  `}function S$(e,t){function n(){const i=document.querySelector(".wizard-project-input");if(!i)return;const o=i.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),i.value="",i.focus())}function s(i){const o=e.projects.filter((l,c)=>c!==i);t.onAnswerChange("projects",o)}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return r`
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
  `}function A$(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${m$.map(n=>r`
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
  `}function x$(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(l=>l!==o)):t.onAnswerChange("hardRules",[...n,o])}function a(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const l=o.value.trim();l&&(t.onAnswerChange("hardRules",[...n,l]),o.value="",o.focus())}function i(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&a())}return r`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${Ka.map(o=>r`
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
      ${n.filter(o=>!Ka.includes(o)).length>0?r`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!Ka.includes(o)).map(o=>r`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(l=>l!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:h}
    </div>
  `}function T$(e,t){function n(){const i=document.querySelector(".wizard-person-input");if(!i)return;const o=i.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),i.value="",i.focus())}function s(i){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,l)=>l!==i))}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return r`
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
  `}function _$(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${v$.map(n=>r`
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
      ${ou()}
    </div>
  `}function C$(e,t){const{answers:n,preview:s,generating:a}=e;return r`
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
                ${n.projects.map(i=>r`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:h}

        ${n.keyPeople.length>0?r`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(i=>r`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:h}

        ${n.hardRules.length>0?r`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(i=>r`<div class="wizard-review-item">${i}</div>`)}
              </div>
            `:h}
      </div>

      ${s&&s.length>0?r`
            <div class="wizard-review-section wizard-review-files">
              <h3>Files to Generate</h3>
              <div class="wizard-file-list">
                ${s.map(i=>r`
                    <div class="wizard-file-item ${i.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <span class="wizard-file-icon">${i.wouldCreate?"+":"-"}</span>
                      <span class="wizard-file-path">${i.path}</span>
                      <span class="wizard-file-status">${i.wouldCreate?"will create":"exists (skip)"}</span>
                    </div>
                  `)}
              </div>
              <p class="wizard-hint">Plus: OC config will be patched with optimal memory/agent settings.</p>
            </div>
          `:h}

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

      ${e.error?r`<div class="wizard-error">${e.error}</div>`:h}
    </div>
  `}function L$(e,t){const n=e.result;return n?r`
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
  `:r`${h}`}function ru(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function E$(){return{step:0,answers:ru(),preview:null,generating:!1,result:null,error:null}}function lu(e,t){const{step:n,answers:s}=e;if(n===9)return r`
      <div class="wizard-fullscreen">
        ${L$(e,t)}
      </div>
    `;if(n===8)return r`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${Pl(n)}
          ${C$(e,t)}
        </div>
      </div>
    `;const a=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),i=n===7,o=(()=>{switch(n){case 0:return w$(s,t);case 1:return k$(s,t);case 2:return $$(s,t);case 3:return S$(s,t);case 4:return A$(s,t);case 5:return x$(s,t);case 6:return T$(s,t);case 7:return _$(s,t);default:return r`${h}`}})();return r`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${Pl(n)}
        ${y$(n)}
        ${o}
        ${b$(n,t,a,i)}
      </div>
    </div>
  `}const M$=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:ru,emptyWizardState:E$,renderOnboardingWizard:lu},Symbol.toStringTag,{value:"Module"}));function nn(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function zn(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function R$(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function P$(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function I$(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function D$(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function N$(e){const t=e.overallScore,n=nn(t);return r`
    <div class="trust-overall">
      <div class="trust-overall-score ${zn(n)}">
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
  `}function O$(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),a=nn(e??(t>0?t:null));return r`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${zn(a)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function F$(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",a=nn(e.trustScore??(e.avgRating>0?e.avgRating:null)),i=e.count<10?10-e.count:0;return r`
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
        <span class="trust-card-score ${zn(a)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${P$(e.trend)}">
          ${I$(e.trend)} ${R$(e.trend)}
        </span>
      </div>

      ${O$(e.trustScore,e.avgRating)}

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
  `}function B$(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function U$(){const e=B$();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function z$(e){const t=nn(e.rating);return r`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${zn(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?r`<span class="trust-rating-note">${e.note}</span>`:h}
      <span class="trust-rating-time">${D$(e.timestamp)}</span>
    </div>
  `}function K$(){return r`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function W$(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,a=e.data?.todayRating??null,i=e.updateStatus??null,o=i?.openclawUpdateAvailable||i?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const c=[];return i.openclawUpdateAvailable&&i.openclawLatest&&c.push(`OpenClaw ${i.openclawVersion} → ${i.openclawLatest}`),i.pluginUpdateAvailable&&i.pluginLatest&&c.push(`GodMode ${i.pluginVersion} → ${i.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:c.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const c=n.gates.filter(u=>u.enabled).length,d=n.gates.length;if(c<d)return{level:"warn",icon:"🛡",text:`${d-c} security gate${d-c!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const l=i&&!o?" Up to date.":"";return a?a.rating>=8?{level:"ok",icon:"✨",text:`Rated ${a.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${l}`}:a.rating>=5?{level:"ok",icon:"💪",text:`Rated ${a.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${l}`}:{level:"warn",icon:"💬",text:`Rated ${a.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${l}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${l} Rate your day below to help improve.`}}function j$(e){const{level:t,icon:n,text:s,detail:a}=W$(e);return r`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${a}</div>
      </div>
    </div>
  `}function H$(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function Il(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return r`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return r`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),a=nn(n.rating);return r`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${a==="none"?"medium":a}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function V$(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],a=t?.dailyStreak??0,i=t?.dailyAverage??null;if(!e.onDailyRate)return h;if(n){const o=nn(n.rating),l=n.rating<7&&!n.note;return r`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${a>1?r`<span class="trust-daily-streak">${a} day streak</span>`:h}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${zn(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?r`<span class="trust-daily-result-note">"${n.note}"</span>`:h}
            ${i!==null?r`<span class="trust-daily-result-note">7-day avg: ${i}/10</span>`:h}
          </div>
          ${s.length>1?Il(s):h}
        </div>
        ${l?r`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${c=>{if(c.key==="Enter"){const d=c.target,u=d.value.trim();u&&e.onDailyRate&&(e.onDailyRate(n.rating,u),d.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${c=>{const u=c.target.previousElementSibling,f=u?.value?.trim();f&&e.onDailyRate&&(e.onDailyRate(n.rating,f),u.value="")}}
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
              class="trust-daily-button ${H$(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?r`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${Il(s)}
              ${i!==null?r`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${i}/10</span>`:h}
            </div>
          `:h}
    </div>
  `}function q$(e){if(!e)return r`
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
    `;const t=e.gates,n=t.filter(u=>u.enabled).length,s=t.length,a=n===s,i=Date.now()-864e5,o=e.activity.filter(u=>Date.parse(u.timestamp)>i),l=o.filter(u=>u.action==="blocked").length,c=o.filter(u=>u.action==="fired").length,d=a?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${d}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(u=>r`
            <div class="trust-health-gate ${u.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${u.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${u.icon}</span>
              <span class="trust-health-gate-name">${u.name}</span>
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
  `}function G$(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function Y$(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function Q$(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,a=e.gatewayUptimeMs,l=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return r`
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
        <span class="trust-health-dot ${Y$(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${G$(n)}</span>
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
              <span class="trust-health-value">${xi(a)}</span>
            </div>
          `:h}
    </div>
  `}function X$(e){return r`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${q$(e.guardrailsData)}
        ${Q$(e)}
      </div>
    </div>
  `}function J$(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:a,onRefresh:i}=e;if(!t)return r`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const l=!(s?.summaries??[]).some(f=>f.count>0),c=l?U$():s,d=c.summaries,u=l?[]:s?.ratings??[];return r`
    <section class="tab-body trust-section">
      ${j$(e)}

      ${l?K$():h}

      ${V$(e)}

      ${N$(c)}

      <div class="trust-workflows-grid">
        ${d.map(f=>F$(f,l?null:a))}
      </div>

      ${X$(e)}

      ${u.length>0?r`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${u.slice(0,20).map(z$)}
              </div>
            </div>
          `:h}
    </section>
  `}function Z$(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function e0(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function t0(e,t){return r`
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
  `}function n0(e,t,n,s){const a=e.thresholds?.[t]??0;return r`
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
  `}function s0(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return r`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${t0(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?r`
            <div class="guardrails-thresholds">
              ${s.map(a=>n0(e,a,e.thresholdLabels[a],n))}
            </div>
          `:h}
    </div>
  `}function a0(e){return r`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${e0(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${Z$(e.timestamp)}</span>
    </div>
  `}function i0(e){const{connected:t,loading:n,data:s,onToggle:a,onThresholdChange:i}=e;if(!t)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const o=s?.gates??[],l=s?.activity??[],c=o.filter(d=>d.enabled).length;return r`
    <section class="tab-body guardrails-section">
      <div class="guardrails-summary">
        <span class="guardrails-summary-count">${c}/${o.length}</span>
        <span class="guardrails-summary-label">gates active</span>
      </div>

      <div class="guardrails-grid">
        ${o.map(d=>s0(d,a,i))}
      </div>

      ${l.length>0?r`
            <div class="guardrails-history">
              <h3 class="guardrails-history-title">Recent Activity</h3>
              <div class="guardrails-history-list">
                ${l.slice(0,30).map(a0)}
              </div>
            </div>
          `:r`
            <div class="guardrails-history">
              <div class="guardrails-no-activity">No gate activity recorded yet.</div>
            </div>
          `}
    </section>
  `}function o0(e,t){if(e?.displayName)return e.displayName;const n=it.get(t);if(n)return n;if(e?.label)return e.label;if(t.includes("webchat")){const a=t.match(/webchat[:-](\d+)/);return a?`Chat ${a[1]}`:"Chat"}if(t.includes("main"))return"MAIN";const s=t.split(/[:-]/);return s[s.length-1]||t}function r0(e){return e?e>=1e3?`${(e/1e3).toFixed(1)}k`:String(e):"0"}function l0(e){const t=e,n=String(t.role??"");if(n!=="user"&&n!=="assistant")return h;const s=typeof t.content=="string"?t.content:Array.isArray(t.content)?t.content.filter(i=>i.type==="text").map(i=>String(i.text??"")).join(" "):"";if(!s.trim())return h;const a=s.slice(0,300);return r`
    <div class="parallel-col__msg parallel-col__msg--${n}">
      <span class="parallel-col__msg-role">${n==="user"?"You":"AI"}</span>
      <span class="parallel-col__msg-text">${a}${s.length>300?"...":""}</span>
    </div>
  `}function c0(e){return r`
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
  `}function d0(e,t,n){const{state:s,onAssignLane:a,onSendInLane:i}=n,o=s.sessionsResult?.sessions??[],l=Le(o,t),c=l?.key??t,d=s.workingSessions.has(t)||s.workingSessions.has(c),u=o0(l,t),f=Ss.get(t)??Ss.get(c),g=l?.model??"",m=l?.totalTokens??0,w=s.settings.tabLastViewed[c]??s.settings.tabLastViewed[t]??0,S=l?.updatedAt??0,x=!d&&S>w,p=t===s.sessionKey?s.chatMessages:Be.get(t)??Be.get(c)??[],$=A=>{A instanceof HTMLElement&&A.dispatchEvent(new CustomEvent("lane-viewed",{detail:{sessionKey:c},bubbles:!0,composed:!0}))};return r`
    <div
      class="parallel-col parallel-col--filled ${d?"parallel-col--working":""} ${x?"parallel-col--ready":""}"
      @pointerdown=${A=>$(A.currentTarget)}
      @focusin=${A=>$(A.currentTarget)}
      @dragover=${A=>{A.preventDefault(),A.dataTransfer&&(A.dataTransfer.dropEffect="move"),A.currentTarget.classList.add("parallel-col--dragover")}}
      @dragleave=${A=>{A.currentTarget.classList.remove("parallel-col--dragover")}}
      @drop=${A=>{A.preventDefault(),A.currentTarget.classList.remove("parallel-col--dragover");const T=A.dataTransfer?.getData("text/lane-index");if(T!=null&&T!==""){const E=Number.parseInt(T,10);if(!Number.isNaN(E)){A.currentTarget.dispatchEvent(new CustomEvent("lane-reorder",{detail:{fromIndex:E,toIndex:e},bubbles:!0,composed:!0}));return}}const L=A.dataTransfer?.getData("text/session-key");L&&A.currentTarget.dispatchEvent(new CustomEvent("lane-drop",{detail:{laneIndex:e,sessionKey:L},bubbles:!0,composed:!0}))}}
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
          <span class="parallel-col__name">${u}</span>
          <div class="parallel-col__header-actions">
            <span
              class="parallel-col__status-dot ${d?"parallel-col__status-dot--working":x?"parallel-col__status-dot--ready":"parallel-col__status-dot--idle"}"
              title=${d?"Working":x?"Ready":"Idle"}
            ></span>
            <span
              class="parallel-col__status ${d?"parallel-col__status--working":x?"parallel-col__status--ready":""}"
              >${d?"WORKING":x?"READY":"IDLE"}</span
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
          ${g?r`<span class="parallel-col__model">${g}</span>`:h}
          <span class="parallel-col__turns">${f!=null?`${f} turns`:"--"}</span>
          <span class="parallel-col__tokens">${r0(m)} tokens</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="parallel-col__messages">
        ${p.length>0?p.slice(-120).map(l0):r`<div class="parallel-col__empty">No messages yet</div>`}
      </div>

      <!-- Compose -->
      <div class="parallel-col__compose">
        <input
          type="text"
          class="parallel-col__input"
          draggable="false"
          placeholder="Message..."
          @keydown=${A=>{if(A.key==="Enter"&&!A.shiftKey){A.preventDefault();const T=A.target,L=T.value.trim();L&&(i(t,L),T.value="")}}}
        />
      </div>
    </div>
  `}function u0(e){const t=e.state.settings.parallelLanes;return r`
    <div
      class="parallel-columns"
      @lane-drop=${n=>{e.onAssignLane(n.detail.laneIndex,n.detail.sessionKey)}}
      @lane-reorder=${n=>{e.onReorderLanes(n.detail.fromIndex,n.detail.toIndex)}}
      @lane-viewed=${n=>{e.onLaneViewed(n.detail.sessionKey)}}
    >
      ${t.map((n,s)=>n?d0(s,n,e):c0(s))}
    </div>
  `}const p0=20;function h0(e){switch(e.split(".").pop()?.toLowerCase()){case"md":return"📝";case"html":return"🌐";case"json":case"yaml":case"yml":case"toml":return"⚙️";case"ts":case"js":case"py":case"sh":case"rs":case"go":return"💻";case"css":return"🎨";default:return"📄"}}function f0(e){const t=[];function n(s){for(const a of s){if(t.length>=p0)return;const i=a;i.type==="file"?t.push(i):i.type==="directory"&&i.children&&n(i.children)}}return n(e),t}function g0(e,t){if(!e||e.length===0)return h;const n=f0(e);return n.length===0?h:r`
    <div class="work-file-list">
      ${n.map(s=>r`
        <button
          class="work-file-item"
          @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
        >
          <span class="work-file-icon">${h0(s.name)}</span>
          <span class="work-file-name">${s.name}</span>
          ${s.size!=null?r`<span class="work-file-meta">${(s.size/1024).toFixed(1)}KB</span>`:h}
        </button>
      `)}
      ${e.length>n.length?r`<div class="work-file-overflow">+${e.length-n.length} more files</div>`:h}
    </div>
  `}function m0(e,t,n,s,a,i,o,l){return r`
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
              ${n.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${g0(n,o)}
                    </div>
                  `:e.outputs.length>0?r`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${v0(e.outputs)}
                      </div>
                    `:h}
              ${e.people.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${e.people.map(c=>r`
                            <button
                              class="work-person-chip"
                              @click=${d=>{d.stopPropagation(),i?.(c)}}
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
                              @click=${d=>{d.stopPropagation(),l?.(c,e.name)}}
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
  `}function v0(e){const t=e.reduce((s,a)=>{const i=a.type||"other";return s[i]||(s[i]=[]),s[i].push(a),s},{}),n={document:"📄",template:"📋",report:"📊",presentation:"📽️",spreadsheet:"📈",code:"💻",image:"🖼️",video:"🎬",audio:"🎵",archive:"📦",pdf:"📕",markdown:"📝"};return r`
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
  `}function y0(e){const{projects:t,loading:n,error:s,expandedProjects:a=new Set,projectFiles:i={},detailLoading:o=new Set,onRefresh:l,onToggleProject:c,onPersonClick:d,onFileClick:u,onSkillClick:f}=e;if(n)return r`
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
    `;const g=t.filter(w=>w.status==="active"),m=t.filter(w=>w.status==="archived");return r`
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
              `:h}
        </div>
      </div>

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${g.length===0&&m.length===0?r`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `:h}
          ${g.map(w=>m0(w,a.has(w.id),i[w.id]??[],o.has(w.id),()=>c?.(w.id),d,u,f))}
          ${m.length>0?r`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${m.length} archived project${m.length!==1?"s":""}
                </div>
              `:h}
        </div>
      </div>
    </div>
  `}function cu(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function du(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function Dl(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function uu(e){return`ws-task-priority ws-task-priority--${e}`}function pu(e){return e==="high"?"High":e==="low"?"Low":"Med"}function hu(e){if(!e)return"";const t=de();return e===t?"Today":e<t?`Overdue (${e})`:e}function fu(e){if(!e)return"ws-task-due";const t=de();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function vi(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,a)=>{if(t==="priority"){const i=n[s.priority]-n[a.priority];return i!==0?i:s.dueDate&&a.dueDate?s.dueDate.localeCompare(a.dueDate):s.dueDate&&!a.dueDate?-1:!s.dueDate&&a.dueDate?1:0}if(t==="newest")return(a.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&a.dueDate){const i=s.dueDate.localeCompare(a.dueDate);if(i!==0)return i}else{if(s.dueDate&&!a.dueDate)return-1;if(!s.dueDate&&a.dueDate)return 1}return n[s.priority]-n[a.priority]})}function Nl(e,t,n,s,a,i){const o=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${c=>{c.preventDefault();const d=c.currentTarget,u=d.querySelector(".ws-task-edit-input"),f=d.querySelector(".ws-task-date-input"),g=u.value.trim();g&&(i?.(e.id,{title:g,dueDate:f.value||null}),a?.(null))}}
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
    `:r`
    <div class="ws-list-row ws-task-row ${o?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${o?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${o?"Mark incomplete":"Mark complete"}
      >
        ${o?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${o?"ws-task-title--done":""}"
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${uu(e.priority)}>${pu(e.priority)}</span>
      ${e.dueDate?r`<span class=${fu(e.dueDate)}>${hu(e.dueDate)}</span>`:h}
      ${!o&&n?r`<button
            class="ws-task-start-btn"
            @click=${()=>n(e.id)}
            title="Start working on this task"
          >Start</button>`:h}
    </div>
  `}function b0(e,t,n,s,a,i){const o=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${c=>{c.preventDefault();const d=c.currentTarget,u=d.querySelector(".ws-task-edit-input"),f=d.querySelector(".ws-task-date-input"),g=u.value.trim();g&&(i?.(e.id,{title:g,dueDate:f.value||null}),a?.(null))}}
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
    `:r`
    <div class="ws-list-row ws-task-row ${o?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${o?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${o?"Mark incomplete":"Mark complete"}
      >
        ${o?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${o?"ws-task-title--done":""}"
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?r`<span class="ws-task-project">${e.project}</span>`:h}
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${uu(e.priority)}>${pu(e.priority)}</span>
      ${e.dueDate?r`<span class=${fu(e.dueDate)}>${hu(e.dueDate)}</span>`:h}
      ${!o&&n?r`<button
            class="ws-task-start-btn"
            @click=${()=>n(e.id)}
            title="Start working on this task"
          >Start</button>`:h}
    </div>
  `}function w0(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function Ol(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function Fl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function gu(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,a)=>{if(a.type==="file")(a.name.toLowerCase().includes(n)||a.path.toLowerCase().includes(n))&&s.push(a);else{const i=gu(e,a.children??[]);i.length>0&&s.push({...a,children:i})}return s},[])}function mu(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=mu(n.children));return t}function vu(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return r`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${du(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?r`<span class="ws-list-meta">${cu(e.size)}</span>`:h}
          ${e.modified?r`<span class="ws-list-meta">${z(e.modified.getTime())}</span>`:h}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),a=e.children??[],i=mu(a);return r`
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
              ${a.map(o=>vu(o,t+1,n))}
            </div>
          `:h}
    </div>
  `}function k0(e,t,n){return r`
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
            <span>${z(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${n?r`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:h}
    </div>
  `}function Bl(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${du(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${cu(n.size)}</span>
        <span class="ws-list-meta">${z(n.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>i?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function $0(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:a=!1,onItemSearch:i,onBack:o,onItemClick:l,onSessionClick:c,onPinToggle:d,onPinSessionToggle:u,onToggleFolder:f,onToggleTaskComplete:g,onCreateTask:m,onToggleCompletedTasks:w,onStartTask:S,editingTaskId:x,onEditTask:C,onUpdateTask:p}=e,$=Ol(n,t.pinned).toSorted((M,W)=>W.modified.getTime()-M.modified.getTime()),A=Fl(n,t.pinnedSessions),T=Ol(n,t.outputs).filter(M=>!t.pinned.some(W=>W.path===M.path)),L=(t.folderTree?.length??0)>0,E=L?gu(n,t.folderTree):[],F=Fl(n,t.sessions),V=new Set(t.pinnedSessions.map(M=>M.key)),j=new Set(t.pinned.map(M=>M.path)),H=n.trim().length>0,se=$.length>0||A.length>0,ge=F.length>0||t.sessions.length===0||H,D={expandedFolders:s,pinnedPaths:j,workspaceId:t.id,onToggleFolder:f,onItemClick:l,onPinToggle:d};return r`
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
            @input=${M=>i?.(M.target.value)}
          />
        </div>
      </div>

      <div class="workspace-content">
        ${se?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${$.length+A.length}</span>
                  </div>
                  <div class="ws-list">
                    ${A.map(M=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>c?.(M)}>
                            <span class=${Dl(M.status)}></span>
                            <span class="ws-list-title">${M.title}</span>
                            <span class="ws-list-meta">${z(M.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>u?.(t.id,M.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${$.map(M=>Bl({workspaceId:t.id,entry:M,pinned:!0,onOpen:l,onPinToggle:d}))}
                  </div>
                </section>
              `:h}

        ${S0({tasks:t.tasks??[],workspaceName:t.name,showCompleted:a,onToggleTaskComplete:g,onCreateTask:m,onToggleCompletedTasks:w,onStartTask:S,editingTaskId:x,onEditTask:C,onUpdateTask:p})}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${L?E.length:T.length}</span>
          </div>
          <div class="ws-list ws-list--scroll">
            ${L?E.length===0?r`<div class="ws-empty">No artifacts</div>`:E.map(M=>vu(M,0,D)):T.length===0?r`<div class="ws-empty">No artifacts</div>`:T.map(M=>Bl({workspaceId:t.id,entry:M,pinned:!1,onOpen:l,onPinToggle:d}))}
          </div>
        </section>

        ${ge?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${F.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${F.length===0?r`
                            <div class="ws-empty">No sessions</div>
                          `:F.map(M=>r`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>c?.(M)}>
                                  <span class=${Dl(M.status)}></span>
                                  <span class="ws-list-title">${M.title}</span>
                                  <span class="ws-list-meta">${z(M.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${V.has(M.key)?"active":""}"
                                  @click=${()=>u?.(t.id,M.key,V.has(M.key))}
                                  title=${V.has(M.key)?"Unpin":"Pin"}
                                >
                                  ${V.has(M.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:h}
      </div>
    </div>
  `}function S0(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:a,onCreateTask:i,onToggleCompletedTasks:o,onStartTask:l,editingTaskId:c,onEditTask:d,onUpdateTask:u}=e,f=vi(t.filter(m=>m.status==="pending")),g=vi(t.filter(m=>m.status==="complete"));return r`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${f.length} open${g.length>0?`, ${g.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${f.length===0&&g.length===0?r`<div class="ws-empty">No tasks</div>`:h}
        ${f.map(m=>Nl(m,a,l,c,d,u))}
        ${g.length>0?r`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${g.length} completed
              </button>
              ${s?g.map(m=>Nl(m,a,l,c,d,u)):h}
            `:h}
      </div>
      ${i?r`
            <form
              class="ws-task-create-form"
              @submit=${m=>{m.preventDefault();const S=m.currentTarget.querySelector("input"),x=S.value.trim();x&&(i(x,n),S.value="")}}
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
  `}function A0(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:a,itemSearchQuery:i,expandedFolders:o,loading:l,createLoading:c,error:d,allTasks:u=[],taskFilter:f="all",taskSort:g="due",showCompletedTasks:m=!1,editingTaskId:w,workspaceNames:S=[],onSearch:x,onItemSearch:C,onSelectWorkspace:p,onBack:$,onItemClick:A,onSessionClick:T,onPinToggle:L,onPinSessionToggle:E,onCreateWorkspace:F,onDeleteWorkspace:V,onToggleFolder:j,onTeamSetup:H,onToggleTaskComplete:se,onCreateTask:ge,onSetTaskFilter:D,onSetTaskSort:M,onToggleCompletedTasks:W,onStartTask:Z,onEditTask:N,onUpdateTask:Me}=e,be=n.filter(B=>w0(a,`${B.name} ${B.path} ${B.type}`));return s?$0({workspace:s,itemSearchQuery:i??"",expandedFolders:o,showCompletedTasks:m,onItemSearch:C,onBack:$,onItemClick:A,onSessionClick:T,onPinToggle:L,onPinSessionToggle:E,onToggleFolder:j,onToggleTaskComplete:se,onCreateTask:ge,onToggleCompletedTasks:W,onStartTask:Z,editingTaskId:w,onEditTask:N,onUpdateTask:Me}):r`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-header-left">
          <h1 class="workspaces-title-text">Workspaces</h1>
          <p class="workspaces-subtitle">Projects, clients, and personal operating context.</p>
        </div>
        <div class="workspaces-header-right">
          <form
            class="workspaces-create-form"
            @submit=${async B=>{if(B.preventDefault(),c||!F)return;const sn=B.currentTarget,X=new FormData(sn),an=X.get("name"),Y=(typeof an=="string"?an:"").trim();if(!Y)return;const Xe=X.get("type"),ut=(typeof Xe=="string"?Xe:"project").trim().toLowerCase(),Je=ut==="team"||ut==="personal"?ut:"project",on=X.get("path"),Pt=(typeof on=="string"?on:"").trim();await F({name:Y,type:Je,...Pt?{path:Pt}:{}})!==!1&&sn.reset()}}
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
            @input=${B=>x?.(B.target.value)}
          />
          <span class="workspaces-count">${be.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
        </div>
      </div>

      ${d?r`<div class="callout danger" style="margin: 16px;">${d}</div>`:h}

      ${H?r`
              <div class="ws-team-setup-bar">
                <span class="ws-team-setup-text">Want your team's AIs to collaborate?</span>
                <button class="btn ws-team-setup-btn" @click=${()=>H()}>
                  Set Up Team Workspace
                </button>
              </div>
            `:h}

      ${l?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${be.length===0?r`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces found":"Connect to gateway to see workspaces"}</span>
                          </div>
                        `:be.map(B=>k0(B,p,V))}
                </div>

                ${x0({tasks:u,taskFilter:f,taskSort:g,onToggleTaskComplete:se,onSetTaskFilter:D,onSetTaskSort:M,onCreateTask:ge,workspaceNames:S,onStartTask:Z,editingTaskId:w,onEditTask:N,onUpdateTask:Me})}
              </div>
            `}
    </div>
  `}function x0(e){const{tasks:t,taskFilter:n,taskSort:s="due",onToggleTaskComplete:a,onSetTaskFilter:i,onSetTaskSort:o,onCreateTask:l,workspaceNames:c=[],onStartTask:d,editingTaskId:u,onEditTask:f,onUpdateTask:g}=e;if(t.length===0&&!l)return r``;let m;n==="outstanding"?m=t.filter(S=>S.status==="pending"):n==="complete"?m=t.filter(S=>S.status==="complete"):m=t;const w=vi(m,s);return r`
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
                class="ws-task-filter-btn ${n==="complete"?"active":""}"
                @click=${()=>i?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${s}
              @change=${S=>o?.(S.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${l?r`
              <form
                class="ws-task-create-form"
                @submit=${S=>{S.preventDefault();const x=S.currentTarget,C=x.querySelector(".ws-task-create-input"),p=x.querySelector(".ws-task-create-project"),$=C.value.trim();if(!$)return;const A=p?.value||c[0]||"";l($,A),C.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${c.length>0?r`
                      <select class="ws-task-create-project">
                        ${c.map(S=>r`<option value=${S}>${S}</option>`)}
                      </select>
                    `:h}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:h}
        <div class="ws-list ws-list--scroll">
          ${w.length===0?r`<div class="ws-empty">No tasks</div>`:w.map(S=>b0(S,a,d,u,f,g))}
        </div>
      </section>
    </div>
  `}const T0={0:"Assessment",1:"Interview",2:"Second Brain",3:"Workflow Audit",4:"Configuration",5:"First Win",6:"Ready"},_0=[{id:"slack",name:"Slack",icon:"#",desc:"Team messaging"},{id:"google-calendar",name:"Google Calendar",icon:"Cal",desc:"Events & scheduling"},{id:"clickup",name:"ClickUp",icon:"CU",desc:"Project management"},{id:"github",name:"GitHub",icon:"GH",desc:"Code & repos"},{id:"obsidian",name:"Obsidian",icon:"Ob",desc:"Notes & knowledge"},{id:"notion",name:"Notion",icon:"N",desc:"Docs & wikis"},{id:"linear",name:"Linear",icon:"Li",desc:"Issue tracking"},{id:"apple-reminders",name:"Apple Reminders",icon:"AR",desc:"Tasks (macOS)"},{id:"email",name:"Email",icon:"@",desc:"Gmail / Outlook"},{id:"things-mac",name:"Things",icon:"Th",desc:"Task manager (macOS)"}];function C0(e){return r`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${[2,3,4,5].map(n=>r`
						<div
							class="onboarding-progress-step ${e>=n?"completed":""} ${e===n?"active":""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${T0[n]}</span>
						</div>
					`)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${(e-2)/4*100}%"></div>
		</div>
	`}function L0(e,t){return r`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${_0.map(n=>{const a=e.find(i=>i.id===n.id)?.status??"pending";return r`
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
	`}function E0(e){return e.length?r`
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
	`:r`${h}`}function M0(e){const t=e>=70?"#38a169":e>=40?"#d69e2e":"#e53e3e",n=e>=70?"Good":e>=40?"Needs Work":"Getting Started";return r`
		<div class="onboarding-health-gauge">
			<div class="health-score" style="color: ${t}">
				<span class="health-number">${e}</span>
				<span class="health-max">/100</span>
			</div>
			<div class="health-label" style="color: ${t}">${n}</div>
		</div>
	`}function R0(e){return r`
		<div class="onboarding-assessment">
			${M0(e.healthScore)}
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
	`}function P0(e,t){return r`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				${t?r`
						<p class="onboarding-subtitle">Here's where your setup stands today:</p>
						${R0(t)}
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
	`}function I0(e){let t="",n="",s="";const a=["rocket","lightning","fire","star","brain","crown","diamond","target","compass","mountain"],i={rocket:"🚀",lightning:"⚡",fire:"🔥",star:"⭐",brain:"🧠",crown:"👑",diamond:"💎",target:"🎯",compass:"🧭",mountain:"⛰️"};function o(l){l.preventDefault();const c=l.target,d=new FormData(c);t=d.get("name")?.trim()??"",n=d.get("mission")?.trim()??"",s=d.get("emoji")?.trim()||"🚀",t&&e({name:t,mission:n,emoji:s})}return r`
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
	`}function D0(e){const{phase:t,tools:n,auditFindings:s,onSkipPhase:a}=e;return r`
		${C0(t)}
		${t===3?L0(n,a):h}
		${t===4&&s.length>0?E0(s):h}
	`}function N0(e,t,n){return e?r`
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
	`:r`${h}`}const O0=/^data:/i,F0=/^https?:\/\//i;function B0(e){const t=e.agentsList?.agents??[],s=ac(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",i=t.find(l=>l.id===s)?.identity,o=i?.avatarUrl??i?.avatar;if(o)return O0.test(o)||F0.test(o)?o:i?.avatarUrl}function Ze(e,t){const n=e.dynamicSlots[t];return n?r`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${lt(n)}</div>
    </div>
  `:h}function Ul(e){return e.trim().toLowerCase().replace(/[^a-z0-9+\s]/g," ").replace(/\s+/g," ")}function ps(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const l=n.length/2,c=n.slice(0,l).join(" "),d=n.slice(l).join(" ");if(c.toLowerCase()===d.toLowerCase())return c}const s=t.replace(/\s+/g," ").toLowerCase(),a=Math.floor(s.length/2),i=s.slice(0,a).trim(),o=s.slice(a).trim();return i&&i===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function yi(e,t){const n=t?.sessionId?.trim();if(n)return`session:${n}`;const s=t?.displayName??it.get(t?.key??e)??it.get(e)??t?.label??"",a=Ul(ps(s));if(a){const i=String(t?.surface??"").trim().toLowerCase(),o=Ul(String(t?.subject??"")).slice(0,20),l=a.split(" ").filter(Boolean).slice(0,3).join(" ");return`name:${i}|${o}|${l||a.slice(0,24)}`}return`key:${e.trim().toLowerCase()}`}function U0(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))],s=Le(t,e.sessionKey),a=yi(e.sessionKey,s),i=new Map;for(const l of n){const c=Le(t,l),d=yi(l,c);if(!i.has(d)){i.set(d,l);continue}l===e.sessionKey&&i.set(d,l)}const o=[...i.values()];return o.length===0&&o.push(e.sessionKey.trim()||"main"),{tabKeys:o,activeIdentity:a}}function z0(e){const t=e.onboardingActive,n=e.onboardingPhase??0,s=e.onboardingData;if(t&&n===0)return P0(()=>{e.handleOnboardingStart?.()},s?.assessment);if(t&&n===1)return I0(p=>{e.handleOnboardingIdentitySubmit?.(p)});if(t&&n===6)return N0(s?.summary??null,s?.identity??null,()=>{e.handleOnboardingComplete?.()});if(e.wizardActive&&e.wizardState)return lu(e.wizardState,{onStepChange:p=>{e.handleWizardStepChange?.(p)},onAnswerChange:(p,$)=>{e.handleWizardAnswerChange?.(p,$)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()}});const a=e.presenceEntries.length,i=e.sessionsResult?.count??null,o=e.cronStatus?.nextWakeAtMs??null,l=e.connected?null:"Disconnected from gateway.",c=e.tab==="chat",d=c&&(e.settings.chatFocusMode||e.onboarding||t&&n>=2),u=e.onboarding?!1:e.settings.chatShowThinking,f=B0(e),g=e.chatAvatarUrl??f??null,m=!!(e.godmodeOptions?.["focusPulse.enabled"]??!0),w=!!e.focusPulseData?.active,S=m&&w&&!!e.focusPulseData?.currentFocus,{tabKeys:x,activeIdentity:C}=U0(e);return r`
    <div class="shell ${c?"shell--chat":""} ${d?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${G.menu}</span>
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
          ${S?r`
              <div class="focus-pulse-widget ${e.focusPulseData.aligned?"":"focus-pulse-widget--misaligned"}">
                <span>\u{1F3AF}</span>
                <span class="focus-pulse-widget__focus">${e.focusPulseData.currentFocus.title}</span>
                <span class="focus-pulse-widget__score">${e.focusPulseData.score}/100</span>
                ${e.focusPulseData.streak>0?r`<span class="focus-pulse-widget__streak">\u{1F525} ${e.focusPulseData.streak}d</span>`:h}
                <button class="focus-pulse-widget__complete-btn" @click=${()=>e.handleFocusPulseComplete()} title="Mark current focus complete">\u2713 Done</button>
              </div>
            `:h}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?r`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${p=>{p.preventDefault(),e.setTab("overview")}}
                >
                  <span class="pill__icon">${G.zap}</span>
                  <span>Update Ready</span>
                </a>`:h}
          <a
            class="pill pill--guide"
            href="/how-to-godmode.html"
            target="_blank"
            title="Learn how to get the most out of GodMode"
          >
            <span class="pill__icon">${G.book}</span>
            <span>How to GodMode</span>
          </a>
          <a
            class="pill pill--help"
            href="https://t.me/GodModeSupportBot"
            target="_blank"
            rel="noreferrer"
            title="Get help from Atlas via Telegram"
          >
            <span class="pill__icon">${G.messageCircle}</span>
            <span>Get Help</span>
          </a>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${Wd(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Rv.map(p=>{const $=e.settings.navGroupsCollapsed[p.label]??!1,A=p.tabs.some(L=>L===e.tab),T=!p.label||p.tabs.length===1&&Ls(p.tabs[0])===p.label;return r`
            <div class="nav-group ${$&&!A?"nav-group--collapsed":""} ${T?"nav-group--no-header":""}">
              ${T?h:r`
                <button
                  class="nav-label"
                  @click=${()=>{const L={...e.settings.navGroupsCollapsed};L[p.label]=!$,e.applySettings({...e.settings,navGroupsCollapsed:L})}}
                  aria-expanded=${!$}
                >
                  <span class="nav-label__text">${p.label}</span>
                  <span class="nav-label__chevron">${$?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${p.tabs.map(L=>zd(e,L))}
                ${!p.label&&e.godmodeOptions?.["deck.enabled"]?r`
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
                      `:h}
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
              <span class="nav-item__icon" aria-hidden="true">${G.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${c?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="mission"&&e.tab!=="workspaces"&&e.tab!=="today"&&e.tab!=="my-day"&&e.tab!=="work"&&e.tab!=="people"&&e.tab!=="life"&&e.tab!=="data"&&e.tab!=="wheel-of-life"&&e.tab!=="vision-board"&&e.tab!=="lifetracks"?r`
              <div class="page-title">${Ls(e.tab)}</div>
              <div class="page-sub">${Dv(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                ${Xs(x,p=>p,(p,$)=>{const A=Le(e.sessionsResult?.sessions,p),T=yi(p,A)===C,E=(()=>{if(A?.displayName)return ps(A.displayName);const D=it.get(p);if(D)return ps(D);if(A?.label)return ps(A.label);if(p.includes("webchat")){const W=p.match(/webchat[:-](\d+)/);return W?`Chat ${W[1]}`:"Chat"}if(p.includes("main"))return"MAIN";const M=p.split(/[:-]/);return M[M.length-1]||p})(),F=x.length>1,V=e.workingSessions.has(p),j=e.settings.tabLastViewed[p]??0,H=A?.updatedAt??0,se=!T&&!V&&H>j,ge=e.editingTabKey===p;return r`
                      <div
                        class="session-tab ${T?"session-tab--active":""} ${V?"session-tab--working":""} ${se?"session-tab--ready":""} ${ge?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${D=>{if(e.editingTabKey===p){D.preventDefault();return}D.dataTransfer.effectAllowed="move",D.dataTransfer.setData("text/session-key",p),D.dataTransfer.setData("text/plain",$.toString()),D.target.classList.add("dragging")}}
                        @click=${()=>{if(!ge){if(T){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}});return}$e(e),e.sessionKey=p,Fe(e,p),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}}),e.loadAssistantIdentity(),ve(e,p,!0),ce(e),ne(e)}}}
                        @dragend=${D=>{D.target.classList.remove("dragging")}}
                        @dragover=${D=>{D.preventDefault(),D.dataTransfer.dropEffect="move";const M=D.currentTarget,W=M.getBoundingClientRect(),Z=W.left+W.width/2;D.clientX<Z?(M.classList.add("drop-left"),M.classList.remove("drop-right")):(M.classList.add("drop-right"),M.classList.remove("drop-left"))}}
                        @dragleave=${D=>{D.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${D=>{D.preventDefault();const M=parseInt(D.dataTransfer.getData("text/plain")),W=$;if(M===W)return;const Z=e.settings.openTabs.slice(),[N]=Z.splice(M,1);Z.splice(W,0,N),e.applySettings({...e.settings,openTabs:Z}),D.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${E}
                      >
                        ${ge?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${A?.displayName??A?.label??""}
                            @click=${D=>D.stopPropagation()}
                            @dblclick=${D=>D.stopPropagation()}
                            @blur=${async D=>{const M=D.target;if(M._committedByEnter)return;const W=M.value.trim();e.editingTabKey=null;const Z=A?.displayName??A?.label??"";if(W!==Z){it.delete(p);const N=await La(e,p,{displayName:W||null});ne(e);const Me=N.ok&&N.canonicalKey!==p?N.canonicalKey:p,be=p===e.sessionKey;e.applySettings({...e.settings,...N.ok&&N.canonicalKey!==p&&e.settings.openTabs.includes(p)?{openTabs:e.settings.openTabs.map(B=>B===p?N.canonicalKey:B)}:{},tabLastViewed:{...e.settings.tabLastViewed,[Me]:Date.now()},...be&&N.ok&&N.canonicalKey!==p?{sessionKey:N.canonicalKey,lastActiveSessionKey:N.canonicalKey}:{}}),be&&N.ok&&N.canonicalKey!==p&&(e.sessionKey=N.canonicalKey,ve(e,N.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}})}}
                            @keydown=${async D=>{if(D.key==="Enter"){D.preventDefault();const M=D.target;M._committedByEnter=!0;const W=M.value.trim();e.editingTabKey=null;const Z=A?.displayName??A?.label??"";if(W!==Z){it.delete(p);const N=await La(e,p,{displayName:W||null});ne(e);const Me=N.ok&&N.canonicalKey!==p?N.canonicalKey:p,be=p===e.sessionKey;e.applySettings({...e.settings,...N.ok&&N.canonicalKey!==p&&e.settings.openTabs.includes(p)?{openTabs:e.settings.openTabs.map(B=>B===p?N.canonicalKey:B)}:{},tabLastViewed:{...e.settings.tabLastViewed,[Me]:Date.now()},...be&&N.ok&&N.canonicalKey!==p?{sessionKey:N.canonicalKey,lastActiveSessionKey:N.canonicalKey}:{}}),be&&N.ok&&N.canonicalKey!==p&&(e.sessionKey=N.canonicalKey,ve(e,N.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}})}else D.key==="Escape"&&(D.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let D=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${M=>{M.stopPropagation(),D&&clearTimeout(D),D=setTimeout(()=>{D=null,e.editingTabKey!==p&&(p===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}}):($e(e),e.sessionKey=p,Fe(e,p),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p,tabLastViewed:{...e.settings.tabLastViewed,[p]:Date.now()}}),e.loadAssistantIdentity(),ve(e,p,!0),ce(e),ne(e)))},250)}}
                            @dblclick=${M=>{M.preventDefault(),M.stopPropagation(),D&&(clearTimeout(D),D=null),e.editingTabKey=p;const W=M.target.closest(".session-tab"),Z=N=>{const Me=N.target;W&&!W.contains(Me)&&(e.editingTabKey=null,document.removeEventListener("mousedown",Z,!0))};document.addEventListener("mousedown",Z,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const N=W?.querySelector(".session-tab__name-input");N&&(N.focus(),N.select())})})}}
                          >${E}</span>
                        `})()}
                        ${e.chatPrivateMode&&p===e.sessionKey?r`
                                <span class="session-tab__lock" title="Private chat" style="font-size: 10px; margin-left: 2px"
                                  >🔒</span
                                >
                              `:h}
                        ${V?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:h}
                        ${se?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:h}
                        ${F?r`
                          <button
                            class="session-tab__close"
                            @click=${D=>{D.stopPropagation();const M=e.settings.openTabs.filter(Z=>Z!==p),W=p===e.sessionKey;e.applySettings({...e.settings,openTabs:M,...W?{sessionKey:M[0],lastActiveSessionKey:M[0]}:{}}),W&&(e.sessionKey=M[0],ve(e,M[0],!0),ce(e))}}
                            title="Close tab"
                          >×</button>
                        `:h}
                      </div>
                    `})}
              `:h}
          </div>
          <div class="page-meta">
            ${e.reconnecting?r`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?r`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:h}
            ${c?Kd(e):h}
          </div>
        </section>

        ${d?r`<button
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

        ${e.tab==="overview"?kk({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:a,sessionsCount:i,cronEnabled:e.cronStatus?.enabled??null,cronNext:o,lastChannelsRefresh:e.channelsLastSuccess,updateStatus:e.updateStatus,updateLoading:e.updateLoading,updateError:e.updateError,updateLastChecked:e.updateLastChecked,updateRunning:e.updateRunning,onSettingsChange:p=>e.applySettings(p),onPasswordChange:p=>e.password=p,onSessionKeyChange:p=>{$e(e),e.sessionKey=p,Fe(e,p),e.resetToolStream(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview(),onCheckUpdates:()=>um(e),onUpdateNow:()=>{er(e)}}):h}

        ${e.tab==="mission"?Iw({connected:e.connected,loading:e.missionLoading,error:e.missionError,agents:e.missionAgents,activeRuns:e.missionActiveRuns,subagentRuns:e.missionSubagentRuns,tasks:e.missionTasks,feedItems:e.missionFeedItems}):h}

        ${e.tab==="workspaces"?A0({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",expandedFolders:e.workspaceExpandedFolders??new Set,loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:p=>e.workspacesSearchQuery=p,onItemSearch:p=>e.workspaceItemSearchQuery=p,onCreateWorkspace:async p=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:$,selectWorkspace:A}=await q(async()=>{const{createWorkspace:L,selectWorkspace:E}=await Promise.resolve().then(()=>ye);return{createWorkspace:L,selectWorkspace:E}},void 0,import.meta.url),T=await $(e,p);return T?(e.workspaceItemSearchQuery="",await A(e,T),e.showToast(`Created workspace: ${T.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onDeleteWorkspace:async p=>{const{deleteWorkspace:$,loadAllTasks:A}=await q(async()=>{const{deleteWorkspace:L,loadAllTasks:E}=await Promise.resolve().then(()=>ye);return{deleteWorkspace:L,loadAllTasks:E}},void 0,import.meta.url);if(!await $(e,p.id)){e.showToast(`Failed to delete ${p.name}`,"error");return}e.showToast(`Deleted workspace: ${p.name}`,"success"),e.allTasks=await A(e)},onSelectWorkspace:async p=>{e.workspaceItemSearchQuery="";const{selectWorkspace:$}=await q(async()=>{const{selectWorkspace:A}=await Promise.resolve().then(()=>ye);return{selectWorkspace:A}},void 0,import.meta.url);await $(e,p)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async p=>{const{readWorkspaceFile:$}=await q(async()=>{const{readWorkspaceFile:L}=await Promise.resolve().then(()=>ye);return{readWorkspaceFile:L}},void 0,import.meta.url),A=e.selectedWorkspace?.id,T=await $(e,p.path,A);if(!T){e.showToast(`Failed to open ${p.name}`,"error");return}e.handleOpenSidebar(T.content,{mimeType:T.mime,filePath:p.path,title:p.name})},onSessionClick:async p=>{if(!p.key)return;const $=p.key;$e(e),e.sessionKey=$,Fe(e,$),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const A=e.settings.openTabs.includes($)?e.settings.openTabs:[...e.settings.openTabs,$];e.applySettings({...e.settings,openTabs:A,sessionKey:$,lastActiveSessionKey:$,tabLastViewed:{...e.settings.tabLastViewed,[$]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),ve(e,$,!0),ce(e)},onPinToggle:async(p,$,A)=>{const{toggleWorkspacePin:T}=await q(async()=>{const{toggleWorkspacePin:E}=await Promise.resolve().then(()=>ye);return{toggleWorkspacePin:E}},void 0,import.meta.url);await T(e,p,$,A)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(p,$,A)=>{const{toggleWorkspaceSessionPin:T}=await q(async()=>{const{toggleWorkspaceSessionPin:E}=await Promise.resolve().then(()=>ye);return{toggleWorkspaceSessionPin:E}},void 0,import.meta.url);await T(e,p,$,A)||e.showToast("Failed to update session pin","error")},onToggleFolder:p=>{q(async()=>{const{toggleWorkspaceFolder:$}=await Promise.resolve().then(()=>ye);return{toggleWorkspaceFolder:$}},void 0,import.meta.url).then(({toggleWorkspaceFolder:$})=>{e.workspaceExpandedFolders=$(e.workspaceExpandedFolders??new Set,p),e.requestUpdate()})},onTeamSetup:()=>{q(async()=>{const{startTeamSetup:p}=await Promise.resolve().then(()=>ye);return{startTeamSetup:p}},void 0,import.meta.url).then(({startTeamSetup:p})=>{p(e)})},allTasks:e.allTasks??[],taskFilter:e.taskFilter??"all",taskSort:e.taskSort??"due",showCompletedTasks:e.showCompletedTasks??!1,onToggleTaskComplete:async(p,$)=>{const{toggleTaskComplete:A,loadAllTasks:T,getWorkspace:L}=await q(async()=>{const{toggleTaskComplete:F,loadAllTasks:V,getWorkspace:j}=await Promise.resolve().then(()=>ye);return{toggleTaskComplete:F,loadAllTasks:V,getWorkspace:j}},void 0,import.meta.url);if(!await A(e,p,$)){e.showToast("Failed to update task","error");return}if(e.allTasks=await T(e),e.selectedWorkspace){const F=await L(e,e.selectedWorkspace.id);F&&(e.selectedWorkspace=F)}},onCreateTask:async(p,$)=>{const{createTask:A,loadAllTasks:T,getWorkspace:L}=await q(async()=>{const{createTask:F,loadAllTasks:V,getWorkspace:j}=await Promise.resolve().then(()=>ye);return{createTask:F,loadAllTasks:V,getWorkspace:j}},void 0,import.meta.url),E=await A(e,p,$);if(!E){e.showToast("Failed to create task","error");return}if(e.showToast(`Task created: ${E.title}`,"success"),e.allTasks=await T(e),e.selectedWorkspace){const F=await L(e,e.selectedWorkspace.id);F&&(e.selectedWorkspace=F)}},onSetTaskFilter:p=>{e.taskFilter=p},onSetTaskSort:p=>{e.taskSort=p},onToggleCompletedTasks:()=>{e.showCompletedTasks=!(e.showCompletedTasks??!1)},editingTaskId:e.editingTaskId??null,workspaceNames:(e.workspaces??[]).map(p=>p.name),onStartTask:async p=>{const{startTask:$,loadAllTasks:A}=await q(async()=>{const{startTask:F,loadAllTasks:V}=await Promise.resolve().then(()=>ye);return{startTask:F,loadAllTasks:V}},void 0,import.meta.url),T=await $(e,p);if(!T?.sessionId){e.showToast("Failed to open session for task","error");return}$e(e);const L=T.sessionId,E=e.settings.openTabs.includes(L)?e.settings.openTabs:[...e.settings.openTabs,L];if(e.applySettings({...e.settings,openTabs:E,sessionKey:L,lastActiveSessionKey:L,tabLastViewed:{...e.settings.tabLastViewed,[L]:Date.now()}}),e.sessionKey=L,e.setTab("chat"),T.created){const F=e.allTasks??[],V=e.selectedWorkspace?.tasks??[],j=[...F,...V].find(se=>se.id===p),H=j?.project?` (project: ${j.project})`:"";e.chatMessage=`Let's work on: ${j?.title??"this task"}${H}`}else e.chatMessage="";e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ve(e,L,!0),ce(e),e.allTasks=await A(e),e.requestUpdate()},onEditTask:p=>{e.editingTaskId=p},onUpdateTask:async(p,$)=>{const{updateTask:A,loadAllTasks:T,getWorkspace:L}=await q(async()=>{const{updateTask:F,loadAllTasks:V,getWorkspace:j}=await Promise.resolve().then(()=>ye);return{updateTask:F,loadAllTasks:V,getWorkspace:j}},void 0,import.meta.url);if(!await A(e,p,$)){e.showToast("Failed to update task","error");return}if(e.editingTaskId=null,e.allTasks=await T(e),e.selectedWorkspace){const F=await L(e,e.selectedWorkspace.id);F&&(e.selectedWorkspace=F)}}}):h}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?Ze(e,"today"):Yw({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:p=>e.handleBriefSave(p),onBriefToggleCheckbox:(p,$)=>e.handleBriefToggleCheckbox(p,$),onOpenFile:p=>{e.handleOpenFile(p)},selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"my-day",onViewModeChange:p=>e.handleTodayViewModeChange(p),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh(),focusPulseActive:w,onStartMorningSet:m?()=>e.handleFocusPulseStartMorning():void 0,todayTasks:e.todayTasks??[],todayTasksLoading:e.todayTasksLoading??!1,onToggleTaskComplete:(p,$)=>e.handleMyDayTaskStatusChange(p,$==="complete"?"pending":"complete"),onStartTask:p=>e.handleTodayStartTask(p)}):h}

        ${e.tab==="work"?e.dynamicSlots.work?Ze(e,"work"):y0({connected:e.connected,projects:e.workProjects??[],loading:e.workLoading??!1,error:e.workError??null,expandedProjects:e.workExpandedProjects,projectFiles:e.workProjectFiles??{},detailLoading:e.workDetailLoading??new Set,onRefresh:()=>e.handleWorkRefresh(),onToggleProject:p=>e.handleWorkToggleProject(p),onPersonClick:p=>e.handleWorkPersonClick(p),onFileClick:p=>e.handleWorkFileClick(p),onSkillClick:(p,$)=>e.handleWorkSkillClick(p,$)}):h}

        ${e.tab==="people"?e.dynamicSlots.people?Ze(e,"people"):xk({connected:e.connected,people:e.peopleList??[],loading:e.peopleLoading??!1,error:e.peopleError??null,selectedId:e.peopleSelected??null,searchQuery:e.peopleSearchQuery??"",onRefresh:()=>e.handlePeopleRefresh(),onSelectPerson:p=>e.handlePeopleSelect(p),onBack:()=>e.handlePeopleBack(),onSearchChange:p=>e.handlePeopleSearch(p),onImportContacts:p=>e.handlePeopleImport(p)}):h}

        ${e.tab==="life"?e.dynamicSlots.life?Ze(e,"life"):r`
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
                    ${["vision-board","goals","wheel-of-life"].map(p=>{const $={"vision-board":"Vision Board",goals:"Goals","wheel-of-life":"Wheel of Life"},A=(e.lifeSubtab??"vision-board")===p;return r`
                        <button
                          class="life-subnav__item ${A?"active":""}"
                          @click=${()=>e.handleLifeSubtabChange(p)}
                        >${$[p]}</button>
                      `})}
                  </div>
                  <div class="life-subtab-content">
                    ${(e.lifeSubtab??"vision-board")==="vision-board"?Cl({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's update my Vision Board — review my Chief Definite Aim, annual themes, values, and identity statements.")}):h}
                    ${(e.lifeSubtab??"vision-board")==="lifetracks"?bl({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:p=>e.handleLifetracksSelectTrack(p),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Time to update my LifeTracks — let's review my meditation and affirmation audio settings.")}):h}
                    ${e.lifeSubtab==="goals"?bw({connected:e.connected,goals:e.goals??[],loading:e.goalsLoading??!1,error:e.goalsError??null,onRefresh:()=>e.handleGoalsRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's review and update my goals")}):h}
                    ${e.lifeSubtab==="wheel-of-life"?Ll({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:p=>e.handleWheelOfLifeSave(p),onCancel:()=>e.handleWheelOfLifeCancel(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's do a Wheel of Life check-in — rate my current satisfaction across all 8 life areas.")}):h}
                  </div>
                </div>
              `:h}

        ${e.tab==="data"?e.dynamicSlots.data?Ze(e,"data"):rw({connected:e.connected,sources:e.dataSources??[],loading:e.dataLoading??!1,error:e.dataError??null,subtab:e.dataSubtab??"dashboard",onRefresh:()=>e.handleDataRefresh(),onSubtabChange:p=>e.handleDataSubtabChange(p),onConnectSource:p=>e.handleDataConnectSource(p),onQuerySubmit:p=>e.handleDataQuerySubmit(p)}):h}

        ${e.tab==="wheel-of-life"?e.dynamicSlots["wheel-of-life"]?Ze(e,"wheel-of-life"):Ll({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:p=>e.handleWheelOfLifeSave(p),onCancel:()=>e.handleWheelOfLifeCancel()}):h}

        ${e.tab==="vision-board"?e.dynamicSlots["vision-board"]?Ze(e,"vision-board"):Cl({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh()}):h}

        ${e.tab==="lifetracks"?e.dynamicSlots.lifetracks?Ze(e,"lifetracks"):bl({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:p=>e.handleLifetracksSelectTrack(p),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate()}):h}

        ${e.tab==="channels"?jy({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:p=>Ee(e,p),onWhatsAppStart:p=>e.handleWhatsAppStart(p),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(p,$)=>Xn(e,p,$),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(p,$)=>e.handleNostrProfileEdit(p,$),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(p,$)=>e.handleNostrProfileFieldChange(p,$),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):h}

        ${e.tab==="instances"?ww({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>ro(e)}):h}

        ${e.tab==="sessions"?Fk({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:p=>{e.sessionsFilterActive=p.activeMinutes,e.sessionsFilterLimit=p.limit,e.sessionsIncludeGlobal=p.includeGlobal,e.sessionsIncludeUnknown=p.includeUnknown},onRefresh:()=>{ne(e),Qt(e)},onPatch:async(p,$)=>{const A=await La(e,p,$);if(A.ok&&A.canonicalKey!==p&&e.settings.openTabs.includes(p)){const T=e.settings.openTabs.map(E=>E===p?A.canonicalKey:E),L=p===e.sessionKey;e.applySettings({...e.settings,openTabs:T,tabLastViewed:{...e.settings.tabLastViewed,[A.canonicalKey]:e.settings.tabLastViewed[p]??Date.now()},...L?{sessionKey:A.canonicalKey,lastActiveSessionKey:A.canonicalKey}:{}}),L&&(e.sessionKey=A.canonicalKey,ve(e,A.canonicalKey,!0))}},onDelete:p=>om(e,p),onArchive:p=>rm(e,p),onUnarchive:p=>lm(e,p),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Qt(e)},onAutoArchive:()=>cm(e)}):h}

        ${e.tab==="cron"?Qb({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(p=>p.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:p=>e.cronForm={...e.cronForm,...p},onRefresh:()=>e.loadCron(),onAdd:()=>Um(e),onToggle:(p,$)=>zm(e,p,$),onRun:p=>Km(e,p),onRemove:p=>Wm(e,p),onLoadRuns:p=>dd(e,p)}):h}

        ${e.tab==="skills"?Kk({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:p=>e.skillsFilter=p,onRefresh:()=>Fn(e,{clearMessages:!0}),onToggle:(p,$)=>lv(e,p,$),onEdit:(p,$)=>rv(e,p,$),onSaveKey:p=>cv(e,p),onInstall:(p,$,A)=>dv(e,p,$,A)}):h}

        ${e.tab==="nodes"?Qw({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>zs(e),onDevicesRefresh:()=>dt(e),onDeviceApprove:p=>jg(e,p),onDeviceReject:p=>Hg(e,p),onDeviceRotate:(p,$,A)=>Vg(e,{deviceId:p,role:$,scopes:A}),onDeviceRevoke:(p,$)=>qg(e,{deviceId:p,role:$}),onLoadConfig:()=>Ve(e),onLoadExecApprovals:()=>{const p=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return oo(e,p)},onBindDefault:p=>{p?Xn(e,["tools","exec","node"],p):tr(e,["tools","exec","node"])},onBindAgent:(p,$)=>{const A=["agents","list",p,"tools","exec","node"];$?Xn(e,A,$):tr(e,A)},onSaveBindings:()=>ja(e),onExecApprovalsTargetChange:(p,$)=>{e.execApprovalsTarget=p,e.execApprovalsTargetNodeId=$,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:p=>{e.execApprovalsSelectedAgent=p},onExecApprovalsPatch:(p,$)=>Qm(e,p,$),onExecApprovalsRemove:p=>Xm(e,p),onSaveExecApprovals:()=>{const p=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Ym(e,p)}}):h}

        ${t&&n>=2&&n<=5&&e.tab==="chat"?D0({phase:n,identity:s?.identity??null,tools:s?.tools??[],auditFindings:s?.audit?.findings??[],summary:s?.summary??null,onSkipPhase:()=>e.handleOnboardingSkipPhase?.()}):e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length&&!t?r`
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

        ${e.tab==="chat"&&e.settings.chatParallelView?u0({state:e,onAssignLane:(p,$)=>{const A=$?Le(e.sessionsResult?.sessions,$)?.key??$:null,T=[...e.settings.parallelLanes];T[p]=A,e.applySettings({...e.settings,parallelLanes:T}),A&&e.client&&Ki(e.client,A).then(()=>{e.applySettings({...e.settings})})},onReorderLanes:(p,$)=>{if(p===$||p<0||$<0||p>=e.settings.parallelLanes.length||$>=e.settings.parallelLanes.length)return;const A=[...e.settings.parallelLanes],[T]=A.splice(p,1);A.splice($,0,T),e.applySettings({...e.settings,parallelLanes:A})},onLaneViewed:p=>{const $=Le(e.sessionsResult?.sessions,p)?.key??p,A=Date.now(),L=Le(e.sessionsResult?.sessions,$)?.updatedAt??0,E=Math.max(e.settings.tabLastViewed[p]??0,e.settings.tabLastViewed[$]??0);L>0&&E>=L||e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[p]:A,[$]:A}})},onSendInLane:(p,$)=>{p!==e.sessionKey?($e(e),e.sessionKey=p,Fe(e,p),e.chatLoading=!0,e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity(),ve(e,p,!0),ce(e).then(()=>{e.chatMessage=$,e.handleSendChat($)})):(e.chatMessage=$,e.handleSendChat($))}}):h}

        ${e.tab==="chat"&&!e.settings.chatParallelView?Eb({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:p=>{$e(e),e.sessionKey=p,Fe(e,p),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity(),ce(e),Ms(e)},thinkingLevel:e.chatThinkingLevel,showThinking:u,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:g,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:l,error:e.lastError,sessions:e.sessionsResult,focusMode:d,onRefresh:()=>(e.resetToolStream(),Promise.all([ce(e),Ms(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:p=>e.handleChatScroll(p),onDraftChange:p=>e.chatMessage=p,attachments:e.chatAttachments,onAttachmentsChange:p=>e.chatAttachments=p,showToast:(p,$)=>e.showToast(p,$),onSend:p=>e.handleSendChat(void 0,{queue:p}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:p=>e.removeQueuedMessage(p),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,splitRatio:e.splitRatio,onOpenSidebar:(p,$)=>e.handleOpenSidebar(p,$),onMessageLinkClick:p=>e.handleOpenMessageFileLink(p),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:p=>e.handleSplitRatioChange(p),onImageClick:(p,$,A)=>e.handleImageClick(p,$,A),resolveImageUrl:(p,$)=>vm(e.sessionKey,p,$),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const p=document.querySelector(".chat-thread");p&&(p.scrollTo({top:p.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)}}):h}

        ${e.tab==="options"?g$({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(p,$)=>e.handleOptionToggle(p,$),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):h}

        ${e.tab==="guardrails"?i0({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,onToggle:(p,$)=>e.handleGuardrailToggle(p,$),onThresholdChange:(p,$,A)=>e.handleGuardrailThresholdChange(p,$,A)}):h}

        ${e.tab==="trust"?J$({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:p=>e.handleTrustAddWorkflow(p),onRemoveWorkflow:p=>e.handleTrustRemoveWorkflow(p),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:i,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(p,$)=>e.handleDailyRate(p,$),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):h}

        ${e.tab==="config"?Ub({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:p=>{e.configRaw=p},onFormModeChange:p=>e.configFormMode=p,onFormPatch:(p,$)=>Xn(e,p,$),onSearchChange:p=>e.configSearchQuery=p,onSectionChange:p=>{e.configActiveSection=p,e.configActiveSubsection=null},onSubsectionChange:p=>e.configActiveSubsection=p,onReload:()=>Ve(e),onSave:()=>ja(e),onApply:()=>op(e),onUpdate:()=>er(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(p,$)=>e.handleUpdateUserProfile(p,$)}):h}

        ${e.tab==="debug"?lw({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:p=>e.debugCallMethod=p,onCallParamsChange:p=>e.debugCallParams=p,onRefresh:()=>Ks(e),onCall:()=>Rm(e)}):h}

        ${e.tab==="logs"?Pw({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:p=>e.logsFilterText=p,onLevelToggle:(p,$)=>{e.logsLevelFilters={...e.logsLevelFilters,[p]:$}},onToggleAutoFollow:p=>e.logsAutoFollow=p,onRefresh:()=>Zi(e,{reset:!0}),onExport:(p,$)=>e.exportLogs(p,$),onScroll:p=>e.handleLogsScroll(p)}):h}
      </main>
      ${dw(e)}
      ${uw(e)}
      ${h}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Qd({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})}})}
              </div>
            </div>
          `:h}
      ${Jk({toasts:e.toasts,onDismiss:p=>e.dismissToast(p)})}
      ${Qk(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:p=>e.handleLightboxNav(p)})}
    </div>
  `}async function Kn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.getState",{});e.focusPulseData=t}catch{e.focusPulseData=null}}async function K0(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("focusPulse.setFocus",{index:t});e.showToast(n.message,"success",3e3),await Kn(e)}catch(n){e.showToast("Failed to set focus","error"),console.error("[FocusPulse] setFocus error:",n)}}async function W0(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.complete",{});e.showToast(t.message,"success",4e3),await Kn(e)}catch(t){e.showToast("Failed to complete focus","error"),console.error("[FocusPulse] completeFocus error:",t)}}async function j0(e){if(!(!e.client||!e.connected))try{await e.client.request("focusPulse.pulseCheck",{}),await Kn(e)}catch(t){console.error("[FocusPulse] pulseCheck error:",t)}}async function H0(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("focusPulse.endDay",{});e.showToast(t.message,"info",5e3),await Kn(e)}catch(t){e.showToast("Failed to end day","error"),console.error("[FocusPulse] endDay error:",t)}}async function So(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function yu(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await So(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function V0(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await yu(e,[...n,t.trim()])}async function q0(e,t){const n=e.trustTrackerData?.workflows??[];await yu(e,n.filter(s=>s!==t))}async function G0(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await So(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const Y0=6e4,zl=15,Kl=new Set;let hs=null;async function Wl(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+zl*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const a of s.events??[]){if(Kl.has(a.id))continue;const i=new Date(a.startTime),o=Math.round((i.getTime()-t.getTime())/6e4);if(o>0&&o<=zl){Kl.add(a.id);const l=i.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),c=a.location?` @ ${a.location}`:"",d=`${a.title} starts in ${o} min (${l})${c}`;e.showToast(d,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function Q0(e){bu(),Wl(e),hs=setInterval(()=>{Wl(e)},Y0)}function bu(){hs&&(clearInterval(hs),hs=null)}let X0=0;function J0(e,t="info",n=3e3){return{id:`toast-${Date.now()}-${X0++}`,message:e,type:t,duration:n,createdAt:Date.now()}}function Z0(e,t){return e.filter(n=>n.id!==t)}function e1(e,t){return[...e,t]}var t1=Object.defineProperty,n1=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var a=s>1?void 0:s?n1(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&t1(t,n,a),a};function Wa(){return cg()}function is(){return ug()}function s1(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}const jl=new Set(["chat","today","workspaces","work","people","life","data","overview","mission","channels","instances","sessions","cron","skills","nodes","config","debug","logs","wheel-of-life","vision-board","lifetracks","my-day"]),a1=["path","filePath","file","workspacePath"];let v=class extends Ht{constructor(){super(...arguments),this.settings=Nv(),this.password="",this.tab="chat",this.onboarding=s1(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=Wa().name,this.assistantAvatar=Wa().avatar,this.assistantAgentId=Wa().agentId??null,this.userName=is().name,this.userAvatar=is().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.splitRatio=this.settings.splitRatio,this.lightbox=su(),this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Zv},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.missionLoading=!1,this.missionError=null,this.missionAgents=[],this.missionActiveRuns=[],this.missionSubagentRuns=[],this.missionTasks=[],this.missionFeedItems=[],this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=de(),this.todayViewMode="my-day",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.chatPrivateMode=!1,this.lifeSubtab="vision-board",this.goalsLoading=!1,this.goalsError=null,this.dataLoading=!1,this.dataError=null,this.dataSubtab="dashboard",this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.peopleLoading=!1,this.peopleError=null,this.peopleSelected=null,this.peopleSearchQuery="",this.wheelOfLifeLoading=!1,this.wheelOfLifeError=null,this.wheelOfLifeEditMode=!1,this.visionBoardLoading=!1,this.visionBoardError=null,this.lifetracksLoading=!1,this.lifetracksError=null,this.lifetracksGenerating=!1,this.lifetracksGenerationError=null,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Jv},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.agentLogPollInterval=null,this.agentLogUnsub=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Id(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const e=is();this.userName=e.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const e=is();this.userAvatar=e.avatar}hy(this),this.agentLogPollInterval==null&&(this.agentLogPollInterval=window.setInterval(()=>{!this.connected||!(this.tab==="today"||this.tab==="my-day")||this.todayViewMode!=="agent-log"||kt(this)},6e4)),!this.agentLogUnsub&&this.client&&(this.agentLogUnsub=vd(this.client,()=>{this.todayViewMode==="agent-log"&&kt(this)})),Q0(this)}firstUpdated(){fy(this)}disconnectedCallback(){bu(),this.agentLogPollInterval!=null&&(clearInterval(this.agentLogPollInterval),this.agentLogPollInterval=null),this.agentLogUnsub&&(this.agentLogUnsub(),this.agentLogUnsub=null),gy(this),super.disconnectedCallback()}updated(e){vy(this,e)}connect(){Ji(this)}handleChatScroll(e){Sp(this,e)}handleLogsScroll(e){Ap(this,e)}exportLogs(e,t){xp(e,t)}resetToolStream(){Ti(this)}resetChatScroll(){oc(this)}async loadAssistantIdentity(){await Ic(this)}applySettings(e){qe(this,e)}setTab(e){_d(this,e)}setTheme(e,t){Cd(this,e,t)}async loadOverview(){await go(this)}async loadCron(){await Qs(this)}async handleAbortChat(){await mo(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await Kn(this)}async handleFocusPulseStartMorning(){this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, then help me review priorities and pick my #1 focus to lock in.";this.chatMessage=e,this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await K0(this,e)}async handleFocusPulseComplete(){await W0(this)}async handleFocusPulsePulseCheck(){await j0(this)}async handleFocusPulseEndDay(){await H0(this)}async handleTrustLoad(){await So(this)}async handleTrustAddWorkflow(e){await V0(this,e)}async handleTrustRemoveWorkflow(e){await q0(this,e)}async handleDailyRate(e,t){await G0(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await q(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>Ra);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await q(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>Ra);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await q(async()=>{const{updateGuardrailThreshold:a}=await Promise.resolve().then(()=>Ra);return{updateGuardrailThreshold:a}},void 0,import.meta.url);await s(this,e,t,n)}async handleOptionsLoad(){const{loadOptions:e}=await q(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await q(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}removeQueuedMessage(e){Fd(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,a=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;(a>0?s/a:0)>=.9&&!this.compactionStatus?.active&&(this.showToast("Context near limit — auto-compacting...","info",3e3),await this.handleCompactChat())}await Bd(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await dp(this,e)}async handleWhatsAppWait(){await up(this)}async handleWhatsAppLogout(){await pp(this)}async handleChannelConfigSave(){await hp(this)}async handleChannelConfigReload(){await fp(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await Nc(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){mp(this,e,t)}handleNostrProfileCancel(){vp(this)}handleNostrProfileFieldChange(e,t){yp(this,e,t)}async handleNostrProfileSave(){await wp(this)}async handleNostrProfileImport(){await kp(this)}handleNostrProfileToggleAdvanced(){bp(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,qe(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("files.read",{path:e}),n=e.split(".").pop()?.toLowerCase()??"",s=t.contentType??t.mime??(n==="md"?"text/markdown":null),a=e.split("/").pop()??e;this.handleOpenSidebar(t.content,{mimeType:s,filePath:e,title:a}),t.truncated&&this.showToast(`Opened truncated file: ${e}`,"warning")}catch(t){console.error("[Chat] Failed to open file:",t),this.showToast(`Failed to open file: ${e}`,"error")}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=jk(e,t,n)}handleLightboxClose(){this.lightbox=Hk()}handleLightboxNav(e){this.lightbox=Vk(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const a=s.trim();!a||t.has(a)||(t.add(a),e.push(a))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const a of s.workspaces??[])n(a.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];const a=/^[a-z][a-z0-9+.-]*:/i.test(t),i=/^[a-z]:[\\/]/i.test(t);(!a||i)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const w of a1){const S=o.searchParams.get(w);S&&n.push(S)}const u=(t.split("#")[0]??"").split("?")[0]??"";u.length>0&&!u.startsWith("/")&&!u.includes("://")&&n.push(u);let g=o.pathname;this.basePath&&g.startsWith(`${this.basePath}/`)?g=g.slice(this.basePath.length):this.basePath&&g===this.basePath&&(g="");const m=g.startsWith("/")?g.slice(1):g;if(m){n.push(m);const w=m.indexOf("/");if(w>0){const S=m.slice(0,w).toLowerCase();jl.has(S)&&n.push(m.slice(w+1))}}if(g.startsWith("/")&&m){const w=m.split("/")[0]?.toLowerCase()??"";jl.has(w)||n.push(g)}}const l=[],c=new Set;for(const d of n){let u=d;try{u=decodeURIComponent(d)}catch{}const f=this.normalizeWorkspacePathCandidate(u,{allowAbsolute:!0});!f||c.has(f)||(c.add(f),l.push(f))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=3e3){const s=J0(e,t,n);this.toasts=e1(this.toasts,s),n>0&&window.setTimeout(()=>{this.dismissToast(s.id)},n)}dismissToast(e){this.toasts=Z0(this.toasts,e)}async handleMissionRefresh(){await Xg(this)}async handleMissionTaskComplete(e){await Jg(this,e)}handleMissionTaskClick(e){this.openSessionForTask(e)}async openSessionForTask(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("tasks.openSession",{taskId:e.id});if(!t.sessionId){this.showToast("Failed to open session for task","error");return}const{saveDraft:n}=await q(async()=>{const{saveDraft:o}=await Promise.resolve().then(()=>Xv);return{saveDraft:o}},void 0,import.meta.url),{syncUrlWithSessionKey:s}=await q(async()=>{const{syncUrlWithSessionKey:o}=await Promise.resolve().then(()=>Vv);return{syncUrlWithSessionKey:o}},void 0,import.meta.url),{loadChatHistory:a}=await q(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>mg);return{loadChatHistory:o}},void 0,import.meta.url);n(this);const i=this.settings.openTabs.includes(t.sessionId)?this.settings.openTabs:[...this.settings.openTabs,t.sessionId];if(this.applySettings({...this.settings,openTabs:i,sessionKey:t.sessionId,lastActiveSessionKey:t.sessionId,tabLastViewed:{...this.settings.tabLastViewed,[t.sessionId]:Date.now()}}),this.sessionKey=t.sessionId,this.setTab("chat"),t.created){const o=e.project?` (project: ${e.project})`:"";this.chatMessage=`Let's work on: ${e.title}${o}`}else this.chatMessage="";this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),s(this,t.sessionId,!0),a(this),this.requestUpdate()}catch(t){console.error("[Mission] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleMissionOpenDeck(){window.open("/deck/","_blank","noopener,noreferrer")}async handleMyDayRefresh(){if(this.todayViewMode==="agent-log"){await kt(this,{refresh:!0});return}await _s(this)}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,updates:{status:t,completedAt:t==="complete"?new Date().toISOString():null}});const{loadTodayTasks:n}=await q(async()=>{const{loadTodayTasks:s}=await Promise.resolve().then(()=>ov);return{loadTodayTasks:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionKey){this.setTab("chat"),this.sessionKey=t.sessionKey;const n=this.settings.openTabs.includes(t.sessionKey)?this.settings.openTabs:[...this.settings.openTabs,t.sessionKey];this.applySettings({...this.settings,sessionKey:t.sessionKey,lastActiveSessionKey:t.sessionKey,openTabs:n}),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");if(e.setDate(e.getDate()-1),this.todaySelectedDate=de(e),this.todayViewMode==="agent-log"){kt(this);return}ds(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=de(),n=de(e);if(!(n>t)){if(this.todaySelectedDate=n,this.todayViewMode==="agent-log"){kt(this);return}ds(this)}}handleDateToday(){this.todaySelectedDate=de(),_s(this)}async handleDailyBriefRefresh(){await ds(this)}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;md(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e,e==="agent-log"&&!this.agentLog&&kt(this)}handlePrivateModeToggle(){if(this.chatPrivateMode){this.chatPrivateMode=!1,this.showToast("Private mode OFF","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),q(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>Da);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this),this.chatMessages=[{role:"assistant",content:"This is a **private chat**. Nothing from this conversation will be saved to memory. The session will be deleted when you close it or after 24 hours.",timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private mode ON — new private chat created","info",3e3)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await bd(this)}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||hv(this,e)),this.workExpandedProjects=t}handleWorkPersonClick(e){this.peopleSelected=e,this.setTab("people")}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}async handlePeopleRefresh(){await yd(this)}handlePeopleSelect(e){this.peopleSelected=e}handlePeopleBack(){this.peopleSelected=null}handlePeopleSearch(e){this.peopleSearchQuery=e}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await qs(this)}async handleWheelOfLifeRefresh(){await Cs(this)}handleWheelOfLifeEdit(){pv(this)}handleWheelOfLifeCancel(){Gr(this)}async handleWheelOfLifeSave(e){await uv(this,e),Gr(this)}async handleVisionBoardRefresh(){await hi(this)}async handleLifetracksRefresh(){await Ts(this)}handleLifetracksSelectTrack(e){Jm(this,e)}async handleLifetracksEnable(){await Zm(this)}async handleLifetracksGenerate(){await ev(this)}handleLifeSubtabChange(e){this.lifeSubtab=e,e==="goals"&&!this.goals&&!this.goalsLoading&&this.handleGoalsRefresh()}async handleGoalsRefresh(){if(!(!this.client||!this.connected)){this.goalsLoading=!0,this.goalsError=null;try{const e=await this.client.request("goals.get",{});this.goals=e.goals??[]}catch(e){this.goalsError=e instanceof Error?e.message:"Failed to load goals",console.error("[Goals] Load error:",e)}finally{this.goalsLoading=!1}}}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),q(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Da);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),q(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Da);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleWizardOpen(){q(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>M$);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const e=await this.client.request("onboarding.wizard.preview",this.wizardState.answers);this.wizardState={...this.wizardState,preview:e.files??[]},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}async handleWizardGenerate(){if(!(!this.client||!this.wizardState)){this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();try{const e=await this.client.request("onboarding.wizard.generate",this.wizardState.answers);this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:e.filesCreated,filesSkipped:e.filesSkipped,configPatched:e.configPatched,workspacePath:e.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(e){const t=e instanceof Error?e.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:t},this.requestUpdate(),this.showToast(t,"error")}}}async handleDataRefresh(){if(!(!this.client||!this.connected)){this.dataLoading=!0,this.dataError=null;try{const e=await this.client.request("dataSources.list",{});this.dataSources=e.sources??[]}catch(e){this.dataError=e instanceof Error?e.message:"Failed to load data sources",console.error("[Data] Load error:",e)}finally{this.dataLoading=!1}}}handleDataSubtabChange(e){this.dataSubtab=e}handleDataConnectSource(e){const n=this.dataSources?.find(s=>s.id===e)?.name??e;this.handleStartChatWithPrompt(`Help me connect and configure the ${n} integration.`)}handleDataQuerySubmit(e){this.handleStartChatWithPrompt(`Query my connected data: ${e}`)}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}render(){return z0(this)}};y([b()],v.prototype,"settings",2);y([b()],v.prototype,"password",2);y([b()],v.prototype,"tab",2);y([b()],v.prototype,"onboarding",2);y([b()],v.prototype,"connected",2);y([b()],v.prototype,"reconnecting",2);y([b()],v.prototype,"reconnectAttempt",2);y([b()],v.prototype,"theme",2);y([b()],v.prototype,"themeResolved",2);y([b()],v.prototype,"hello",2);y([b()],v.prototype,"lastError",2);y([b()],v.prototype,"eventLog",2);y([b()],v.prototype,"assistantName",2);y([b()],v.prototype,"assistantAvatar",2);y([b()],v.prototype,"assistantAgentId",2);y([b()],v.prototype,"userName",2);y([b()],v.prototype,"userAvatar",2);y([b()],v.prototype,"sessionKey",2);y([b()],v.prototype,"sessionPickerOpen",2);y([b()],v.prototype,"sessionPickerPosition",2);y([b()],v.prototype,"sessionPickerSearch",2);y([b()],v.prototype,"sessionSearchOpen",2);y([b()],v.prototype,"sessionSearchPosition",2);y([b()],v.prototype,"sessionSearchQuery",2);y([b()],v.prototype,"sessionSearchResults",2);y([b()],v.prototype,"sessionSearchLoading",2);y([b()],v.prototype,"profilePopoverOpen",2);y([b()],v.prototype,"profileEditName",2);y([b()],v.prototype,"profileEditAvatar",2);y([b()],v.prototype,"editingTabKey",2);y([b()],v.prototype,"chatLoading",2);y([b()],v.prototype,"chatSending",2);y([b()],v.prototype,"chatSendingSessionKey",2);y([b()],v.prototype,"chatMessage",2);y([b()],v.prototype,"chatDrafts",2);y([b()],v.prototype,"chatMessages",2);y([b()],v.prototype,"chatToolMessages",2);y([b()],v.prototype,"chatStream",2);y([b()],v.prototype,"chatStreamStartedAt",2);y([b()],v.prototype,"chatRunId",2);y([b()],v.prototype,"currentToolName",2);y([b()],v.prototype,"currentToolInfo",2);y([b()],v.prototype,"workingSessions",2);y([b()],v.prototype,"compactionStatus",2);y([b()],v.prototype,"chatAvatarUrl",2);y([b()],v.prototype,"chatThinkingLevel",2);y([b()],v.prototype,"chatQueue",2);y([b()],v.prototype,"chatAttachments",2);y([b()],v.prototype,"pendingRetry",2);y([b()],v.prototype,"sidebarOpen",2);y([b()],v.prototype,"sidebarContent",2);y([b()],v.prototype,"sidebarError",2);y([b()],v.prototype,"sidebarMimeType",2);y([b()],v.prototype,"sidebarFilePath",2);y([b()],v.prototype,"sidebarTitle",2);y([b()],v.prototype,"splitRatio",2);y([b()],v.prototype,"lightbox",2);y([b()],v.prototype,"updateStatus",2);y([b()],v.prototype,"updateLoading",2);y([b()],v.prototype,"updateError",2);y([b()],v.prototype,"updateLastChecked",2);y([b()],v.prototype,"nodesLoading",2);y([b()],v.prototype,"nodes",2);y([b()],v.prototype,"devicesLoading",2);y([b()],v.prototype,"devicesError",2);y([b()],v.prototype,"devicesList",2);y([b()],v.prototype,"execApprovalsLoading",2);y([b()],v.prototype,"execApprovalsSaving",2);y([b()],v.prototype,"execApprovalsDirty",2);y([b()],v.prototype,"execApprovalsSnapshot",2);y([b()],v.prototype,"execApprovalsForm",2);y([b()],v.prototype,"execApprovalsSelectedAgent",2);y([b()],v.prototype,"execApprovalsTarget",2);y([b()],v.prototype,"execApprovalsTargetNodeId",2);y([b()],v.prototype,"execApprovalQueue",2);y([b()],v.prototype,"execApprovalBusy",2);y([b()],v.prototype,"execApprovalError",2);y([b()],v.prototype,"pendingGatewayUrl",2);y([b()],v.prototype,"configLoading",2);y([b()],v.prototype,"configRaw",2);y([b()],v.prototype,"configRawOriginal",2);y([b()],v.prototype,"configValid",2);y([b()],v.prototype,"configIssues",2);y([b()],v.prototype,"configSaving",2);y([b()],v.prototype,"configApplying",2);y([b()],v.prototype,"updateRunning",2);y([b()],v.prototype,"applySessionKey",2);y([b()],v.prototype,"configSnapshot",2);y([b()],v.prototype,"configSchema",2);y([b()],v.prototype,"configSchemaVersion",2);y([b()],v.prototype,"configSchemaLoading",2);y([b()],v.prototype,"configUiHints",2);y([b()],v.prototype,"configForm",2);y([b()],v.prototype,"configFormOriginal",2);y([b()],v.prototype,"configFormDirty",2);y([b()],v.prototype,"configFormMode",2);y([b()],v.prototype,"configSearchQuery",2);y([b()],v.prototype,"configActiveSection",2);y([b()],v.prototype,"configActiveSubsection",2);y([b()],v.prototype,"channelsLoading",2);y([b()],v.prototype,"channelsSnapshot",2);y([b()],v.prototype,"channelsError",2);y([b()],v.prototype,"channelsLastSuccess",2);y([b()],v.prototype,"whatsappLoginMessage",2);y([b()],v.prototype,"whatsappLoginQrDataUrl",2);y([b()],v.prototype,"whatsappLoginConnected",2);y([b()],v.prototype,"whatsappBusy",2);y([b()],v.prototype,"nostrProfileFormState",2);y([b()],v.prototype,"nostrProfileAccountId",2);y([b()],v.prototype,"presenceLoading",2);y([b()],v.prototype,"presenceEntries",2);y([b()],v.prototype,"presenceError",2);y([b()],v.prototype,"presenceStatus",2);y([b()],v.prototype,"agentsLoading",2);y([b()],v.prototype,"agentsList",2);y([b()],v.prototype,"agentsError",2);y([b()],v.prototype,"sessionsLoading",2);y([b()],v.prototype,"sessionsResult",2);y([b()],v.prototype,"sessionsError",2);y([b()],v.prototype,"sessionsFilterActive",2);y([b()],v.prototype,"sessionsFilterLimit",2);y([b()],v.prototype,"sessionsIncludeGlobal",2);y([b()],v.prototype,"sessionsIncludeUnknown",2);y([b()],v.prototype,"archivedSessions",2);y([b()],v.prototype,"archivedSessionsLoading",2);y([b()],v.prototype,"archivedSessionsExpanded",2);y([b()],v.prototype,"cronLoading",2);y([b()],v.prototype,"cronJobs",2);y([b()],v.prototype,"cronStatus",2);y([b()],v.prototype,"cronError",2);y([b()],v.prototype,"cronForm",2);y([b()],v.prototype,"cronRunsJobId",2);y([b()],v.prototype,"cronRuns",2);y([b()],v.prototype,"cronBusy",2);y([b()],v.prototype,"missionLoading",2);y([b()],v.prototype,"missionError",2);y([b()],v.prototype,"missionAgents",2);y([b()],v.prototype,"missionActiveRuns",2);y([b()],v.prototype,"missionSubagentRuns",2);y([b()],v.prototype,"missionTasks",2);y([b()],v.prototype,"missionFeedItems",2);y([b()],v.prototype,"workspaceNeedsSetup",2);y([b()],v.prototype,"onboardingPhase",2);y([b()],v.prototype,"onboardingData",2);y([b()],v.prototype,"onboardingActive",2);y([b()],v.prototype,"wizardActive",2);y([b()],v.prototype,"wizardState",2);y([b()],v.prototype,"workspaces",2);y([b()],v.prototype,"selectedWorkspace",2);y([b()],v.prototype,"workspacesSearchQuery",2);y([b()],v.prototype,"workspaceItemSearchQuery",2);y([b()],v.prototype,"workspacesLoading",2);y([b()],v.prototype,"workspacesCreateLoading",2);y([b()],v.prototype,"workspacesError",2);y([b()],v.prototype,"workspaceExpandedFolders",2);y([b()],v.prototype,"allTasks",2);y([b()],v.prototype,"taskFilter",2);y([b()],v.prototype,"showCompletedTasks",2);y([b()],v.prototype,"editingTaskId",2);y([b()],v.prototype,"myDayLoading",2);y([b()],v.prototype,"myDayError",2);y([b()],v.prototype,"todaySelectedDate",2);y([b()],v.prototype,"todayViewMode",2);y([b()],v.prototype,"dailyBrief",2);y([b()],v.prototype,"dailyBriefLoading",2);y([b()],v.prototype,"dailyBriefError",2);y([b()],v.prototype,"agentLog",2);y([b()],v.prototype,"agentLogLoading",2);y([b()],v.prototype,"agentLogError",2);y([b()],v.prototype,"briefNotes",2);y([b()],v.prototype,"todayTasks",2);y([b()],v.prototype,"todayTasksLoading",2);y([b()],v.prototype,"chatPrivateMode",2);y([b()],v.prototype,"lifeSubtab",2);y([b()],v.prototype,"goals",2);y([b()],v.prototype,"goalsLoading",2);y([b()],v.prototype,"goalsError",2);y([b()],v.prototype,"dataSources",2);y([b()],v.prototype,"dataLoading",2);y([b()],v.prototype,"dataError",2);y([b()],v.prototype,"dataSubtab",2);y([b()],v.prototype,"dynamicSlots",2);y([b()],v.prototype,"workProjects",2);y([b()],v.prototype,"workLoading",2);y([b()],v.prototype,"workError",2);y([b()],v.prototype,"workExpandedProjects",2);y([b()],v.prototype,"workProjectFiles",2);y([b()],v.prototype,"workDetailLoading",2);y([b()],v.prototype,"peopleList",2);y([b()],v.prototype,"peopleLoading",2);y([b()],v.prototype,"peopleError",2);y([b()],v.prototype,"peopleSelected",2);y([b()],v.prototype,"peopleSearchQuery",2);y([b()],v.prototype,"wheelOfLifeData",2);y([b()],v.prototype,"wheelOfLifeLoading",2);y([b()],v.prototype,"wheelOfLifeError",2);y([b()],v.prototype,"wheelOfLifeEditMode",2);y([b()],v.prototype,"visionBoardData",2);y([b()],v.prototype,"visionBoardLoading",2);y([b()],v.prototype,"visionBoardError",2);y([b()],v.prototype,"visionBoardIdentityToday",2);y([b()],v.prototype,"lifetracksData",2);y([b()],v.prototype,"lifetracksLoading",2);y([b()],v.prototype,"lifetracksError",2);y([b()],v.prototype,"lifetracksCurrentTrack",2);y([b()],v.prototype,"lifetracksConfig",2);y([b()],v.prototype,"lifetracksGenerating",2);y([b()],v.prototype,"lifetracksGenerationError",2);y([b()],v.prototype,"skillsLoading",2);y([b()],v.prototype,"skillsReport",2);y([b()],v.prototype,"skillsError",2);y([b()],v.prototype,"skillsFilter",2);y([b()],v.prototype,"skillEdits",2);y([b()],v.prototype,"skillsBusyKey",2);y([b()],v.prototype,"skillMessages",2);y([b()],v.prototype,"debugLoading",2);y([b()],v.prototype,"debugStatus",2);y([b()],v.prototype,"debugHealth",2);y([b()],v.prototype,"debugModels",2);y([b()],v.prototype,"debugHeartbeat",2);y([b()],v.prototype,"debugCallMethod",2);y([b()],v.prototype,"debugCallParams",2);y([b()],v.prototype,"debugCallResult",2);y([b()],v.prototype,"debugCallError",2);y([b()],v.prototype,"logsLoading",2);y([b()],v.prototype,"logsError",2);y([b()],v.prototype,"logsFile",2);y([b()],v.prototype,"logsEntries",2);y([b()],v.prototype,"logsFilterText",2);y([b()],v.prototype,"logsLevelFilters",2);y([b()],v.prototype,"logsAutoFollow",2);y([b()],v.prototype,"logsTruncated",2);y([b()],v.prototype,"logsCursor",2);y([b()],v.prototype,"logsLastFetchAt",2);y([b()],v.prototype,"logsLimit",2);y([b()],v.prototype,"logsMaxBytes",2);y([b()],v.prototype,"logsAtBottom",2);y([b()],v.prototype,"toasts",2);y([b()],v.prototype,"chatUserNearBottom",2);y([b()],v.prototype,"chatNewMessagesBelow",2);y([b()],v.prototype,"consciousnessStatus",2);y([b()],v.prototype,"focusPulseData",2);y([b()],v.prototype,"trustTrackerData",2);y([b()],v.prototype,"trustTrackerLoading",2);y([b()],v.prototype,"guardrailsData",2);y([b()],v.prototype,"guardrailsLoading",2);y([b()],v.prototype,"godmodeOptions",2);y([b()],v.prototype,"godmodeOptionsLoading",2);v=y([Jl("godmode-app")],v);
