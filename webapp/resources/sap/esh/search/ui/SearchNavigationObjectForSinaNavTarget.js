/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/esh/search/ui/SearchNavigationObject","./sinaNexTS/sina/ObjectSuggestion","./sinaNexTS/sina/SearchResultSetItem","./sinaNexTS/sina/SearchResultSetItemAttribute"],function(e,t,r,n){function i(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}function a(e,t,r){if(t)o(e.prototype,t);if(r)o(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}function u(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});Object.defineProperty(e,"prototype",{writable:false});if(t)f(e,t)}function f(e,t){f=Object.setPrototypeOf||function e(t,r){t.__proto__=r;return t};return f(e,t)}function c(e){var t=p();return function r(){var n=g(e),i;if(t){var o=g(this).constructor;i=Reflect.construct(n,arguments,o)}else{i=n.apply(this,arguments)}return s(this,i)}}function s(e,t){if(t&&(typeof t==="object"||typeof t==="function")){return t}else if(t!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return l(e)}function l(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function p(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(e){return false}}function g(e){g=Object.setPrototypeOf?Object.getPrototypeOf:function e(t){return t.__proto__||Object.getPrototypeOf(t)};return g(e)}var v=t["ObjectSuggestion"];var h=r["SearchResultSetItem"];var y=n["SearchResultSetItemAttribute"];var b=function(e){u(r,e);var t=c(r);function r(e,n){var o;i(this,r);o=t.call(this,undefined,n);o._sinaNavigationTarget=e;o.setHref(e.targetUrl);o.setText(e.label);o.setTarget(e.target);o.sina=o._sinaNavigationTarget.sina;return o}a(r,[{key:"performNavigation",value:function e(t){this._model.config.beforeNavigation(this._model);this._sinaNavigationTarget.performNavigation(t)}},{key:"getResultSet",value:function e(){var t=this.getResultSetItem();if(t instanceof h){return t.parent}}},{key:"getResultSetItem",value:function e(){var t=this._sinaNavigationTarget.parent;if(t instanceof y){t=t.parent}if(!(t instanceof h)){throw"programm error"}if(t.parent instanceof v){return t.parent}return t}},{key:"getResultSetId",value:function e(){return this.getResultSet().id}},{key:"getPositionInList",value:function e(){var t=this.getResultSet();var r=this.getResultSetItem();return t.items.indexOf(r)}}]);return r}(e);return b})})();