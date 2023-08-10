/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./ResultSetItem","../core/core"],function(t,e){function r(t,e){var r=typeof Symbol!=="undefined"&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=n(t))||e&&t&&typeof t.length==="number"){if(r)t=r;var i=0;var o=function(){};return{s:o,n:function(){if(i>=t.length)return{done:true};return{done:false,value:t[i++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u=true,a=false,f;return{s:function(){r=r.call(t)},n:function(){var t=r.next();u=t.done;return t},e:function(t){a=true;f=t},f:function(){try{if(!u&&r.return!=null)r.return()}finally{if(a)throw f}}}}function n(t,e){if(!t)return;if(typeof t==="string")return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);if(r==="Object"&&t.constructor)r=t.constructor.name;if(r==="Map"||r==="Set")return Array.from(t);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}function i(t,e){if(e==null||e>t.length)e=t.length;for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t,e){if(!(t instanceof e)){throw new TypeError("Cannot call a class as a function")}}function u(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(t,n.key,n)}}function a(t,e,r){if(e)u(t.prototype,e);if(r)u(t,r);Object.defineProperty(t,"prototype",{writable:false});return t}function f(t,e){if(typeof e!=="function"&&e!==null){throw new TypeError("Super expression must either be null or a function")}t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:true,configurable:true}});Object.defineProperty(t,"prototype",{writable:false});if(e)l(t,e)}function l(t,e){l=Object.setPrototypeOf||function t(e,r){e.__proto__=r;return e};return l(t,e)}function c(t){var e=v();return function r(){var n=p(t),i;if(e){var o=p(this).constructor;i=Reflect.construct(n,arguments,o)}else{i=n.apply(this,arguments)}return s(this,i)}}function s(t,e){if(e&&(typeof e==="object"||typeof e==="function")){return e}else if(e!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return b(t)}function b(t){if(t===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return t}function v(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(t){return false}}function p(t){p=Object.setPrototypeOf?Object.getPrototypeOf:function t(e){return e.__proto__||Object.getPrototypeOf(e)};return p(t)}function y(t,e,r){if(e in t){Object.defineProperty(t,e,{value:r,enumerable:true,configurable:true,writable:true})}else{t[e]=r}return t}
/*!
   * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
   */var d=t["ResultSetItem"];var h=e["generateGuid"];var g=function(t){f(n,t);var e=c(n);function n(t){var r,i,u,a,f,l,c;var s;o(this,n);s=e.call(this,t);y(b(s),"score",0);s.dataSource=(r=t.dataSource)!==null&&r!==void 0?r:s.dataSource;s.attributes=t.attributes;s.attributesMap={};if(Array.isArray(s.attributes)&&s.attributes.length>0){for(var v=0;v<s.attributes.length;++v){var p=s.attributes[v];s.attributesMap[p.id]=p}}s.titleAttributes=(i=t.titleAttributes)!==null&&i!==void 0?i:s.titleAttributes;s.titleDescriptionAttributes=(u=t.titleDescriptionAttributes)!==null&&u!==void 0?u:s.titleDescriptionAttributes;s.detailAttributes=(a=t.detailAttributes)!==null&&a!==void 0?a:s.detailAttributes;s.defaultNavigationTarget=(f=t.defaultNavigationTarget)!==null&&f!==void 0?f:s.defaultNavigationTarget;s.navigationTargets=(l=t.navigationTargets)!==null&&l!==void 0?l:s.navigationTargets;s.score=(c=t.score)!==null&&c!==void 0?c:s.score;return s}a(n,[{key:"key",get:function t(){var e=[];e.push(this.dataSource.id);var n=r(this.titleAttributes),i;try{for(n.s();!(i=n.n()).done;){var o=i.value;var u=o.getSubAttributes();var a=r(u),f;try{for(a.s();!(f=a.n()).done;){var l=f.value;e.push(l.value)}}catch(t){a.e(t)}finally{a.f()}}}catch(t){n.e(t)}finally{n.f()}if(e.length===1){e.push(h())}return e.join("-")}},{key:"toString",value:function t(){var e;var r=[];var n=[];for(e=0;e<this.titleAttributes.length;++e){var i=this.titleAttributes[e];n.push(i.toString())}r.push("--"+n.join(" "));for(e=0;e<this.detailAttributes.length;++e){var o=this.detailAttributes[e];r.push(o.toString())}return r.join("\n")}}]);return n}(d);var A={__esModule:true};A.SearchResultSetItem=g;return A})})();