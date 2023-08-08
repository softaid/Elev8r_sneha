//@ui5-bundle sap/ushell/bootstrap/cdm-dbg.js
//@ui5-bundle-raw-include ui5loader.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(e){"use strict";if(e.Promise===undefined||!e.Promise.prototype.finally||e.URLSearchParams===undefined){var t=document.documentElement,n=t.style,r="Microsoft Internet Explorer 11 and other legacy browsers are no longer supported. For more information, see ",i="Internet Explorer 11 will no longer be supported by various SAP UI technologies in newer releases",a="https://blogs.sap.com/2021/02/02/internet-explorer-11-will-no-longer-be-supported-by-various-sap-ui-technologies-in-newer-releases/";t.innerHTML='<body style="margin:0;padding:0;overflow-y:hidden;background-color:#f7f7f7;text-align:center;width:100%;position:absolute;top:50%;transform:translate(0,-50%);"><div style="color:#32363a;font-family:Arial,Helvetica,sans-serif;font-size:.875rem;">'+r+'<a href="'+a+'" style="color:#4076b4;">'+i+"</a>.</div></body>";n.margin=n.padding="0";n.width=n.height="100%";if(e.stop){e.stop()}else{document.execCommand("Stop")}throw new Error(r+a)}})(window);(function(e){"use strict";function t(e){var t=e.search(/[?#]/);return t<0?e:e.slice(0,t)}function n(e,r){r=t(r?n(r):document.baseURI);return new URL(e,r).href}function r(){}function i(e,t){Object.keys(e).forEach(function(n){t(n,e[n])})}function a(e){setTimeout(e,0)}function o(e){Promise.resolve().then(e)}var u={debug:r,info:r,warning:r,error:r,isLoggable:r};var s=r;var l;var f;var d=a;var c=true;var p=false;var g=false;var h=0;var m="./";var v;var b;var y=Object.create(null);y[""]={url:m,absoluteUrl:n(m)};var w=Object.create(null),x=Object.create(null),E=Object.create(null),j=false,A;var L=Object.create(null),q=null,I=[],O="",M=0;function U(e){if(!/\.js$/.test(e)){return undefined}e=e.slice(0,-3);if(/^jquery\.sap\./.test(e)){return e}return e.replace(/\//g,".")}function S(e){var t=e.lastIndexOf("/"),n=e.lastIndexOf(".");if(n>t){return{id:e.slice(0,n),type:e.slice(n)}}return{id:e,type:""}}var R=/(\.controller|\.fragment|\.view|\.designtime|\.support)?.js$/;function P(e){var t=R.exec(e);if(t){return{baseID:e.slice(0,t.index),subType:t[0]}}}var _=/(?:^|\/)\.+(?=\/|$)/;var D=/^\.*$/;function T(e,t){var n=e.search(_),r,i,a,o,u;if(n<0){return e}if(n===0){if(t==null){throw new Error("relative name not supported ('"+e+"'")}e=t.slice(0,t.lastIndexOf("/")+1)+e}r=e.split("/");for(a=0,o=0,u=r.length;a<u;a++){i=r[a];if(D.test(i)){if(i==="."||i===""){continue}else if(i===".."){if(o===0){throw new Error("Can't navigate to parent of root ('"+e+"')")}o--}else{throw new Error("Illegal path segment '"+i+"' ('"+e+"')")}}else{r[o++]=i}}r.length=o;return r.join("/")}function k(e,r){e=String(e||"");if(r==null){if(e){if(y[e]){delete y[e];u.info("registerResourcePath ('"+e+"') (registration removed)")}return}r=m;u.info("registerResourcePath ('"+e+"') (default registration restored)")}r=t(String(r));if(r.slice(-1)!=="/"){r+="/"}y[e]={url:r,absoluteUrl:n(r)}}function C(e,t){var n=e,r=e.length,i;while(r>0&&!y[n]){r=n.lastIndexOf("/");n=r>0?n.slice(0,r):""}s((r>0||n==="")&&y[n],"there always must be a mapping");i=y[n].url+e.slice(r+1);if(i.slice(-1)==="/"){i=i.slice(0,-1)}return i+(t||"")}function N(){return h}function $(e,r){var i,a,o;e=t(n(e));for(i in y){a=y[i].absoluteUrl.slice(0,-1);if(e.lastIndexOf(a,0)===0){o=i+e.slice(a.length);if(o.charAt(0)==="/"){o=o.slice(1)}if(!r||L[o]&&L[o].data!=undefined){return o}}}}function W(e){var t,n;if(e!=null){e=S(e).id;t=e.length;n=w[e];while(t>0&&n==null){t=e.lastIndexOf("/");if(t>0){e=e.slice(0,t);n=w[e]}}}return n||w["*"]}function F(e,t){var n=W(t),r,i;e=T(e,t);if(n!=null){r=S(e).id;i=r.length;while(i>0&&n[r]==null){i=r.lastIndexOf("/");r=i>0?r.slice(0,i):""}if(i>0){if(u.isLoggable()){u.debug("module ID "+e+" mapped to "+n[r]+e.slice(i))}return n[r]+e.slice(i)}}return e}function J(e,t,n,r){for(var i=0;e&&i<n;i++){if(!e[t[i]]&&r){e[t[i]]={}}e=e[t[i]]}return e}function H(t){var n=t?t.split("."):[];if(h&&n.length>1){u.error("[nosync] getGlobalProperty called to retrieve global name '"+t+"'")}return J(e,n,n.length)}function G(t,n){var r=t?t.split("."):[],i;if(r.length>0){i=J(e,r,r.length-1,true);i[r[r.length-1]]=n}}function X(e){return{moduleExport:e}}function B(e){return e.moduleExport}var z=0,Y=-1,K=1,Q=2,V=3,Z=4,ee=5,te={};function ne(e){this.name=e;this.state=z;this.settled=false;this.url=this._deferred=this.data=this.group=this.error=this.pending=null;this.content=te}ne.prototype.deferred=function(){if(this._deferred==null){var e=this._deferred={};e.promise=new Promise(function(t,n){e.resolve=t;e.reject=n});e.promise.catch(r)}return this._deferred};ne.prototype.api=function(){if(this._api==null){this._exports={};this._api={id:this.name.slice(0,-3),exports:this._exports,url:this.url,config:r}}return this._api};ne.prototype.ready=function(e){s(!this.settled,"Module "+this.name+" is already settled");this.state=Z;this.settled=true;if(arguments.length>0){this.content=e}this.deferred().resolve(X(this.value()));if(this.aliases){e=this.value();this.aliases.forEach(function(t){ne.get(t).ready(e)})}};ne.prototype.failWith=function(e,t){var n=se(e,this,t);this.fail(n);return n};ne.prototype.fail=function(e){s(!this.settled,"Module "+this.name+" is already settled");this.settled=true;if(this.state!==ee){this.state=ee;this.error=e;this.deferred().reject(e);if(this.aliases){this.aliases.forEach(function(t){ne.get(t).fail(e)})}}};ne.prototype.addPending=function(e){(this.pending||(this.pending=[])).push(e)};ne.prototype.addAlias=function(e){(this.aliases||(this.aliases=[])).push(e);ne.get(e).addPending(this.name)};ne.prototype.preload=function(e,t,n){if(this.state===z&&!(A&&A(this.name))){this.state=Y;this.url=e;this.data=t;this.group=n}return this};ne.prototype.value=function(){if(this.state===Z){if(this.content===te){var e=x[this.name],t=e&&(Array.isArray(e.exports)?e.exports[0]:e.exports);this.content=H(t||U(this.name))}return this.content}return undefined};ne.prototype.dependsOn=function(e){var t=e.name,n=Object.create(null);function r(e){if(!n[e]){n[e]=true;var i=L[e]&&L[e].pending;return Array.isArray(i)&&(i.indexOf(t)>=0||i.some(r))}return false}return this.name===t||r(this.name)};ne.get=function(e){if(!L[e]){L[e]=new ne(e)}return L[e]};function re(){if(I.length>0){return I[I.length-1].name}return document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module")}var ie,ae;function oe(e){if(ie===e){return}if(ie){ie.amd=ae;ie=ae=undefined}ie=e;if(e&&!e.ui5){ae=ie.amd;Object.defineProperty(ie,"amd",{get:function(){var e=re();if(e&&x[e]&&x[e].amd){u.debug("suppressing define.amd for "+e);return undefined}return ae},set:function(e){ae=e;u.debug("define.amd became "+(e?"active":"unset"))},configurable:true})}}try{Object.defineProperty(e,"define",{get:function(){return ie},set:function(e){oe(e);u.debug("define became "+(e?"active":"unset"))},configurable:true})}catch(e){u.warning("could not intercept changes to window.define, ui5loader won't be able to a change of the AMD loader")}oe(e.define);function ue(e){return e&&e.name==="ModuleError"}function se(e,t,n){var r="'"+t.name+"'";if(ue(n)){r=r+"\n -> "+n._modules.replace(/ -> /g,"  -> ");if(e===n._template){n=n.cause}}var i=e.replace(/\{id\}/,r).replace(/\{url\}/,t.url)+(n?": "+n.message:"");var a=new Error(i);a.name="ModuleError";a.cause=n;if(n&&n.stack){a.stack=a.stack+"\nCaused by: "+n.stack}a._template=e;a._modules=r;return a}function le(e){var t;s(/\.js$/.test(e),"must be a Javascript module");t=ne.get(e);if(t.state>z){return t}if(u.isLoggable()){u.debug(O+"declare module '"+e+"'")}t.state=Z;return t}function fe(e,t){ne.get(e).ready(t)}function de(e){var t=[],n=0,r;this.push=function(i,a,o,s){if(u.isLoggable()){u.debug(O+"pushing define() call"+(document.currentScript?" from "+document.currentScript.src:"")+" to define queue #"+n)}var l=document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module");t.push({name:i,deps:a,factory:o,_export:s,guess:l});if(!r&&!e&&l==null){r=setTimeout(this.process.bind(this,null,"timer"))}};this.clear=function(){t=[];if(r){clearTimeout(r);r=null}};this.process=function(e,r){var i=u.isLoggable(),a=n++,o=t,s=null;this.clear();if(e){if(e.execError){if(i){u.debug("module execution error detected, ignoring queued define calls ("+o.length+")")}e.fail(e.execError);return}}s=e&&e.name;o.forEach(function(t){if(t.name==null){if(s!=null){t.name=s;s=null}else{if(c){var n=new Error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. ");if(e){e.fail(n)}else{throw n}}t.name="~anonymous~"+ ++M+".js";u.error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. "+"All other usages will fail in future releases or when standard AMD loaders are used. "+"Now using substitute name "+t.name)}}else if(e&&t.name===e.name){if(s==null&&!c){u.error("Duplicate module definition: both, an unnamed module and a module with the expected name exist."+"This use case will fail in future releases or when standard AMD loaders are used. ")}s=null}});if(s&&o.length>0){if(i){u.debug("No queued module definition matches the ID of the request. "+"Now assuming that the first definition '"+o[0].name+"' is an alias of '"+s+"'")}ne.get(o[0].name).addAlias(s);s=null}if(i){u.debug(O+"["+r+"] "+"processing define queue #"+a+(e?" for '"+e.name+"'":"")+" with entries ["+o.map(function(e){return"'"+e.name+"'"})+"]")}o.forEach(function(e){ye(e.name,e.deps,e.factory,e._export,true)});if(s!=null&&!e.settled){if(i){u.debug(O+"no queued module definition for the requested module found, assume the module to be ready")}e.data=undefined;e.ready()}if(i){u.debug(O+"processing define queue #"+a+" done")}}}var ce=new de;function pe(e){var t=new XMLHttpRequest;function n(e){e=new Error(t.statusText?t.status+" - "+t.statusText:t.status);e.name="XHRLoadError";e.status=t.status;e.statusText=t.statusText;return e}t.addEventListener("load",function(r){if(t.status===200||t.status===0){e.state=Q;e.data=t.responseText}else{e.error=n()}});t.addEventListener("error",function(t){e.error=n()});t.open("GET",e.url,false);try{t.send()}catch(t){e.error=t}}window.addEventListener("error",function e(t){var n=document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module");var r=n&&ne.get(n);if(r&&r.execError==null){if(u.isLoggable()){u.debug("unhandled exception occurred while executing "+n+": "+t.message)}r.execError=t.error||{name:"Error",message:t.message};return false}});function ge(e,t){var n;function r(t){if(u.isLoggable()){u.debug("JavaScript resource loaded: "+e.name)}n.removeEventListener("load",r);n.removeEventListener("error",i);ce.process(e,"onload")}function i(a){n.removeEventListener("load",r);n.removeEventListener("error",i);if(t){u.warning("retry loading JavaScript resource: "+e.name);if(n&&n.parentNode){n.parentNode.removeChild(n)}e.url=t;ge(e,null);return}u.error("failed to load JavaScript resource: "+e.name);e.failWith("failed to load {id} from {url}",new Error("script load error"))}n=document.createElement("SCRIPT");n["s"+"rc"]=e.url;n.setAttribute("data-sap-ui-module",e.name);if(t!==undefined){if(x[e.name]&&x[e.name].amd){n.setAttribute("data-sap-ui-module-amd","true")}n.addEventListener("load",r);n.addEventListener("error",i)}document.head.appendChild(n)}function he(e){var t=E[e];if(Array.isArray(t)){u.debug("preload dependencies for "+e+": "+t);t.forEach(function(t){t=F(t,e);if(/\.js$/.test(t)){me(null,t,true)}})}}function me(e,t,n,i,a){var o=u.isLoggable(),s=P(t),f=x[t],d,c,p,g,m;if(!s){throw new Error("can only require Javascript module, not "+t)}if(t[0]=="/"){u.error("Module names that start with a slash should not be used, as they are reserved for future use.")}d=ne.get(t);if(f&&f.deps&&!i){if(o){u.debug("require dependencies of raw module "+t)}return be(d,f.deps,function(){return me(e,t,n,true,a)},function(e){throw d.failWith("Failed to resolve dependencies of {id}",e)},n)}if(d.state===z&&d.group&&d.group!==t&&!a){if(o){u.debug(O+"require bundle '"+d.group+"'"+" containing '"+t+"'")}if(n){return me(null,d.group,n).catch(r).then(function(){return me(e,t,n,i,true)})}else{try{me(null,d.group,n)}catch(e){if(o){u.error(O+"require bundle '"+d.group+"' failed (ignored)")}}}}if(o){u.debug(O+"require '"+t+"'"+(e?" (dependency of '"+e.name+"')":""))}if(d.state!==z){if(d.state===V&&d.data!=null&&!n&&d.async){d.state=Y;d.async=n;d.pending=null}if(d.state===Y){d.state=Q;d.async=n;m=true;l&&l.start(t,"Require module "+t+" (preloaded)",["require"]);ve(t,n);l&&l.end(t)}if(d.state===Z){if(!m&&o){u.debug(O+"module '"+t+"' has already been loaded (skipped).")}return n?Promise.resolve(X(d.value())):X(d.value())}else if(d.state===ee){if(n){return d.deferred().promise}else{throw d.error}}else{if(n){if(e&&d.dependsOn(e)){if(u.isLoggable()){u.debug("cycle detected between '"+e.name+"' and '"+t+"', returning undefined for '"+t+"'")}return Promise.resolve(X(undefined))}return d.deferred().promise}if(!n&&!d.async){if(u.isLoggable()){u.debug("cycle detected between '"+(e?e.name:"unknown")+"' and '"+t+"', returning undefined for '"+t+"'")}return X(undefined)}u.warning("Sync request triggered for '"+t+"' while async request was already pending."+" Loading a module twice might cause issues and should be avoided by fully migrating to async APIs.")}}l&&l.start(t,"Require module "+t,["require"]);d.state=K;d.async=n;c=j?["-dbg",""]:[""];if(!n){for(p=0;p<c.length&&d.state!==Q;p++){d.url=C(s.baseID,c[p]+s.subType);if(o){u.debug(O+"loading "+(c[p]?c[p]+" version of ":"")+"'"+t+"' from '"+d.url+"' (using sync XHR)")}if(h){g="[nosync] loading module '"+d.url+"'";if(h===1){u.error(g)}else{throw new Error(g)}}Le.load({completeLoad:r,async:false},d.url,s.baseID);pe(d)}if(d.state===K){d.failWith("failed to load {id} from {url}",d.error)}else if(d.state===Q){ve(t,n)}l&&l.end(t);if(d.state!==Z){throw d.error}return X(d.value())}else{d.url=C(s.baseID,c[0]+s.subType);var v=j?C(s.baseID,c[1]+s.subType):d.url;if(u.isLoggable()){u.debug(O+"loading '"+t+"' from '"+d.url+"' (using <script>)")}Le.load({completeLoad:r,async:true},v,s.baseID);ge(d,v);he(t);return d.deferred().promise}}function ve(t,r){var i=L[t],a=u.isLoggable(),o,s,l,d,c;if(i&&i.state===Q&&typeof i.data!=="undefined"){d=q;c=ce;try{q=!r;ce=new de(true);if(a){if(typeof i.data==="string"){u.warning(O+"executing '"+t+"' (using eval)")}else{u.debug(O+"executing '"+t+"'")}o=O;O=O+": "}i.state=V;I.push({name:t,used:false});if(typeof i.data==="function"){i.data.call(e)}else if(Array.isArray(i.data)){we.apply(null,i.data)}else{s=i.data;if(s){l=/\/\/[#@] source(Mapping)?URL=(.*)$/.exec(s);if(l&&l[1]&&/^[^/]+\.js\.map$/.test(l[2])){s=s.slice(0,l.index)+l[0].slice(0,-l[2].length)+n(l[2],i.url)}if(!l||l[1]){s+="\n//# sourceURL="+n(i.url)+"?eval"}}if(typeof f==="function"){s=f(s,t)}e.eval(s)}ce.process(i,"after eval")}catch(e){i.data=undefined;if(ue(e)){i.fail(e)}else{if(e instanceof SyntaxError&&s){if(A){i.url=URL.createObjectURL(new Blob([s],{type:"text/javascript"}));ge(i)}else{u.error("A syntax error occurred while evaluating '"+t+"'"+", restarting the app with sap-ui-debug=x might reveal the error location")}}i.failWith("Failed to execute {id}",e)}}finally{I.pop();if(a){O=o;u.debug(O+"finished executing '"+t+"'")}ce=c;q=d}}}function be(e,t,n,r,i){var a,o=[],u,s,l,f;try{if(e instanceof ne){a=e.name}else{a=e;e=null}t=t.slice();for(u=0;u<t.length;u++){t[u]=F(t[u]+".js",a)}if(e){t.forEach(function(t){if(!/^(require|exports|module)\.js$/.test(t)){e.addPending(t)}})}for(u=0;u<t.length;u++){s=t[u];if(e){switch(s){case"require.js":o[u]=X(Ee(a,true));break;case"module.js":o[u]=X(e.api());break;case"exports.js":e.api();o[u]=X(e._exports);break;default:break}}if(!o[u]){o[u]=me(e,s,i)}}}catch(e){l=e}if(i){f=l?Promise.reject(l):Promise.all(o);return f.then(n,r)}else{if(l){r(l)}else{return n(o)}}}function ye(t,n,r,i,a){var o=u.isLoggable();t=T(t);if(o){u.debug(O+"define('"+t+"', "+"['"+n.join("','")+"']"+")")}var s=le(t);var l=false;function f(){if(s.settled){if(s.state>=Z&&a&&s.async===false){u.warning("Repeated module execution skipped after async/sync conflict for "+s.name);return true}if(c&&a){u.warning("Module '"+s.name+"' has been defined more than once. "+"All but the first definition will be ignored, don't try to define the same module again.");return true}if(!l){u.error("Module '"+s.name+"' is executed more than once. "+"This is an unsupported scenario and will fail in future versions of UI5 or "+"when a standard AMD loader is used. Don't define the same module again.");l=true}}}if(f()){return}s.content=undefined;be(s,n,function(n){if(f()){return}if(o){u.debug(O+"define('"+t+"'): dependencies resolved, calling factory "+typeof r)}if(i&&h!==2){var l=t.split("/");if(l.length>1){J(e,l,l.length-1,true)}}if(typeof r==="function"){try{n=n.map(B);var d=r.apply(e,n);if(s._api&&s._api.exports!==undefined&&s._api.exports!==s._exports){d=s._api.exports}else if(d===undefined&&s._exports){d=s._exports}s.content=d}catch(e){var c=s.failWith("failed to execute module factory for '{id}'",e);if(a){return}throw c}}else{s.content=r}if(i&&h!==2){if(s.content==null){u.error("Module '"+t+"' returned no content, but should export to global?")}else{if(o){u.debug("exporting content of '"+t+"': as global object")}var p=U(t);G(p,s.content)}}s.ready()},function(e){var t=s.failWith("Failed to resolve dependencies of {id}",e);if(!a){throw t}},a)}function we(e,t,n,r){var i,a;if(typeof e==="string"){i=e+".js"}else{r=n;n=t;t=e;i=null}if(!Array.isArray(t)){r=n;n=t;if(typeof n==="function"&&n.length>0){t=["require","exports","module"].slice(0,n.length)}else{t=[]}}if(q===false||q==null&&p){ce.push(i,t,n,r);if(i!=null){var o=ne.get(i);if(o.state===z){o.state=V;o.async=true}}return}a=I.length>0?I[I.length-1]:null;if(!i){if(a&&!a.used){i=a.name;a.used=true}else{i="~anonymous~"+ ++M+".js";if(a){i=a.name.slice(0,a.name.lastIndexOf("/")+1)+i}u.error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. "+"All other usages will fail in future releases or when standard AMD loaders are used "+"or when ui5loader runs in async mode. Now using substitute name "+i)}}else if(a&&!a.used&&i!==a.name){u.debug("module names don't match: requested: "+e+", defined: ",a.name);ne.get(a.name).addAlias(e)}ye(i,t,n,r,false)}function xe(e,t,n){var r=arguments;var i=typeof r[r.length-1]==="boolean";if(i){r=Array.prototype.slice.call(r,0,r.length-1)}we.apply(this,r)}xe.amd={};xe.ui5={};function Ee(t,n){var r=function(r,i,a){var o;s(typeof r==="string"||Array.isArray(r),"dependency param either must be a single string or an array of strings");s(i==null||typeof i==="function","callback must be a function or null/undefined");s(a==null||typeof a==="function","error callback must be a function or null/undefined");if(typeof r==="string"){o=F(r+".js",t);var u=ne.get(o);if(n&&u.state!==V&&u.state!==Z){throw new Error("Module '"+o+"' has not been loaded yet. "+"Use require(['"+o+"']) to load it.")}return u.value()}be(t,r,function(t){t=t.map(B);if(typeof i==="function"){if(p){i.apply(e,t)}else{d(function(){i.apply(e,t)})}}},function(t){if(typeof a==="function"){if(p){a.call(e,t)}else{d(function(){a.call(e,t)})}}else{throw t}},p)};r.toUrl=function(e){var n=je(F(e,t),e);return Ae(n)};return r}function je(e,t){if(t.slice(-1)==="/"&&e.slice(-1)!=="/"){return e+"/"}return e}function Ae(e){if(e.indexOf("/")===0){throw new Error("The provided argument '"+e+"' may not start with a slash")}return je(C(e),e)}var Le=Ee(null,false);var qe=Ee(null,true);function Ie(e){e=F(e+".js");if(u.isLoggable()){u.warning("sync require of '"+e+"'")}return B(me(null,e,false))}function Oe(e,t,n,r){if(typeof e!=="string"){throw new Error("predefine requires a module name")}e=T(e);ne.get(e+".js").preload("<unknown>/"+e,[e,t,n,r],null)}function Me(e,t,n){t=t||null;n=n||"<unknown>";for(var r in e){r=T(r);ne.get(r).preload(n+"/"+r,e[r],t)}}function Ue(e){var t=[Y,z,Q,Z,ee,V,K];var n={};n[Y]="PRELOADED";n[z]="INITIAL";n[K]="LOADING";n[Q]="LOADED";n[V]="EXECUTING";n[Z]="READY";n[ee]="FAILED";if(e==null){e=Y}var r=u.isLoggable("INFO")?u.info.bind(u):console.info.bind(console);var i=Object.keys(L).sort();t.forEach(function(t){if(t<e){return}var a=0;r(n[t]+":");i.forEach(function(e,i){var o=L[e];if(o.state===t){var u;if(o.state===K){var s=o.pending&&o.pending.reduce(function(e,t){var r=ne.get(t);if(r.state!==Z){e.push(t+"("+n[r.state]+")")}return e},[]);if(s&&s.length>0){u="waiting for "+s.join(", ")}}else if(o.state===ee){u=(o.error.name||"Error")+": "+o.error.message}r("  "+(i+1)+" "+e+(u?" ("+u+")":""));a++}});if(a===0){r("  none")}})}function Se(){var e=Object.create(null);i(y,function(t,n){e[t]=n.url});return e}function Re(e,t,n,r){var i=[],a,o;if(t==null){t=true}if(t){for(a in L){o=L[a];if(o&&o.group===e){i.push(a)}}}else{if(L[e]){i.push(e)}}i.forEach(function(e){var t=L[e];if(t&&r&&e.match(/\.js$/)){G(U(e),undefined)}if(t&&(n||t.state===Y)){delete L[e]}})}function Pe(e,t){if(e){e=F(e)}else{e=$(t,true)}var n=e&&L[e];if(n){n.state=Q;return n.data}else{return undefined}}function _e(){var e=Object.create(null);i(L,function(t,n){e[t]={state:n.state,ui5:U(t)}});return e}function De(e,t){e=F(e);var n=me(null,e,true).then(B);return t?n.catch(r):n}var Te={baseUrl:function(e){k("",e)},paths:k,shim:function(e,t){if(Array.isArray(t)){t={deps:t}}x[e+".js"]=t},amd:function(t){t=!!t;if(g!==t){g=t;if(t){v=e.define;b=e.require;e.define=xe;e.require=qe;p=true}else{e.define=v;e.require=b}}},async:function(e){if(p&&!e){throw new Error("Changing the ui5loader config from async to sync is not supported. Only a change from sync to async is allowed.")}p=!!e},bundles:function(e,t){e+=".js";t.forEach(function(t){ne.get(t+".js").group=e})},bundlesUI5:function(e,t){t.forEach(function(t){ne.get(t).group=e})},debugSources:function(e){j=!!e},depCache:function(e,t){E[e+".js"]=t.map(function(e){return e+".js"})},depCacheUI5:function(e,t){E[e]=t},ignoreBundledResources:function(e){if(e==null||typeof e==="function"){A=e}},map:function(e,t){if(t==null){delete w[e]}else if(typeof t==="string"){w["*"][e]=t}else{w[e]=w[e]||Object.create(null);i(t,function(t,n){w[e][t]=n})}},reportSyncCalls:function(e){if(e===0||e===1||e===2){h=e}},noConflict:function(e){u.warning("Config option 'noConflict' has been deprecated, use option 'amd' instead, if still needed.");Te.amd(!e)}};var ke={baseUrl:Te.baseUrl,paths:function(e,t){k(e,n(t,C("")+"/"))},map:Te.map,shim:Te.shim};function Ce(e,t){function n(e,n){var r=t[e];if(typeof r==="function"){if(r.length===1){r(n)}else if(n!=null){i(n,r)}}else{u.warning("configuration option "+e+" not supported (ignored)")}}if(e.baseUrl){n("baseUrl",e.baseUrl)}i(e,function(e,t){if(e!=="baseUrl"){n(e,t)}})}function Ne(e){if(e===undefined){return{amd:g,async:p,noConflict:!g}}Ce(e,Te)}function $e(e){if(e===undefined){return undefined}Ce(e,ke)}Le.preload=Me;Le.load=function(e,t,n){};var We={amdDefine:xe,amdRequire:qe,config:Ne,declareModule:function(e){le(T(e))},defineModuleSync:fe,dump:Ue,getAllModules:_e,getModuleContent:Pe,getModuleState:function(e){return L[e]?L[e].state:z},getResourcePath:C,getSyncCallBehavior:N,getUrlPrefixes:Se,loadJSResourceAsync:De,resolveURL:n,guessResourceName:$,toUrl:Ae,unloadResources:Re};Object.defineProperties(We,{logger:{get:function(){return u},set:function(e){u=e}},measure:{get:function(){return l},set:function(e){l=e}},assert:{get:function(){return s},set:function(e){s=e}},translate:{get:function(){return f},set:function(e){f=e}},callbackInMicroTask:{get:function(){return d===o},set:function(e){d=e?o:a}}});e.sap=e.sap||{};sap.ui=sap.ui||{};sap.ui.loader={config:Ne,_:We};qe.config=$e;sap.ui.define=we;sap.ui.predefine=Oe;sap.ui.require=Le;sap.ui.requireSync=Ie})(window);
//@ui5-bundle-raw-include sap/ushell/bootstrap/ui5loader-config.js
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

/*
 * This module configures the ui5loader in the way that ushell needs.
 */
(function () {
    "use strict";

    var ui5loader = window.sap && window.sap.ui && window.sap.ui.loader;

    if (!ui5loader) {
        throw new Error("FLP bootstrap: ui5loader is needed, but could not be found");
    }

    var oConfig = {
        // async: false | true could be set here to control the loading behavior.
        // By not setting the loading mode here we let the decision to UI5.
        // This also enables that one can via the URL parameter sap-ui-async=[true|false] switch async loading on/off for testing purposes.
    },
        oScript = document.getElementById("sap-ui-bootstrap"),
        oScriptUrl = oScript && oScript.getAttribute("src"),
        rUrlWithTokenPattern = /^((?:.*\/)?resources\/~\d{14}~\/)/,
        sBaseUrl;

    if (oScriptUrl && rUrlWithTokenPattern.test(oScriptUrl)) {
        // Because ui5loader calculate the default resource url without token we neeed to set the root path explicitly with token
        // Example of the token: ~20180802034800~
        sBaseUrl = rUrlWithTokenPattern.exec(oScriptUrl)[1];
        window["sap-ui-config"] = window["sap-ui-config"] || {};
        window["sap-ui-config"].resourceRoots = window["sap-ui-config"].resourceRoots || {};
        window["sap-ui-config"].resourceRoots[""] = sBaseUrl;
    }

    ui5loader.config(oConfig);
}());
//@ui5-bundle-raw-include ui5loader-autoconfig.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var r=window.sap&&window.sap.ui&&window.sap.ui.loader,e=window["sap-ui-config"]||{},i,t,a,s,u,p,o,d=false;function n(r,e){var a=r&&r.getAttribute("src"),s=e.exec(a);if(s){i=s[1]||"";p=r;o=a;t=/sap-ui-core-nojQuery\.js(?:[?#]|$)/.test(a);return true}}function y(r){return r&&r[r.length-1]!=="/"?r+"/":r}if(r==null){throw new Error("ui5loader-autoconfig.js: ui5loader is needed, but could not be found")}if(!n(document.querySelector("SCRIPT[src][id=sap-ui-bootstrap]"),/^((?:[^?#]*\/)?resources\/)/)){s=/^([^?#]*\/)?(?:sap-ui-(?:core|custom|boot|merged)(?:-[^?#/]*)?|jquery.sap.global|ui5loader(?:-autoconfig)?)\.js(?:[?#]|$)/;a=document.scripts;for(u=0;u<a.length;u++){if(n(a[u],s)){break}}}if(typeof e==="object"&&typeof e.resourceRoots==="object"&&typeof e.resourceRoots[""]==="string"){i=e.resourceRoots[""]}if(i==null){throw new Error("ui5loader-autoconfig.js: could not determine base URL. No known script tag and no configuration found!")}(function(){var r;try{r=window.localStorage.getItem("sap-ui-reboot-URL")}catch(r){}if(/sap-bootstrap-debug=(true|x|X)/.test(location.search)){debugger}if(r){var e=y(i)+"sap/ui/core/support/debugReboot.js";document.write('<script src="'+e+'"><\/script>');var t=new Error("This is not a real error. Aborting UI5 bootstrap and rebooting from: "+r);t.name="Restart";throw t}})();(function(){var e=/(?:^|\?|&)sap-ui-debug=([^&]*)(?:&|$)/.exec(window.location.search),t=e&&decodeURIComponent(e[1]);try{t=t||window.localStorage.getItem("sap-ui-debug")}catch(r){}t=t||p&&p.getAttribute("data-sap-ui-debug");if(typeof t==="string"){if(/^(?:false|true|x|X)$/.test(t)){t=t!=="false"}}else{t=!!t}if(/-dbg\.js([?#]|$)/.test(o)){window["sap-ui-loaddbg"]=true;t=t||true}window["sap-ui-debug"]=t;window["sap-ui-optimized"]=window["sap-ui-optimized"]||/\.location/.test(l)&&!/oBootstrapScript/.test(l);if(window["sap-ui-optimized"]&&t){window["sap-ui-loaddbg"]=true;if(t===true&&!window["sap-ui-debug-no-reboot"]){var a;if(o!=null){a=o.replace(/\/(?:sap-ui-cachebuster\/)?([^\/]+)\.js/,"/$1-dbg.js")}else{a=y(i)+"sap-ui-core.js"}r.config({amd:false});window["sap-ui-optimized"]=false;if(r.config().async){var s=document.createElement("script");s.src=a;document.head.appendChild(s)}else{document.write('<script src="'+a+'"><\/script>')}var u=new Error("This is not a real error. Aborting UI5 bootstrap and restarting from: "+a);u.name="Restart";throw u}}function d(r){if(!/\/\*\*\/$/.test(r)){r=r.replace(/\/$/,"/**/")}return r.replace(/\*\*\/|\*|[[\]{}()+?.\\^$|]/g,function(r){switch(r){case"**/":return"(?:[^/]+/)*";case"*":return"[^/]*";default:return"\\"+r}})}var n;if(typeof t==="string"){var c="^(?:"+t.split(/,/).map(d).join("|")+")",h=new RegExp(c);n=function(r){return h.test(r)};r._.logger.debug("Modules that should be excluded from preload: '"+c+"'")}else if(t===true){n=function(){return true};r._.logger.debug("All modules should be excluded from preload")}r.config({debugSources:!!window["sap-ui-loaddbg"],ignoreBundledResources:n})})();function l(r,i,t){var a=window.location.search.match(new RegExp("(?:^\\??|&)sap-ui-"+r+"=([^&]*)(?:&|$)"));if(a&&(t==null||t.test(a[1]))){return a[1]}var s=p&&p.getAttribute("data-sap-ui-"+r.toLowerCase());if(s!=null&&(t==null||t.test(s))){return s}if(Object.prototype.hasOwnProperty.call(e,r)&&(t==null||t.test(e[r]))){return e[r]}if(r.slice(0,3)!=="xx-"){return l("xx-"+r,i,t)}return i}function c(r,e){return/^(?:true|x|X)$/.test(l(r,e,/^(?:true|x|X|false)$/))}if(c("async",false)){r.config({async:true})}d=c("amd",!c("noLoaderConflict",true));r.config({baseUrl:i,amd:d,map:{"*":{blanket:"sap/ui/thirdparty/blanket",crossroads:"sap/ui/thirdparty/crossroads",d3:"sap/ui/thirdparty/d3",handlebars:"sap/ui/thirdparty/handlebars",hasher:"sap/ui/thirdparty/hasher",IPv6:"sap/ui/thirdparty/IPv6",jquery:"sap/ui/thirdparty/jquery",jszip:"sap/ui/thirdparty/jszip",less:"sap/ui/thirdparty/less",OData:"sap/ui/thirdparty/datajs",punycode:"sap/ui/thirdparty/punycode",SecondLevelDomains:"sap/ui/thirdparty/SecondLevelDomains",sinon:"sap/ui/thirdparty/sinon",signals:"sap/ui/thirdparty/signals",URI:"sap/ui/thirdparty/URI",URITemplate:"sap/ui/thirdparty/URITemplate",esprima:"sap/ui/documentation/sdk/thirdparty/esprima"}},shim:{"sap/ui/thirdparty/bignumber":{amd:true,exports:"BigNumber"},"sap/ui/thirdparty/blanket":{amd:true,exports:"blanket"},"sap/ui/thirdparty/caja-html-sanitizer":{amd:false,exports:"html"},"sap/ui/thirdparty/crossroads":{amd:true,exports:"crossroads",deps:["sap/ui/thirdparty/signals"]},"sap/ui/thirdparty/d3":{amd:true,exports:"d3"},"sap/ui/thirdparty/datajs":{amd:true,exports:"OData"},"sap/ui/thirdparty/handlebars":{amd:true,exports:"Handlebars"},"sap/ui/thirdparty/hasher":{amd:true,exports:"hasher",deps:["sap/ui/thirdparty/signals"]},"sap/ui/thirdparty/IPv6":{amd:true,exports:"IPv6"},"sap/ui/thirdparty/iscroll-lite":{amd:false,exports:"iScroll"},"sap/ui/thirdparty/iscroll":{amd:false,exports:"iScroll"},"sap/ui/thirdparty/jquery":{amd:true,exports:"jQuery",deps:["sap/ui/thirdparty/jquery-compat"]},"sap/ui/thirdparty/jqueryui/jquery-ui-datepicker":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-core"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-draggable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-droppable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse","sap/ui/thirdparty/jqueryui/jquery-ui-draggable"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-effect":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-mouse":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-core","sap/ui/thirdparty/jqueryui/jquery-ui-widget"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-position":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-resizable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-selectable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-sortable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-widget":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jquery-mobile-custom":{amd:true,deps:["sap/ui/thirdparty/jquery","sap/ui/Device"],exports:"jQuery.mobile"},"sap/ui/thirdparty/jszip":{amd:true,exports:"JSZip"},"sap/ui/thirdparty/less":{amd:true,exports:"less"},"sap/ui/thirdparty/mobify-carousel":{amd:false,exports:"Mobify"},"sap/ui/thirdparty/qunit-2":{amd:false,exports:"QUnit"},"sap/ui/thirdparty/punycode":{amd:true,exports:"punycode"},"sap/ui/thirdparty/RequestRecorder":{amd:true,exports:"RequestRecorder",deps:["sap/ui/thirdparty/URI","sap/ui/thirdparty/sinon"]},"sap/ui/thirdparty/require":{exports:"define"},"sap/ui/thirdparty/SecondLevelDomains":{amd:true,exports:"SecondLevelDomains"},"sap/ui/thirdparty/signals":{amd:true,exports:"signals"},"sap/ui/thirdparty/sinon":{amd:true,exports:"sinon"},"sap/ui/thirdparty/sinon-4":{amd:true,exports:"sinon"},"sap/ui/thirdparty/sinon-server":{amd:true,exports:"sinon"},"sap/ui/thirdparty/URI":{amd:true,exports:"URI"},"sap/ui/thirdparty/URITemplate":{amd:true,exports:"URITemplate",deps:["sap/ui/thirdparty/URI"]},"sap/ui/thirdparty/vkbeautify":{amd:false,exports:"vkbeautify"},"sap/ui/thirdparty/zyngascroll":{amd:false,exports:"Scroller"},"sap/ui/demokit/js/esprima":{amd:true,exports:"esprima"},"sap/ui/documentation/sdk/thirdparty/esprima":{amd:true,exports:"esprima"},"sap/viz/libs/canvg":{deps:["sap/viz/libs/rgbcolor"]},"sap/viz/libs/rgbcolor":{},"sap/viz/libs/sap-viz":{deps:["sap/viz/library","sap/ui/thirdparty/jquery","sap/ui/thirdparty/d3","sap/viz/libs/canvg"]},"sap/viz/libs/sap-viz-info-charts":{deps:["sap/viz/libs/sap-viz-info-framework"]},"sap/viz/libs/sap-viz-info-framework":{deps:["sap/ui/thirdparty/jquery","sap/ui/thirdparty/d3"]},"sap/viz/ui5/container/libs/sap-viz-controls-vizcontainer":{deps:["sap/viz/libs/sap-viz","sap/viz/ui5/container/libs/common/libs/rgbcolor/rgbcolor_static"]},"sap/viz/ui5/controls/libs/sap-viz-vizframe/sap-viz-vizframe":{deps:["sap/viz/libs/sap-viz-info-charts"]},"sap/viz/ui5/controls/libs/sap-viz-vizservices/sap-viz-vizservices":{deps:["sap/viz/libs/sap-viz-info-charts"]},"sap/viz/resources/chart/templates/standard_fiori/template":{deps:["sap/viz/libs/sap-viz-info-charts"]}}});var h=r._.defineModuleSync;h("ui5loader.js",null);h("ui5loader-autoconfig.js",null);if(t&&typeof jQuery==="function"){h("sap/ui/thirdparty/jquery.js",jQuery);if(jQuery.ui&&jQuery.ui.position){h("sap/ui/thirdparty/jqueryui/jquery-ui-position.js",jQuery)}}var m=p&&p.getAttribute("data-sap-ui-main");if(m){sap.ui.require(m.trim().split(/\s*,\s*/))}})();
//@ui5-bundle-raw-include sap/ushell/bootstrap/cdm/cdm-def-loader.js
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
var sAsyncLoader = document.getElementById("sap-ui-bootstrap").getAttribute("data-sap-ui-async");
if (sAsyncLoader && sAsyncLoader.toLowerCase() === "true") {
    sap.ui.require(["sap/ushell/bootstrap/cdm/cdm-def"]);
} else {
    sap.ui.requireSync("sap/ushell/bootstrap/cdm/cdm-def"); // LEGACY API (deprecated)
}
